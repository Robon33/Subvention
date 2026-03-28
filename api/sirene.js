const cache = new Map()
const CACHE_TTL = 60 * 60 * 1000 // 1 heure

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  const { siren } = req.query
  const sirenClean = siren?.replace(/\s/g, '')

  if (!sirenClean || sirenClean.length !== 9) {
    return res.status(400).json({ error: 'SIREN invalide' })
  }

  const cached = cache.get(sirenClean)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return res.status(200).json(cached.data)
  }

  try {
    const response = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${sirenClean}&per_page=1`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const entreprise = data.results?.[0]

    if (!entreprise) {
      return res.status(404).json({ error: 'Entreprise non trouvée' })
    }

    // Mapper NAF → secteur
    const naf = entreprise.activite_principale || ''
    const code2 = naf.replace('.', '').substring(0, 2)
    const secteurMap = {
      '56': 'restauration', '47': 'commerce',
      '43': 'artisanat',    '42': 'artisanat',
      '41': 'batiment',
      '55': 'hotellerie',
      '86': 'sante',        '87': 'sante',
    }
    const secteur = secteurMap[code2] || 'services'

    // Mapper effectif → taille
    const effectif = entreprise.tranche_effectif_salarie
    const tailleMap = {
      '00': 'micro', '01': 'micro',
      '02': 'tpe',   '03': 'tpe',
      '11': 'pme',   '12': 'pme', '21': 'pme',
    }
    const taille = tailleMap[effectif] || 'micro'

    // Calculer ancienneté + année de création
    let anciennete = 'plus_3_ans'
    let anneeCreation = null
    const dateCreation = entreprise.date_creation
    if (dateCreation) {
      anneeCreation = dateCreation.substring(0, 4)
      const annees = (Date.now() - new Date(dateCreation)) / (1000 * 60 * 60 * 24 * 365)
      if (annees < 1) anciennete = 'moins_1_an'
      else if (annees < 3) anciennete = '1_3_ans'
    }

    // Mapper région → valeur interne
    const regionCode = entreprise.siege?.region
    const regionMap = {
      '75': 'nouvelle_aquitaine',
      '11': 'ile_de_france',
      '84': 'auvergne_rhone_alpes',
      '76': 'occitanie',
      '32': 'hauts_de_france',
      '44': 'grand_est',
      '93': 'paca',
      '53': 'bretagne',
      '52': 'pays_de_la_loire',
      '28': 'normandie',
      '27': 'bourgogne_franche_comte',
      '24': 'centre_val_de_loire',
      '94': 'corse',
    }

    // Département principal par région (fallback)
    const deptMap = {
      '75': '33', '11': '75', '84': '69',
      '76': '31', '32': '59', '44': '67',
      '93': '13', '53': '35', '52': '44',
      '28': '76', '27': '21', '24': '45', '94': '2A',
    }

    const result = {
      nom: entreprise.nom_complet,
      siren: sirenClean,
      naf,
      secteur,
      taille,
      anciennete,
      anneeCreation,
      region: regionMap[regionCode] || '',
      departement: entreprise.siege?.departement || deptMap[regionCode] || '',
    }

    cache.set(sirenClean, { data: result, ts: Date.now() })
    return res.status(200).json(result)

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
