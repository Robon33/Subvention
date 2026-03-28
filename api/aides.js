export default async function handler(req, res) {
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

    const aides = dispositifs.slice(0, 15).map(d => ({
      id: String(d.numero),
      nom: d.nom,
      description: d.resume || '',
      montantMin: 0,
      montantMax: 10000,
      organismes: [d.sigle || 'Organisme public'],
      implantation: d.implantation,
      tags: { projets: projetsList, tailles: [] },
      source: d.uri || 'https://les-aides.fr',
      numeroDispositif: d.numero,
      idr,
      _scraped: true,
    }))

    return res.status(200).json({ aides, idr })

  } catch (err) {
    console.error('Erreur les-aides.fr:', err)
    return res.status(200).json({ aides: [], error: err.message })
  }
}
