import aidesData from './aides.json'

// ─── Règles d'éligibilité explicites (keyed par aide.id) ────────────────────
const RULES = {
  investissement_materiel: (r) =>
    r.projets?.some(p => ['materiel'].includes(p)) &&
    r.taille !== 'micro' &&
    r.taille !== 'creation' &&
    r.anciennete !== 'moins_1_an' &&
    r.montantInvestissement !== 'moins_10k',

  cheque_numerique: (r) =>
    r.projets?.includes('digital') &&
    (r.taille === 'micro' || r.taille === 'tpe' || r.taille === 'creation'),

  aide_embauche: (r) =>
    r.projets?.includes('recruter_cdi'),

  alternance: (r) =>
    r.projets?.includes('recruter_alternance'),

  fne_formation: (r) =>
    r.projets?.includes('former') &&
    r.taille !== 'micro' &&
    r.taille !== 'creation',

  renovation_energetique: (r) =>
    r.projets?.includes('energie'),

  pmr: (r) =>
    r.projets?.includes('pmr') &&
    r.localERP === 'oui',

  french_tech: (r) =>
    r.projets?.includes('innovation') &&
    (r.anciennete === 'moins_1_an' || r.taille === 'creation') &&
    r.statutInnovant === 'oui',

  acre: (r) =>
    r.anciennete === 'moins_1_an' || r.taille === 'creation',

  renovation_locale: (r) =>
    r.projets?.includes('renover') &&
    r.localERP === 'oui',

  export: (r) =>
    r.projets?.includes('export') &&
    r.taille !== 'micro' &&
    r.taille !== 'creation',
}

// ─── Fallback basé sur les tags (pour les aides scrapées) ───────────────────
function ruleFromTags(aide) {
  const { projets = [], tailles = [] } = aide.tags || {}
  return (r) => {
    const projetMatch =
      projets.length === 0 || projets.some((p) => r.projets?.includes(p))
    const tailleMatch =
      tailles.length === 0 || tailles.includes(r.taille)
    return projetMatch && tailleMatch
  }
}

function toDispositif(aide) {
  return {
    ...aide,
    organisme: aide.organismes?.join(' / ') || '',
    eligible: RULES[aide.id] ?? ruleFromTags(aide),
  }
}

// Aides manuelles (base)
const dispositifsBase = aidesData.aides.map(toDispositif)
const idsBase = new Set(aidesData.aides.map((a) => a.id))

// ─── API publique ────────────────────────────────────────────────────────────

export function calculerEligibilite(reponses, aidesExternes = []) {
  // Les aides manuelles ont la priorité absolue.
  // Les aides externes sont ajoutées uniquement si leur id n'existe pas en base.
  const externes = aidesExternes
    .filter((a) => !idsBase.has(a.id))
    .map(toDispositif)

  return [...dispositifsBase, ...externes].filter((d) => d.eligible(reponses))
}

export function calculerMontantTotal(dispositifsEligibles) {
  return dispositifsEligibles.reduce((acc, d) => acc + (d.montantMax ?? 0), 0)
}

export const aidesMetadata = {
  generatedAt: aidesData.generatedAt,
  source: aidesData.source,
  total: aidesData.total,
}
