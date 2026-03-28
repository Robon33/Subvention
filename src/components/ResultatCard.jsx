import { motion } from 'framer-motion'

export default function ResultatCard({ dispositif, index, dark = false, hideMontant = false }) {
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
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
      className="rounded-2xl p-5 transition-shadow duration-200"
      style={
        dark
          ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }
          : { background: '#FFFFFF', border: '1px solid rgba(26,26,24,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05)' }
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-sm leading-snug" style={{ color: dark ? '#FFFFFF' : '#1A1A18' }}>{nom}</h3>
            <span
              className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={
                dark
                  ? { color: '#FF9270', background: 'rgba(255,146,112,0.2)', border: '1px solid rgba(255,146,112,0.3)' }
                  : { color: '#4CAF7D', background: 'rgba(76,175,125,0.10)', border: '1px solid rgba(76,175,125,0.20)' }
              }
            >
              Cumulable
            </span>
          </div>

          <p className="text-xs leading-relaxed mb-2" style={{ color: dark ? 'rgba(255,255,255,0.55)' : '#6B7280' }}>{description}</p>

          <div className="flex items-center gap-2 flex-wrap">
            {orgs.map((org) => (
              <span key={org} className="text-[11px] font-medium" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}>
                {org}
              </span>
            ))}
            {source && (
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] transition-colors duration-150 ml-auto font-medium"
                style={{ color: dark ? '#FF9270' : '#E8915A' }}
                onMouseEnter={e => e.currentTarget.style.color = dark ? '#FFE989' : '#D4724A'}
                onMouseLeave={e => e.currentTarget.style.color = dark ? '#FF9270' : '#E8915A'}
                title="Voir la source officielle"
              >
                Source officielle ↗
              </a>
            )}
          </div>
        </div>

        {/* Montant */}
        {!hideMontant && (
          <div className="shrink-0 text-right">
            {hasMontant ? (
              <>
                <div className="text-lg font-bold" style={{ color: dark ? '#FFE989' : '#1A1A18' }}>
                  {montantMax === montantMin
                    ? `${montantMax.toLocaleString('fr-FR')} €`
                    : `jusqu'à ${montantMax.toLocaleString('fr-FR')} €`}
                </div>
                {montantMin != null && montantMax !== montantMin && (
                  <div className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}>
                    dès {montantMin.toLocaleString('fr-FR')} €
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm font-semibold" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}>
                Montant<br />variable
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
