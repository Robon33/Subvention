const REGION_MAP = {
  nouvelle_aquitaine:      'reg-75',
  ile_de_france:           'reg-11',
  auvergne_rhone_alpes:    'reg-84',
  occitanie:               'reg-76',
  hauts_de_france:         'reg-32',
  grand_est:               'reg-44',
  paca:                    'reg-93',
  bretagne:                'reg-53',
  pays_de_la_loire:        'reg-52',
  normandie:               'reg-28',
  bourgogne_franche_comte: 'reg-27',
  centre_val_de_loire:     'reg-24',
  corse:                   'reg-94',
}

function estimerMontant(aid_types) {
  if (aid_types?.includes('grant'))      return 20000
  if (aid_types?.includes('loan'))       return 50000
  if (aid_types?.includes('tax_relief')) return 15000
  return 5000
}

function mapSubcategories(subcategories = []) {
  const mapped = []
  for (const s of subcategories) {
    const name = typeof s === 'string' ? s : (s.name || '')
    if (/num[eé]rique|digital/i.test(name))              mapped.push('digital')
    else if (/emploi/i.test(name))                        mapped.push('recruter_cdi')
    else if (/formation/i.test(name))                     mapped.push('former')
    else if (/environnement|[eé]nergie/i.test(name))     mapped.push('energie')
    else if (/accessibilit[eé]/i.test(name))              mapped.push('pmr')
    else if (/immobilier|r[eé]novation/i.test(name))     mapped.push('renover')
    else if (/[eé]quipement|investissement/i.test(name)) mapped.push('materiel')
    else if (/innovation/i.test(name))                    mapped.push('innovation')
  }
  return [...new Set(mapped)]
}

export async function fetchAidesTerritoriales(region) {
  const perimeter = region ? REGION_MAP[region] : null
  const params = new URLSearchParams({ format: 'json', page_size: '50' })
  if (perimeter) params.set('perimeter', perimeter)

  const res = await fetch(
    `https://aides-territoires.beta.gouv.fr/api/aids/?${params}`,
    { headers: { Accept: 'application/json' } }
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const data = await res.json()
  return (data.results || []).map((aid) => ({
    id: aid.slug,
    nom: aid.name,
    description: aid.description?.substring(0, 200),
    montantMin: 0,
    montantMax: estimerMontant(aid.aid_types),
    organismes: aid.financers?.map((f) => f.name) || [],
    tags: {
      projets: mapSubcategories(aid.subcategories || []),
      tailles: [],
    },
    source: aid.url,
    _scraped: true,
  }))
}
