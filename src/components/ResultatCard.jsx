import { motion } from 'framer-motion'

export default function ResultatCard({ dispositif, index }) {
  const { nom, description, montantMin, montantMax, organisme } = dispositif

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-navy text-sm leading-snug">{nom}</h3>
            <span className="shrink-0 text-[10px] font-semibold text-cta bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
              Cumulable
            </span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed mb-2">{description}</p>
          <span className="inline-block text-[11px] text-gray-400 font-medium">
            {organisme}
          </span>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-bold text-navy">
            {montantMax === montantMin
              ? `${montantMax.toLocaleString('fr-FR')} €`
              : `jusqu'à ${montantMax.toLocaleString('fr-FR')} €`}
          </div>
          {montantMax !== montantMin && (
            <div className="text-xs text-gray-400">
              dès {montantMin.toLocaleString('fr-FR')} €
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
