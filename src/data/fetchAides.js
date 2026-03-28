export async function fetchAidesTerritoriales(params = {}) {
  try {
    const { siren, ape, departement, projets = [], requete, secteur } = params
    const query = new URLSearchParams()

    // Si on a un idr existant, on le réutilise (évite de renvoyer le siren)
    if (requete)           query.set('requete', requete)
    else if (siren)        query.set('siren', siren)

    if (ape)               query.set('ape', ape)
    if (departement)       query.set('departement', departement)
    if (secteur)           query.set('secteur', secteur)
    if (projets.length)    query.set('projets', projets.join(','))

    const res = await fetch(`/api/aides?${query}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    return data.aides || []

  } catch (err) {
    console.warn('API aides indisponible, fallback JSON:', err)
    return []
  }
}
