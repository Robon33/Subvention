import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Mapping côté serveur (/api/sirene.js) — labels pour l'affichage uniquement

const SECTEUR_LABEL = {
  restauration: 'Restauration',
  commerce:     'Commerce',
  artisanat:    'Artisanat',
  hotellerie:   'Hôtellerie',
  batiment:     'Bâtiment',
  sante:        'Santé',
  services:     'Services',
}

const TAILLE_LABEL = {
  micro: 'Micro-entreprise',
  tpe:   'TPE',
  pme:   'PME',
}

// ─── Composant principal ─────────────────────────────────────────────────────

export default function SirenStep({ onConfirm, onSkip, dark = false }) {
  const [siren, setSiren] = useState('')
  const [phase, setPhase] = useState('input') // 'input' | 'loading' | 'found' | 'error'
  const [entreprise, setEntreprise] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleInput = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 9)
    setSiren(v)
  }

  const handleSearch = async () => {
    if (siren.length !== 9) return
    setPhase('loading')
    try {
      const res = await fetch(`/api/sirene?siren=${siren}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      // data = { nom, siren, naf, secteur, taille, anciennete, anneeCreation, region, departement }
      setEntreprise(data)
      setPhase('found')
    } catch {
      setErrorMsg('Entreprise introuvable. Vérifiez votre SIREN ou continuez manuellement.')
      setPhase('error')
    }
  }

  const handleConfirm = () => {
    onConfirm(entreprise)
  }

  const handleRetry = () => {
    setPhase('input')
    setEntreprise(null)
    setErrorMsg('')
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  const inputStyle = dark
    ? { background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', color: '#FFFFFF' }
    : { background: '#FFFFFF', border: '2px solid #E5E7EB', color: '#374151' }

  const cardStyle = dark
    ? { background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.25)', borderRadius: 16 }
    : { background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16 }

  const btnPrimary = {
    background: 'linear-gradient(135deg, #FF9270, #FFE989)',
    boxShadow: '0 4px 16px rgba(255,146,112,0.35)',
    color: '#010101',
    padding: '12px 28px',
    borderRadius: 100,
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.2s ease',
  }

  const btnSecondary = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: dark ? 'rgba(255,255,255,0.45)' : '#9CA3AF',
    textDecoration: 'underline',
    padding: 0,
    transition: 'color 0.15s ease',
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: 480 }}
    >
      {/* Titre */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 'clamp(22px, 4vw, 28px)',
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: 10,
            color: dark ? '#FFFFFF' : '#1A1A18',
          }}
        >
          Commençons par votre entreprise
        </h2>
        <p style={{ fontSize: 16, color: dark ? 'rgba(255,255,255,0.55)' : '#6B7280' }}>
          Entrez votre SIREN pour remplir automatiquement votre profil
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Phase input ── */}
        {(phase === 'input' || phase === 'loading') && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex : 123 456 789"
                  value={siren.replace(/(\d{3})(?=\d)/g, '$1 ').trim()}
                  onChange={handleInput}
                  onKeyDown={(e) => e.key === 'Enter' && siren.length === 9 && handleSearch()}
                  maxLength={11}
                  style={{
                    ...inputStyle,
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 14,
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                />
                {siren.length > 0 && siren.length < 9 && (
                  <span style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : '#D1D5DB',
                  }}>
                    {9 - siren.length} chiffres restants
                  </span>
                )}
              </div>

              <button
                onClick={handleSearch}
                disabled={siren.length !== 9 || phase === 'loading'}
                style={{
                  ...btnPrimary,
                  opacity: siren.length !== 9 ? 0.35 : 1,
                  cursor: siren.length !== 9 ? 'not-allowed' : 'pointer',
                  justifyContent: 'center',
                }}
              >
                {phase === 'loading' ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Analyse en cours…
                  </>
                ) : (
                  <>
                    Analyser mon entreprise
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>

              <button onClick={onSkip} style={btnSecondary}>
                Je n'ai pas encore de SIREN (entreprise en création)
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Phase found ── */}
        {phase === 'found' && entreprise && (
          <motion.div key="found" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ ...cardStyle, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(76,175,125,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="18" height="18" fill="none" stroke="#4CAF7D" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#4CAF7D', marginBottom: 4 }}>
                    Entreprise trouvée
                  </p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: dark ? '#FFFFFF' : '#1A1A18', marginBottom: 8 }}>
                    {entreprise.nom}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {entreprise.secteur && (
                      <span style={{
                        fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 100,
                        background: dark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
                        color: dark ? 'rgba(255,255,255,0.7)' : '#4B5563',
                      }}>
                        {SECTEUR_LABEL[entreprise.secteur] || entreprise.secteur}
                      </span>
                    )}
                    {entreprise.anneeCreation && (
                      <span style={{
                        fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 100,
                        background: dark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
                        color: dark ? 'rgba(255,255,255,0.7)' : '#4B5563',
                      }}>
                        Créée en {entreprise.anneeCreation}
                      </span>
                    )}
                    {entreprise.taille && (
                      <span style={{
                        fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 100,
                        background: dark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
                        color: dark ? 'rgba(255,255,255,0.7)' : '#4B5563',
                      }}>
                        {TAILLE_LABEL[entreprise.taille] || entreprise.taille}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <button onClick={handleConfirm} style={{ ...btnPrimary, justifyContent: 'center' }}>
                C'est bien mon entreprise, continuer →
              </button>
              <button onClick={handleRetry} style={btnSecondary}>
                Ce n'est pas la bonne entreprise
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Phase error ── */}
        {phase === 'error' && (
          <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{
              padding: '16px 20px',
              borderRadius: 14,
              marginBottom: 20,
              background: dark ? 'rgba(255,100,100,0.1)' : '#FEF2F2',
              border: `1px solid ${dark ? 'rgba(255,100,100,0.2)' : '#FECACA'}`,
              color: dark ? '#FCA5A5' : '#DC2626',
              fontSize: 14,
            }}>
              {errorMsg}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <button onClick={handleRetry} style={{ ...btnPrimary, justifyContent: 'center' }}>
                Réessayer
              </button>
              <button onClick={onSkip} style={btnSecondary}>
                Continuer sans SIREN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  )
}
