#!/usr/bin/env node
/**
 * Scraper aides-territoires.beta.gouv.fr
 * Usage : npm run scrape
 *
 * Utilise l'API publique de la plateforme (JSON) via Playwright.
 * Génère src/data/aides.json intégré automatiquement dans le simulateur.
 */

import { chromium } from 'playwright'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '../src/data/aides.json')

const API_BASE = 'https://aides-territoires.beta.gouv.fr/api/aids/'
const MAX_PAGES = 5   // 5 × 100 = 500 aides max
const PAGE_SIZE = 100

// ─── Nettoyage HTML ─────────────────────────────────────────────────────────

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── Parsing des montants ────────────────────────────────────────────────────

function normalizeNumber(str) {
  // "50 000" → 50000, "50k" → 50000
  const clean = str.replace(/\s/g, '').replace(/k$/i, '000')
  const n = parseInt(clean, 10)
  return isNaN(n) ? null : n
}

function isValidAmount(n) {
  // Filtre les années (1900-2099) et les montants aberrants
  if (!n) return false
  if (n >= 1900 && n <= 2099) return false
  if (n < 500) return false
  if (n > 10_000_000) return false
  return true
}

function parseAmounts(text) {
  if (!text) return { montantMin: null, montantMax: null }

  const t = stripHtml(text)

  // "de X à Y €" ou "entre X et Y €"
  const rangeMatch = t.match(
    /(?:de|entre)\s*([\d\s]+)\s*(?:€|euros?)?\s*(?:à|et)\s*([\d\s]+)\s*[€$k]/i
  )
  if (rangeMatch) {
    const min = normalizeNumber(rangeMatch[1])
    const max = normalizeNumber(rangeMatch[2])
    if (isValidAmount(min) && isValidAmount(max) && max > min) {
      return { montantMin: min, montantMax: max }
    }
  }

  // "jusqu'à X €" / "maximum X €" / "plafonné à X €" / "pouvant atteindre X €"
  const upToMatch = t.match(
    /(?:jusqu['']à|maximum|max\.?|plafonnée?\s+à|pouvant\s+atteindre|ne\s+dépassant\s+pas)\s*([\d\s]+)\s*[€$k]/i
  )
  if (upToMatch) {
    const max = normalizeNumber(upToMatch[1])
    if (isValidAmount(max)) return { montantMin: null, montantMax: max }
  }

  // "prime de X €" / "subvention de X €" / "aide de X €"
  const fixedMatch = t.match(
    /(?:prime|subvention|aide|dotation|montant)\s+(?:fixe\s+)?(?:de\s+)?([\d\s]+)\s*[€$k]/i
  )
  if (fixedMatch) {
    const amount = normalizeNumber(fixedMatch[1])
    if (isValidAmount(amount)) return { montantMin: amount, montantMax: amount }
  }

  // Dernier recours : premier montant en € isolé dans le texte
  const fallback = t.match(/([\d][\d\s]{2,})\s*€/)
  if (fallback) {
    const amount = normalizeNumber(fallback[1])
    if (isValidAmount(amount)) return { montantMin: null, montantMax: amount }
  }

  return { montantMin: null, montantMax: null }
}

// ─── Inférence de tags depuis le texte ──────────────────────────────────────

const PROJET_PATTERNS = [
  { tag: 'materiel',   re: /mat[eé]riel|[eé]quipement|machine|outillage|investissement\s+productif/i },
  { tag: 'digital',    re: /num[eé]rique|digital|logiciel|site\s+web|e-commerce|caisse|digitalisation|transition\s+num/i },
  { tag: 'recruter',   re: /recrutement|embauche|emploi|salar[ié]|CDI|alternance|apprentissage|formation/i },
  { tag: 'renover',    re: /r[eé]novation|travaux|local|b[âa]timent|am[eé]nagement|mise\s+aux\s+normes/i },
  { tag: 'pmr',        re: /PMR|accessibilit[eé]|handicap|personnes?\s+[àa]\s+mobilit[eé]/i },
  { tag: 'energie',    re: /[eé]nergie|[eé]cologique|[eé]nergivore|isolation|renouvelable|d[eé]carbonat|thermique|photovolta/i },
  { tag: 'innovation', re: /innovation|innovant|recherche|d[eé]veloppement|R&D|prototype|amorçage|start.?up/i },
]

