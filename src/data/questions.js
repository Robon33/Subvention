export const REGIONS = [
  { label: "Auvergne-Rhône-Alpes",          value: "auvergne_rhone_alpes" },
  { label: "Bourgogne-Franche-Comté",        value: "bourgogne_franche_comte" },
  { label: "Bretagne",                        value: "bretagne" },
  { label: "Centre-Val de Loire",             value: "centre_val_de_loire" },
  { label: "Corse",                           value: "corse" },
  { label: "Grand Est",                       value: "grand_est" },
  { label: "Hauts-de-France",                value: "hauts_de_france" },
  { label: "Île-de-France",                  value: "ile_de_france" },
  { label: "Normandie",                       value: "normandie" },
  { label: "Nouvelle-Aquitaine",             value: "nouvelle_aquitaine" },
  { label: "Occitanie",                       value: "occitanie" },
  { label: "Pays de la Loire",               value: "pays_de_la_loire" },
  { label: "Provence-Alpes-Côte d'Azur",    value: "paca" },
  { label: "Guadeloupe",                      value: "guadeloupe" },
  { label: "Martinique",                      value: "martinique" },
  { label: "Guyane",                          value: "guyane" },
  { label: "La Réunion",                     value: "la_reunion" },
  { label: "Mayotte",                         value: "mayotte" },
]

// type: "single" | "multiple" | "select" | "email"
// condition: function(reponses) => boolean | null (always shown)
export const questions = [
  // Q1 — secteur (skipped if pre-filled by SIREN)
  {
    id: "secteur",
    titre: "Votre activité principale ?",
    soustitre: "Sélectionnez votre secteur.",
    type: "single",
    options: [
      { label: "Restauration / Café / Bar",    value: "restauration" },
      { label: "Commerce de proximité",         value: "commerce" },
      { label: "Artisanat",                     value: "artisanat" },
      { label: "Services aux entreprises",      value: "services" },
      { label: "Hôtellerie / Tourisme",        value: "hotellerie" },
      { label: "Bâtiment / Construction",      value: "batiment" },
      { label: "Santé / Bien-être",           value: "sante" },
      { label: "Autre secteur",                 value: "autre" },
    ],
    condition: (r) => !r.secteur,
  },

  // Q2 — taille (skipped if pre-filled by SIREN)
  {
    id: "taille",
    titre: "Taille de votre entreprise ?",
    soustitre: "Nombre de salariés au moment du projet.",
    type: "single",
    options: [
      { label: "En cours de création",  sublabel: "pas encore immatriculé", value: "creation" },
      { label: "Micro-entreprise",       sublabel: "0 salarié",              value: "micro" },
      { label: "TPE",                    sublabel: "1 à 9 salariés",         value: "tpe" },
      { label: "PME",                    sublabel: "10 à 49 salariés",       value: "pme" },
    ],
    condition: (r) => !r.taille || r.anciennete === 'moins_1_an',
  },

  // Q3 — anciennete (skipped if pre-filled or taille=creation)
  {
    id: "anciennete",
    titre: "Depuis quand votre entreprise existe-t-elle ?",
    soustitre: "La date de création influence certaines aides.",
    type: "single",
    options: [
      { label: "Moins d'1 an",  value: "moins_1_an" },
      { label: "1 à 3 ans",     value: "1_3_ans" },
      { label: "Plus de 3 ans", value: "plus_3_ans" },
    ],
    condition: (r) => !r.anciennete && r.taille !== 'creation',
  },

  // Q4 — region (always)
  {
    id: "region",
    titre: "Dans quelle région êtes-vous ?",
    soustitre: "Certaines aides sont régionales.",
    type: "select",
    options: REGIONS,
    condition: null,
  },

  // Q5 — projets (always)
  {
    id: "projets",
    titre: "Quels projets avez-vous dans les 12 prochains mois ?",
    soustitre: "Sélectionnez tout ce qui vous correspond.",
    type: "multiple",
    options: [
      { label: "Acheter du matériel ou équipement",            value: "materiel" },
      { label: "Me digitaliser",  sublabel: "site, logiciel, caisse",  value: "digital" },
      { label: "Recruter en CDI",                               value: "recruter_cdi" },
      { label: "Prendre un apprenti / alternant",               value: "recruter_alternance" },
      { label: "Former mes salariés existants",                 value: "former" },
      { label: "Rénover mon local commercial",                 value: "renover" },
      { label: "Mettre aux normes PMR",  sublabel: "accessibilité",  value: "pmr" },
      { label: "Transition énergétique / rénovation",          value: "energie" },
      { label: "Développer un produit innovant",               value: "innovation" },
      { label: "Me développer à l'international",             value: "export" },
      { label: "Créer ou reprendre une entreprise",            value: "creation_projet" },
    ],
    condition: null,
  },

  // Q6 — montantInvestissement (si matériel/renover/energie)
  {
    id: "montantInvestissement",
    titre: "Quel est le montant estimé de cet investissement ?",
    soustitre: "Une estimation suffit.",
    type: "single",
    options: [
      { label: "Moins de 10 000 €",        value: "moins_10k" },
      { label: "10 000 € à 30 000 €",      value: "10k_30k" },
      { label: "30 000 € à 100 000 €",     value: "30k_100k" },
      { label: "Plus de 100 000 €",        value: "plus_100k" },
    ],
    condition: (r) => r.projets?.some(p => ['materiel', 'renover', 'energie'].includes(p)),
  },

  // Q7 — localERP (si pmr ou renover)
  {
    id: "localERP",
    titre: "Votre local reçoit-il du public (ERP) ?",
    soustitre: "Restaurant, boutique, salon, cabinet médical...",
    type: "single",
    options: [
      { label: "Oui, c'est un ERP",                    value: "oui" },
      { label: "Non, local professionnel privé",       value: "non" },
    ],
    condition: (r) => r.projets?.includes('pmr') || r.projets?.includes('renover'),
  },

  // Q8 — typeInnovation (si innovation)
  {
    id: "typeInnovation",
    titre: "Votre projet innovant est-il...",
    type: "single",
    options: [
      { label: "Un produit ou service technologique",  value: "tech" },
      { label: "Une amélioration de processus métier", value: "process" },
      { label: "Une innovation sociale ou solidaire",  value: "social" },
    ],
    condition: (r) => r.projets?.includes('innovation'),
  },

  // Q9 — statutInnovant (si innovation)
  {
    id: "statutInnovant",
    titre: "Votre structure est-elle une startup ou JEI ?",
    soustitre: "Jeune Entreprise Innovante ou moins d'1 an",
    type: "single",
    options: [
      { label: "Oui, startup / JEI / moins d'1 an", value: "oui" },
      { label: "Non, entreprise établie",             value: "non" },
    ],
    condition: (r) => r.projets?.includes('innovation'),
  },

  // Q10 — email (toujours, en dernier)
  {
    id: "email",
    titre: "Où envoyer votre rapport détaillé ?",
    soustitre: "Recevez vos résultats par email + guide pour monter vos dossiers",
    type: "email",
    placeholder: "votre@email.com",
    condition: null,
  },
]
