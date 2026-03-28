// ─── Filière par secteur (codes les-aides.fr) ────────────────────────────────

const FILIERE_MAP = {
  restauration: 337,  // Métiers de bouche
  commerce:     391,  // Service aux entreprises
  artisanat:    336,  // Artisanat
  hotellerie:   338,  // Tourisme
  sante:        297,  // Santé
  batiment:     295,  // BTP matériaux de construction
  services:     391,  // Service aux entreprises
}

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

// ─── Mapping entreprise (remplace api/sirene.js) ─────────────────────────────

function mapEtablissement(etab) {
  if (!etab) return null

  const naf = etab.ape || ''
  const code2 = naf.replace('.', '').substring(0, 2)
  const secteurMap = {
    '56': 'restauration', '47': 'commerce',
    '43': 'artisanat',    '42': 'artisanat',
    '41': 'batiment',
    '55': 'hotellerie',
    '86': 'sante',        '87': 'sante',
  }
  const secteur = secteurMap[code2] || 'services'

  const effectif = etab.tranche_effectif || ''
  const tailleMap = {
    '00': 'micro', '01': 'micro',
    '02': 'tpe',   '03': 'tpe',
    '11': 'pme',   '12': 'pme', '21': 'pme',
  }
  const taille = tailleMap[effectif] || 'micro'

  let anciennete = 'plus_3_ans'
  let anneeCreation = null
  const dateCreation = etab.date_creation
  if (dateCreation) {
    anneeCreation = String(dateCreation).substring(0, 4)
    const annees = (Date.now() - new Date(dateCreation)) / (1000 * 60 * 60 * 24 * 365)
    if (annees < 1) anciennete = 'moins_1_an'
    else if (annees < 3) anciennete = '1_3_ans'
  }

  // Département depuis le code commune (2 premiers chiffres, sauf Corse)
  const commune = etab.commune || ''
  let departement = ''
  if (commune.startsWith('2A') || commune.startsWith('2B')) {
    departement = commune.substring(0, 2)
  } else if (commune.length >= 2) {
    departement = commune.substring(0, 2)
  }

  // Département → région
  const deptRegionMap = {
    '01':'auvergne_rhone_alpes','03':'auvergne_rhone_alpes','07':'auvergne_rhone_alpes','15':'auvergne_rhone_alpes',
    '26':'auvergne_rhone_alpes','38':'auvergne_rhone_alpes','42':'auvergne_rhone_alpes','43':'auvergne_rhone_alpes',
    '63':'auvergne_rhone_alpes','69':'auvergne_rhone_alpes','73':'auvergne_rhone_alpes','74':'auvergne_rhone_alpes',
    '21':'bourgogne_franche_comte','25':'bourgogne_franche_comte','39':'bourgogne_franche_comte',
    '58':'bourgogne_franche_comte','70':'bourgogne_franche_comte','71':'bourgogne_franche_comte',
    '89':'bourgogne_franche_comte','90':'bourgogne_franche_comte',
    '22':'bretagne','29':'bretagne','35':'bretagne','56':'bretagne',
    '18':'centre_val_de_loire','28':'centre_val_de_loire','36':'centre_val_de_loire',
    '37':'centre_val_de_loire','41':'centre_val_de_loire','45':'centre_val_de_loire',
    '2A':'corse','2B':'corse',
    '08':'grand_est','10':'grand_est','51':'grand_est','52':'grand_est','54':'grand_est',
    '55':'grand_est','57':'grand_est','67':'grand_est','68':'grand_est','88':'grand_est',
    '02':'hauts_de_france','59':'hauts_de_france','60':'hauts_de_france','62':'hauts_de_france','80':'hauts_de_france',
    '75':'ile_de_france','77':'ile_de_france','78':'ile_de_france','91':'ile_de_france',
    '92':'ile_de_france','93':'ile_de_france','94':'ile_de_france','95':'ile_de_france',
    '14':'normandie','27':'normandie','50':'normandie','61':'normandie','76':'normandie',
    '16':'nouvelle_aquitaine','17':'nouvelle_aquitaine','19':'nouvelle_aquitaine','23':'nouvelle_aquitaine',
    '24':'nouvelle_aquitaine','33':'nouvelle_aquitaine','40':'nouvelle_aquitaine','47':'nouvelle_aquitaine',
    '64':'nouvelle_aquitaine','79':'nouvelle_aquitaine','86':'nouvelle_aquitaine','87':'nouvelle_aquitaine',
    '09':'occitanie','11':'occitanie','12':'occitanie','30':'occitanie','31':'occitanie',
    '32':'occitanie','34':'occitanie','46':'occitanie','48':'occitanie','65':'occitanie',
    '66':'occitanie','81':'occitanie','82':'occitanie',
    '44':'pays_de_la_loire','49':'pays_de_la_loire','53':'pays_de_la_loire',
    '72':'pays_de_la_loire','85':'pays_de_la_loire',
    '04':'paca','05':'paca','06':'paca','13':'paca','83':'paca','84':'paca',
  }
  const region = deptRegionMap[departement] || ''

  return {
    nom: etab.raison_sociale || etab.nom || '',
    siren: etab.siren || '',
    naf,
    secteur,
    taille,
    anciennete,
    anneeCreation,
    region,
    departement,
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  const IDC = process.env.LES_AIDES_API_KEY
  const { siren, ape, departement, projets, requete, secteur } = req.query

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

  // Si on a un idr existant (requete), on le réutilise
  if (requete) {
    params.set('requete', requete)
  } else if (siren && siren.length === 9) {
    params.set('siren', siren)
  } else {
    params.set('ape', ape || 'A') // fallback APE générique
    if (departement) params.set('departement', departement)
  }

  domaines.forEach(d => params.append('domaine[]', d))
  params.set('moyen', 833)

  // Filière sectorielle
  const filiere = secteur ? FILIERE_MAP[secteur] : null
  if (filiere) params.set('filiere', filiere)

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
      return res.status(200).json({ aides: [], entreprise: null, error: err.exception || `HTTP ${response.status}` })
    }

    const data = await response.json()
    const dispositifs = data.dispositifs || []
    const idr = data.idr

    // Extraire l'établissement (renvoyé par les-aides.fr quand siren est fourni)
    const entreprise = mapEtablissement(data.etablissement)

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

      // Aide confirmée si territoriale ou organisme connu
      const sigle = d.sigle || ''
      const confirmed = (
        d.implantation === 'T' ||
        ['France Travail', 'URSSAF', 'Bpifrance'].includes(sigle)
      )

      return {
        id: String(d.numero),
        nom: d.nom,
        description: descriptionPropre,
        montantMin: min,
        montantMax: max || 10000,
        organismes: [sigle || 'Organisme public'],
        implantation: d.implantation,
        confirmed,
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

    return res.status(200).json({ aides, entreprise, idr })

  } catch (err) {
    console.error('Erreur les-aides.fr:', err)
    return res.status(200).json({ aides: [], entreprise: null, error: err.message })
  }
}
