import aidesData from './aides.json' with { type: 'json' }

// ─── Règles d'éligibilité explicites (keyed par aide.id) ────────────────────
//
// Ces règles surpassent le fallback tag-based pour les aides "curées".
// Elles correspondent au questionnaire (reponses) de Simulateur.jsx.
//
const RULES = {
  investissement_materiel: (r) =>
    r.projets?.includes('materiel') &&
    r.taille !== 'micro' &&
    r.anciennete !== 'moins_1_an' &&
    r.montantInvestissement !== 'moins_10k',

  cheque_numerique: (r) =>
    r.projets?.includes('digital') &&
    (r.taille === 'micro' || r.taille === 'tpe'),

  aide_embauche: (r) =>
    r.projets?.includes('recruter') && r.typeRecrutement === 'cdi',

  alternance: (r) =>
    r.projets?.includes('recruter') && r.typeRecrutement === 'alternance',

  fne_formation: (r) =>
    r.projets?.includes('recruter') &&
    r.typeRecrutement === 'formation' &&
    r.taille !== 'micro',

  renovation_energetique: (r) => r.projets?.includes('energie'),

  pmr: (r) => r.projets?.includes('pmr') && r.localERP === 'oui',

  french_tech: (r) =>
    r.projets?.includes('innovation') &&
    r.anciennete === 'moins_1_an' &&
    r.statutInnovant === 'oui',

  acre: (r) => r.anciennete === 'moins_1_an',

  renovation_locale: (r) => r.projets?.includes('renover'),
}

// ─── Fallback basé sur les tags (pour les aides scrapées) ───────────────────

function ruleFromTags(aide) {
  const { projets = [], tailles = [] } = aide.tags || {}

  return (r) => {
    // Si aucun tag projet → l'aide est générique, on la montre à tous
    const projetMatch =
      projets.length === 0 || projets.some((p) => r.projets?.includes(p))

    // Si aucun tag taille → compatible toutes tailles
    const tailleMatch =
      tailles.length === 0 || tailles.includes(r.taille)

    return projetMatch && tailleMatch
  }
}

// ─── Construction des dispositifs ───────────────────────────────────────────

export const dispositifs = aidesData.aides.map((aide) => ({
  ...aide,
  // organisme (singular) pour rétrocompatibilité
  organisme: aide.organismes?.join(' / ') || '',
  eligible: RULES[aide.id] ?? ruleFromTags(aide),
}))

// ─── API publique ────────────────────────────────────────────────────────────

export function calculerEligibilite(reponses) {
  return dispositifs.filter((d) => d.eligible(reponses))
}

export function calculerMontantTotal(dispositifsEligibles) {
  return dispositifsEligibles.reduce((acc, d) => acc + (d.montantMax ?? 0), 0)
}

// Meta
export const aidesMetadata = {
  generatedAt: aidesData.generatedAt,
  source:      aidesData.source,
  total:       aidesData.total,
}
