export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const SUPABASE_URL = process.env.SUBVENTIONPRO_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  const {
    email,
    siren,
    nomEntreprise,
    secteur,
    taille,
    region,
    projets,
    nbAides,
    montantTotal,
    aides,
  } = req.body

  // Score CRM : Hot 75+, Warm 45-74, Cold <45
  let score = 0
  if (montantTotal > 50000) score += 40
  else if (montantTotal > 20000) score += 25
  else if (montantTotal > 5000) score += 10

  if (email) score += 30
  if (siren) score += 20
  if (nbAides >= 3) score += 10

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/simulations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          email: email || null,
          siren: siren || null,
          nom_entreprise: nomEntreprise || null,
          secteur: secteur || null,
          taille: taille || null,
          region: region || null,
          projets: projets || [],
          nb_aides: nbAides || 0,
          montant_total: montantTotal || 0,
          aides: aides || [],
          score,
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      throw new Error(err)
    }

    const data = await response.json()
    return res.status(200).json({ success: true, id: data[0]?.id, score })

  } catch (err) {
    console.error('Supabase error:', err)
    return res.status(200).json({ success: false, error: err.message })
  }
}
