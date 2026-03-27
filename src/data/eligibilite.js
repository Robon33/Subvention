export const dispositifs = [
  {
    id: "investissement_materiel",
    nom: "Aide à l'investissement matériel",
    description: "Financement de vos équipements professionnels via les fonds régionaux et Bpifrance.",
    montantMin: 5000,
    montantMax: 26000,
    organisme: "Bpifrance / Région",
    eligible: (r) =>
      r.projets?.includes("materiel") &&
      r.taille !== "micro" &&
      r.anciennete !== "moins_1_an" &&
      r.montantInvestissement !== "moins_10k",
  },
  {
    id: "cheque_numerique",
    nom: "Chèque Transformation Numérique",
    description: "Financement de votre digitalisation : site web, logiciels de gestion, caisse enregistreuse connectée.",
    montantMin: 1500,
    montantMax: 5000,
    organisme: "BPI / Région",
    eligible: (r) =>
      r.projets?.includes("digital") &&
      (r.taille === "micro" || r.taille === "tpe"),
  },
  {
    id: "aide_embauche",
    nom: "Aide à l'embauche CDI",
    description: "Soutien financier à la création d'emplois durables dans les petites entreprises.",
    montantMin: 1000,
    montantMax: 4000,
    organisme: "État / Pôle Emploi",
    eligible: (r) =>
      r.projets?.includes("recruter") &&
      r.typeRecrutement === "cdi",
  },
  {
    id: "alternance",
    nom: "Aide à l'alternance",
    description: "Prime apprentissage versée dès la première année de contrat d'alternance.",
    montantMin: 6000,
    montantMax: 6000,
    organisme: "État",
    eligible: (r) =>
      r.projets?.includes("recruter") &&
      r.typeRecrutement === "alternance",
  },
  {
    id: "fne_formation",
    nom: "FNE-Formation",
    description: "Financement de la montée en compétences de vos salariés existants.",
    montantMin: 2000,
    montantMax: 15000,
    organisme: "France Travail",
    eligible: (r) =>
      r.projets?.includes("recruter") &&
      r.typeRecrutement === "formation" &&
      r.taille !== "micro",
  },
  {
    id: "renovation_energetique",
    nom: "Aide ADEME Rénovation Énergétique",
    description: "Financement de vos travaux et équipements pour réduire votre consommation d'énergie.",
    montantMin: 5000,
    montantMax: 25000,
    organisme: "ADEME",
    eligible: (r) => r.projets?.includes("energie"),
  },
  {
    id: "pmr",
    nom: "Aide Mise aux Normes PMR",
    description: "Financement de l'accessibilité aux personnes en situation de handicap.",
    montantMin: 3000,
    montantMax: 20000,
    organisme: "État / Collectivité",
    eligible: (r) =>
      r.projets?.includes("pmr") &&
      r.localERP === "oui",
  },
  {
    id: "french_tech",
    nom: "Bourse French Tech Bpifrance",
    description: "Subvention nationale pour projet innovant en phase d'amorçage.",
    montantMin: 30000,
    montantMax: 50000,
    organisme: "Bpifrance",
    eligible: (r) =>
      r.projets?.includes("innovation") &&
      r.anciennete === "moins_1_an" &&
      r.statutInnovant === "oui",
  },
  {
    id: "acre",
    nom: "ACRE — Exonération de charges",
    description: "Exonération partielle de charges sociales pour les créateurs et repreneurs d'entreprise.",
    montantMin: 3000,
    montantMax: 8000,
    organisme: "URSSAF",
    eligible: (r) => r.anciennete === "moins_1_an",
  },
  {
    id: "renovation_locale",
    nom: "Aide à la rénovation de local commercial",
    description: "Financement des travaux d'embellissement, mise en conformité et rénovation de votre local.",
    montantMin: 2000,
    montantMax: 10000,
    organisme: "Chambre de Commerce / Région",
    eligible: (r) => r.projets?.includes("renover"),
  },
]

export function calculerEligibilite(reponses) {
  return dispositifs.filter((d) => d.eligible(reponses))
}

export function calculerMontantTotal(dispositifsEligibles) {
  return dispositifsEligibles.reduce((acc, d) => acc + d.montantMax, 0)
}
