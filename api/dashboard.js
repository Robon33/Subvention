export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  const SUPABASE_URL = process.env.SUBVENTIONPRO_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/simulations?order=created_at.desc&limit=100`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    )

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const leads = await response.json()
    return res.status(200).json({ leads })

  } catch (err) {
    return res.status(500).json({ leads: [], error: err.message })
  }
}