const TAILLE_PATTERNS = [
  { tag: 'micro', re: /micro.entreprise|auto.entrepreneur|tr[aè]s\s+petite\s+entreprise\s*\(?\s*0|ind[eé]pendant/i },
  { tag: 'tpe',   re: /TPE|tr[eè]s\s+petite\s+entreprise|moins\s+de\s+10\s+salari/i },
  { tag: 'pme',   re: /PME|petite\s+et\s+moyenne|moins\s+de\s+250\s+salari|ETI/i },
]

function inferTags(aid) {
  const fullText = [
    aid.name,
    stripHtml(aid.description),
    stripHtml(aid.eligibility),
    (aid.categories || []).map(c => c.name || c).join(' '),
  ].join(' ')

  const projets = PROJET_PATTERNS
    .filter(({ re }) => re.test(fullText))
    .map(({ tag }) => tag)

  const tailles = TAILLE_PATTERNS
    .filter(({ re }) => re.test(fullText))
    .map(({ tag }) => tag)

  return {
    projets: [...new Set(projets)],
    tailles: [...new Set(tailles)],
  }
}

// ─── Transformation d'une aide API → format simulateur ──────────────────────

function transformAide(raw) {
  const descText  = stripHtml(raw.description)
  const eligText  = stripHtml(raw.eligibility)
  const fullText  = `${descText} ${eligText}`
  const amounts   = parseAmounts(fullText)
  const tags      = inferTags({ ...raw, description: raw.description, eligibility: raw.eligibility })

  const organismes = [
    ...(raw.financers  || []).map(f => f.name),
    ...(raw.instructors || []).map(i => i.name),
  ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i) // unique

  return {
    id:          raw.slug || String(raw.id),
    nom:         raw.name,
    description: descText.slice(0, 350).trim(),
    montantMin:  amounts.montantMin,
    montantMax:  amounts.montantMax,
    organismes:  organismes.length ? organismes : ['Collectivité / État'],
    tags,
    source:      raw.url || `https://aides-territoires.beta.gouv.fr/aides/${raw.slug || raw.id}/`,
  }
}

// ─── Appels API paginés ──────────────────────────────────────────────────────

async function fetchPage(apiContext, url) {
  const res = await apiContext.get(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'SimulateurSubventions/1.0 (open-source)',
    },
    timeout: 20_000,
  })

  if (!res.ok()) {
    throw new Error(`HTTP ${res.status()} pour ${url}`)
  }

  return res.json()
}

async function scrapeAllAides(browser) {
  const context = await browser.newContext()
  const api     = context.request

  const firstUrl = `${API_BASE}?targeted_audiences=private_sector&aid_types=grant%2Crepayable_advance%2Ctax_benefit&page_size=${PAGE_SIZE}`

  const aides = []
  let nextUrl = firstUrl
  let page = 1

  while (nextUrl && page <= MAX_PAGES) {
    console.log(`  📄 Page ${page}/${MAX_PAGES} — ${nextUrl.split('?')[1]?.slice(0, 60)}…`)

    try {
      const data = await fetchPage(api, nextUrl)
      const results = data.results || []

      for (const raw of results) {
        try {
          aides.push(transformAide(raw))
        } catch (e) {
          console.warn(`  ⚠️  Aide ignorée (${raw.slug}): ${e.message}`)
        }
      }

      console.log(`     → ${results.length} aides récupérées (total: ${aides.length})`)
      nextUrl = data.next || null
      page++

      // Pause courte pour ne pas surcharger l'API
      await new Promise(r => setTimeout(r, 500))
    } catch (e) {
      console.error(`  ❌ Erreur page ${page}: ${e.message}`)
      break
    }
  }

  await context.close()
  return aides
}

// ─── Fusion avec les aides existantes ───────────────────────────────────────

function mergeWithExisting(scraped) {
  // Si un fichier aides.json existe déjà, préserver les aides manuelles
  // (celles dont l'id ne commence pas par un chiffre et qui ne viennent pas du scraper)
  let existingManual = []

  if (existsSync(OUTPUT_PATH)) {
    try {
      const existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
      existingManual = (existing.aides || []).filter(a => a._manual === true)
    } catch {
      // ignore
    }
  }

  // Dédoublonner : les aides scrapées priment sur les manuelles avec le même id
  const scrapedIds = new Set(scraped.map(a => a.id))
  const uniqueManual = existingManual.filter(a => !scrapedIds.has(a.id))

  return [...scraped, ...uniqueManual]
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 Scraping aides-territoires.beta.gouv.fr…\n')
  console.log(`   API : ${API_BASE}`)
  console.log(`   Cible : secteur privé (TPE/PME)`)
  console.log(`   Max  : ${MAX_PAGES * PAGE_SIZE} aides\n`)

  const browser = await chromium.launch({ headless: true })

  try {
    const scraped = await scrapeAllAides(browser)
    const aides   = mergeWithExisting(scraped)

    const output = {
      generatedAt: new Date().toISOString(),
      source:      'aides-territoires.beta.gouv.fr',
      total:       aides.length,
      aides,
    }

    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')

    console.log(`\n✅ ${aides.length} aides sauvegardées dans src/data/aides.json`)
    console.log(`   Dont ${scraped.length} scrapées + ${aides.length - scraped.length} manuelles`)

    // Statistiques
    const avecMontant = aides.filter(a => a.montantMax).length
    const sansMontant = aides.length - avecMontant
    console.log(`   Montant détecté : ${avecMontant} / ${aides.length}`)
    if (sansMontant) console.log(`   Sans montant    : ${sansMontant} (affichées en "variable")`)

    const parProjet = {}
    for (const a of aides) {
      for (const t of a.tags?.projets || []) {
        parProjet[t] = (parProjet[t] || 0) + 1
      }
    }
    console.log('\n   Répartition par projet :')
    for (const [k, v] of Object.entries(parProjet).sort((a, b) => b[1] - a[1])) {
      console.log(`     ${k.padEnd(12)} ${v}`)
    }
  } finally {
    await browser.close()
  }

  console.log('\n🚀 Relancez le simulateur pour voir les nouvelles aides.\n')
}

main().catch(err => {
  console.error('\n❌ Scraping échoué :', err.message)
  process.exit(1)
})
