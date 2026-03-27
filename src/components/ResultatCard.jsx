import { motion } from 'framer-motion'

export default function ResultatCard({ dispositif, index }) {
  const { nom, description, montantMin, montantMax, organismes, organisme, source } = dispositif

  // Normalise : préfère organismes[] sinon reconstruit depuis organisme string
  const orgs = organismes?.length
    ? organismes
    : organisme ? [organisme] : []

  const hasMontant = montantMax != null && montantMax > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-navy text-sm leading-snug">{nom}</h3>
            <span className="shrink-0 text-[10px] font-semibold text-cta bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
              Cumulable
            </span>
          </div>

          <p className="text-gray-500 text-xs leading-relaxed mb-2">{description}</p>

          <div className="flex items-center gap-2 flex-wrap">
            {orgs.map((org) => (
              <span key={org} className="text-[11px] text-gray-400 font-medium">
                {org}
              </span>
            ))}
            {source && (
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-600 transition-colors duration-150 ml-auto"
                title="Voir la source officielle"
              >
                Source officielle ↗
              </a>
            )}
          </div>
        </div>

        {/* Montant */}
        <div className="shrink-0 text-right">
          {hasMontant ? (
            <>
              <div className="text-lg font-bold text-navy">
                {montantMax === montantMin
                  ? `${montantMax.toLocaleString('fr-FR')} €`
                  : `jusqu'à ${montantMax.toLocaleString('fr-FR')} €`}
              </div>
              {montantMin != null && montantMax !== montantMin && (
                <div className="text-xs text-gray-400">
                  dès {montantMin.toLocaleString('fr-FR')} €
                </div>
              )}
            </>
          ) : (
            <div className="text-sm font-semibold text-gray-400">
              Montant<br />variable
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
