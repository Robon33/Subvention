import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { questions } from '../data/questions'
import { calculerEligibilite, calculerMontantTotal } from '../data/eligibilite'
import { fetchAidesTerritoriales } from '../data/fetchAides'
import { useCountUp } from '../hooks/useCountUp'
import ProgressBar from './ProgressBar'
import Question from './Question'
import ResultatCard from './ResultatCard'
import SirenStep from './SirenStep'

// --- Page résultats ---
function Resultats({ reponses, onRestart, dark = false, aidesExternes = [] }) {
  const dispositifsEligibles = useMemo(
    () => calculerEligibilite(reponses, aidesExternes),
    [reponses, aidesExternes]
  )

  // Séparer confirmées / potentielles
  const aidesConfirmees = useMemo(
    () => dispositifsEligibles.filter(d => d.confirmed || d._manual),
    [dispositifsEligibles]
  )
  const aidesPotentielles = useMemo(
    () => dispositifsEligibles.filter(d => !d.confirmed && !d._manual),
    [dispositifsEligibles]
  )

  const montantConfirme = useMemo(() => calculerMontantTotal(aidesConfirmees), [aidesConfirmees])
  const montantPotentiel = useMemo(() => calculerMontantTotal(aidesPotentielles), [aidesPotentielles])
  const countedConfirme = useCountUp(montantConfirme, 1500, true)

  const CALENDLY_URL = 'https://calendly.com/votre-lien'

  const totalAides = dispositifsEligibles.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}
    >
      {/* Header résultats */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {/* Badge aides trouvées */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '100px',
            marginBottom: '24px',
            ...(dark
              ? { background: 'rgba(76,175,125,0.15)', border: '1px solid rgba(76,175,125,0.3)', color: '#4CAF7D' }
              : { background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A' }),
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF7D', display: 'inline-block' }} />
          {aidesConfirmees.length} aide{aidesConfirmees.length > 1 ? 's' : ''} confirmée{aidesConfirmees.length > 1 ? 's' : ''}
        </div>

        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, lineHeight: 1.2, marginBottom: '12px', color: dark ? '#FFFFFF' : '#010101' }}>
          Vous êtes éligible à{' '}
          <span style={{ color: '#FF9270' }}>
            {aidesConfirmees.length} aide{aidesConfirmees.length > 1 ? 's' : ''}
          </span>
        </h1>

        <p style={{ fontSize: '16px', marginBottom: '24px', color: dark ? 'rgba(255,255,255,0.55)' : '#6B6B6B' }}>
          pour un montant estimé de
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 800, color: dark ? '#FFFFFF' : '#010101', fontVariantNumeric: 'tabular-nums' }}>
            {countedConfirme.toLocaleString('fr-FR')}
          </span>
          <span style={{ fontSize: '24px', fontWeight: 700, color: dark ? '#FFFFFF' : '#010101' }}>€</span>
        </div>

        <p style={{ fontSize: '12px', marginTop: '12px', color: dark ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }}>
          Ces montants sont des estimations basées sur les barèmes officiels en vigueur.
        </p>
      </div>

      {/* ── Section 1 : Aides confirmées ── */}
      {aidesConfirmees.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
              ...(dark
                ? { background: 'rgba(76,175,125,0.15)', color: '#4CAF7D' }
                : { background: '#F0FDF4', color: '#16A34A' }),
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF7D', display: 'inline-block' }} />
              Confirmées
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {aidesConfirmees.map((d, i) => (
              <ResultatCard key={d.id} dispositif={d} index={i} dark={dark} />
            ))}
          </div>
        </div>
      )}

      {totalAides === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', marginBottom: '32px' }}>
          <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px', color: dark ? '#FFFFFF' : '#6B6B6B' }}>Aucune aide détectée</p>
          <p style={{ fontSize: '14px', color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}>Nos experts peuvent analyser votre situation plus en détail.</p>
        </div>
      )}

      {/* ── CTA entre les deux sections ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
        style={{
          borderRadius: '16px',
          padding: '24px 32px',
          textAlign: 'center',
          marginBottom: '32px',
          ...(dark
            ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }
            : { background: '#010101' }),
        }}
      >
        <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '20px', color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.75)' }}>
          Ces montants sont des estimations. Un expert analyse votre dossier gratuitement
          et vous accompagne dans le montage des demandes.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            padding: '12px 28px',
            borderRadius: '100px',
            fontSize: '15px',
            background: 'linear-gradient(135deg, #FF9270, #FFE989)',
            color: '#010101',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(255,146,112,0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          Réserver mon appel gratuit
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <p style={{ fontSize: '12px', marginTop: '12px', color: 'rgba(255,255,255,0.4)' }}>Sans engagement · 30 minutes · 100% gratuit</p>
      </motion.div>

      {/* ── Section 2 : Aides potentielles ── */}
      {aidesPotentielles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4, ease: 'easeOut' }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
              ...(dark
                ? { background: 'rgba(255,146,112,0.15)', color: '#FF9270' }
                : { background: '#FFF7ED', color: '#EA580C' }),
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF9270', display: 'inline-block' }} />
              À vérifier
            </span>
          </div>

          <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px', color: dark ? '#FFFFFF' : '#010101' }}>
            Aides supplémentaires à explorer
          </p>
          <p style={{ fontSize: '14px', marginBottom: '4px', color: dark ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>
            + jusqu'à <strong style={{ color: dark ? '#FFE989' : '#FF9270' }}>{montantPotentiel.toLocaleString('fr-FR')}€</strong> potentiels
          </p>
          <p style={{ fontSize: '12px', marginBottom: '16px', color: dark ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }}>
            Ces aides nécessitent une vérification de votre éligibilité par un expert.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.75 }}>
            {aidesPotentielles.map((d, i) => (
              <ResultatCard key={d.id} dispositif={d} index={i} dark={dark} hideMontant />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommencer */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          onClick={onRestart}
          style={{
            fontSize: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = dark ? '#FFFFFF' : '#4B5563'}
          onMouseLeave={e => e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF'}
        >
          Recommencer la simulation
        </button>
      </div>
    </motion.div>
  )
}

// --- Composant principal ---
export default function Simulateur({ inline = false }) {
  const dark = inline

  const [reponses, setReponses] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState('siren') // 'siren' | 'quiz' | 'results'
  const [direction, setDirection] = useState(1)
  const [aidesExternes, setAidesExternes] = useState([])
  const [idr, setIdr] = useState(null) // idr les-aides.fr pour réutiliser la requête

  // Fetch aides dès qu'on a région/département + au moins 1 projet
  useEffect(() => {
    const { siren, naf, departement, projets, region } = reponses
    if ((departement || region) && projets?.length > 0) {
      fetchAidesTerritoriales({ siren, ape: naf, departement, projets, requete: idr, secteur: reponses.secteur })
        .then(setAidesExternes)
    }
  }, [reponses.projets, reponses.departement, reponses.siren, idr])

  // ── Étape SIREN ──────────────────────────────────────────────────────────

  const handleSirenConfirm = (data) => {
    // Stocker idr si disponible (depuis api/aides.js)
    if (data._idr) setIdr(data._idr)
    setReponses(prev => ({
      ...prev,
      secteur:      data.secteur,
      taille:       data.taille,
      anciennete:   data.anciennete,
      region:       data.region,
      siren:        data.siren,
      naf:          data.naf,
      departement:  data.departement,
      nomEntreprise: data.nom,
    }))
    setPhase('quiz')
  }

  // "Je n'ai pas encore de SIREN" → mode création
  const handleSirenSkip = () => {
    setReponses((prev) => ({ ...prev, taille: 'creation' }))
    setPhase('quiz')
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────

  const applicableQuestions = useMemo(
    () => questions.filter((q) => !q.condition || q.condition(reponses)),
    [reponses]
  )

  const currentQuestion = applicableQuestions[currentIndex]
  const currentValue = reponses[currentQuestion?.id]

  const advance = () => {
    if (currentIndex < applicableQuestions.length - 1) {
      setDirection(1)
      setCurrentIndex((i) => i + 1)
    } else {
      setPhase('results')
    }
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((i) => i - 1)
    }
  }

  const handleChange = (value) => {
    const newReponses = { ...reponses, [currentQuestion.id]: value }
    setReponses(newReponses)

    if (currentQuestion.type === 'single') {
      setTimeout(() => {
        setDirection(1)
        setCurrentIndex((i) => {
          const nextApplicable = questions.filter(
            (q) => !q.condition || q.condition(newReponses)
          )
          if (i < nextApplicable.length - 1) return i + 1
          setPhase('results')
          return i
        })
      }, 280)
    }
  }

  const handleNext = () => advance()
  const handleSkip = () => advance()

  const handleRestart = () => {
    setReponses({})
    setCurrentIndex(0)
    setPhase('siren')
    setDirection(1)
    setIdr(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const wrapperStyle = {
    padding: '40px 16px',
    ...(inline ? {} : { minHeight: '100vh', background: '#F7F7F7' }),
  }

  if (phase === 'results') {
    return (
      <div style={wrapperStyle}>
        <Resultats
          reponses={reponses}
          onRestart={handleRestart}
          dark={dark}
          aidesExternes={aidesExternes}
        />
      </div>
    )
  }

  const headerStyle = {
    borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(1,1,1,0.08)'}`,
    padding: '16px',
    ...(dark ? { background: 'transparent' } : { background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }),
  }

  const showProgressBar = phase === 'quiz'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...(inline ? {} : { minHeight: '100vh', background: '#FFFFFF' }) }}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: showProgressBar ? '12px' : 0 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: dark ? 'linear-gradient(135deg, #FF9270, #FFE989)' : '#010101',
            }}>
              <svg width="14" height="14" fill="none" stroke={dark ? '#010101' : '#FFFFFF'} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: dark ? '#FFFFFF' : '#010101' }}>
              Simulateur de subventions
            </span>
          </div>
          {showProgressBar && (
            <ProgressBar current={currentIndex + 1} total={applicableQuestions.length} dark={dark} />
          )}
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '480px', overflow: 'hidden' }}>

          {/* Étape SIREN */}
          {phase === 'siren' && (
            <SirenStep onConfirm={handleSirenConfirm} onSkip={handleSirenSkip} dark={dark} />
          )}

          {/* Quiz */}
          {phase === 'quiz' && (
            <AnimatePresence mode="wait" custom={direction}>
              {currentQuestion && (
                <Question
                  key={currentQuestion.id}
                  question={currentQuestion}
                  value={currentValue}
                  onChange={handleChange}
                  onNext={handleNext}
                  onBack={goBack}
                  onSkip={handleSkip}
                  direction={direction}
                  showBack={currentIndex > 0}
                  dark={dark}
                />
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: dark ? 'rgba(255,255,255,0.25)' : '#D1D5DB' }}>
          Simulation gratuite · Sans engagement · Données confidentielles
        </p>
      </footer>
    </div>
  )
}
