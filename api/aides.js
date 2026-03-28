// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHTML(html) {
  return html
    .replace(/&euro;/gi, '€')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#8239;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&eacute;/gi, 'é')
    .replace(/&agrave;/gi, 'à')
    .replace(/&egrave;/gi, 'è')
    .replace(/&ugrave;/gi, 'ù')
    .replace(/&ccedil;/gi, 'ç')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseMontantHTML(html) {
  if (!html) return { min: 0, max: 10000 }

  const texte = stripHTML(html).toLowerCase()

  const parseNum = (str) => {
    if (!str) return 0
    return parseInt(str.replace(/\s/g, '')) || 0
  }

  // Pattern "de X à Y €"
  const rangeMatch = texte.match(/de\s+([\d\s]+)[€e]?\s*[àa]\s*([\d\s]+)\s*[€e]/)
  if (rangeMatch) {
    return { min: parseNum(rangeMatch[1]), max: parseNum(rangeMatch[2]) }
  }

  // Pattern "jusqu'à X €"
  const jusquaMatch = texte.match(/jusqu['\u2019\s]?[àa]\s*([\d][\d\s]*)\s*[€e]/)
  if (jusquaMatch) {
    return { min: 0, max: parseNum(jusquaMatch[1]) }
  }

  // Pattern "maximum X €"
  const maxMatch = texte.match(/(?:maximum|maxi|plafond)[^\d]*([\d][\d\s]*)\s*[€e]/)
  if (maxMatch) {
    return { min: 0, max: parseNum(maxMatch[1]) }
  }

  // Pattern "X € par jour/an/mois" (taux journalier → multiplier par 10)
  const tauxMatch = texte.match(/([\d][\d\s]*)\s*€\s*par\s*(?:jour|an|mois)/)
  if (tauxMatch) {
    return { min: 0, max: parseNum(tauxMatch[1]) * 10 }
  }

  // Premier nombre suivi de €
  const firstNum = texte.match(/([\d][\d\s]{3,})\s*[€e]/)
  if (firstNum) {
    return { min: 0, max: parseNum(firstNum[1]) }
  }

  return { min: 0, max: 10000 }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  const IDC = process.env.LES_AIDES_API_KEY
  const { siren, ape, departement, projets } = req.query

  const projetsMap = {
    materiel:            [802],
    digital:             [862],
    recruter_cdi:        [816],
    recruter_alternance: [816],
    former:              [816],
    renover:             [802, 805],
    pmr:                 [802, 805],
    energie:             [813],
    innovation:          [807],
    export:              [810],
    creation_projet:     [790],
  }

  const projetsList = (projets || '').split(',').filter(Boolean)
  const domainesSet = new Set()

  domainesSet.add(802) // Investissement — toujours pertinent

  projetsList.forEach(p => {
    ;(projetsMap[p] || []).forEach(d => domainesSet.add(d))
  })

  const domaines = [...domainesSet]

  const params = new URLSearchParams({ idc: IDC })

  if (siren && siren.length === 9) {
    params.set('siren', siren)
  } else {
    params.set('ape', ape || 'A') // fallback APE générique
    if (departement) params.set('departement', departement)
  }

  domaines.forEach(d => params.append('domaine[]', d))
  params.set('moyen', 833)

  try {
    const response = await fetch(
      `https://api.les-aides.fr/aides/?${params}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-IDC': IDC,
          'User-Agent': 'SubventionPro/1.0',
        }
      }
    )

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(200).json({ aides: [], error: err.exception || `HTTP ${response.status}` })
    }

    const data = await response.json()
    const dispositifs = data.dispositifs || []
    const idr = data.idr

    // Charger fiches détaillées des 5 premières aides en parallèle (quota : 5 max)
    const fichesPromises = dispositifs.slice(0, 5).map(d =>
      fetch(
        `https://api.les-aides.fr/aide/?idc=${IDC}&requete=${idr}&dispositif=${d.numero}`,
        {
          headers: { 'Accept': 'application/json', 'X-IDC': IDC },
          signal: AbortSignal.timeout(5000),
        }
      )
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
    )

    const fiches = await Promise.all(fichesPromises)

    // Construire les aides enrichies
    const aides = dispositifs.slice(0, 15).map((d, i) => {
      const fiche = fiches[i] || null

      const montantBrut = fiche?.montants || ''
      const { min, max } = parseMontantHTML(montantBrut)

      const descriptionPropre = stripHTML(fiche?.objet || d.resume || '')
        .substring(0, 300)

      const adresse = fiche?.organisme?.adresses?.[0]

      return {
        id: String(d.numero),
        nom: d.nom,
        description: descriptionPropre,
        montantMin: min,
        montantMax: max || 10000,
        organismes: [d.sigle || 'Organisme public'],
        implantation: d.implantation,
        tags: { projets: projetsList, tailles: [] },
        source: d.uri || 'https://les-aides.fr',
        contact: adresse ? {
          telephone: adresse.telephone,
          email: adresse.email,
          web: adresse.web,
        } : null,
        numeroDispositif: d.numero,
        idr,
        _scraped: true,
      }
    })

    return res.status(200).json({ aides, idr })

  } catch (err) {
    console.error('Erreur les-aides.fr:', err)
    return res.status(200).json({ aides: [], error: err.message })
  }
}
