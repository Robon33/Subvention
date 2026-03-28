import { useState, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { questions } from '../data/questions'
import { calculerEligibilite, calculerMontantTotal } from '../data/eligibilite'
import { useCountUp } from '../hooks/useCountUp'
import ProgressBar from './ProgressBar'
import Question from './Question'
import ResultatCard from './ResultatCard'

// --- Page résultats ---
function Resultats({ reponses, onRestart, dark = false }) {
  const dispositifsEligibles = useMemo(() => calculerEligibilite(reponses), [reponses])
  const montantTotal = useMemo(() => calculerMontantTotal(dispositifsEligibles), [dispositifsEligibles])
  const countedTotal = useCountUp(montantTotal, 1500, true)

  const CALENDLY_URL = 'https://calendly.com/votre-lien'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header résultats */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6"
          style={
            dark
              ? { background: 'rgba(76,175,125,0.15)', border: '1px solid rgba(76,175,125,0.3)', color: '#4CAF7D' }
              : undefined
          }
          {...(!dark && { className: 'inline-flex items-center gap-2 bg-green-50 border border-green-100 text-cta text-sm font-semibold px-4 py-2 rounded-full mb-6' })}
        >
          <span className="w-2 h-2 rounded-full bg-cta inline-block animate-pulse" />
          {dispositifsEligibles.length} aide{dispositifsEligibles.length > 1 ? 's' : ''} trouvée{dispositifsEligibles.length > 1 ? 's' : ''}
        </div>

        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight mb-3"
          style={{ color: dark ? '#FFFFFF' : undefined }}
        >
          <span className={!dark ? 'text-navy' : ''}>Vous êtes éligible à{' '}</span>
          <span style={{ color: '#E8915A' }}>
            {dispositifsEligibles.length} aide{dispositifsEligibles.length > 1 ? 's' : ''}
          </span>
        </h1>

        <p className="text-base mb-6" style={{ color: dark ? 'rgba(255,255,255,0.55)' : undefined, ...((!dark) && { color: '#6B6860' }) }}>
          pour un montant total estimé de
        </p>

        <div className="inline-flex items-baseline gap-1">
          <span
            className="text-5xl sm:text-6xl font-bold tabular-nums"
            style={{ color: dark ? '#FFFFFF' : '#1A1A18' }}
          >
            {countedTotal.toLocaleString('fr-FR')}
          </span>
          <span className="text-2xl font-bold" style={{ color: dark ? '#FFFFFF' : '#1A1A18' }}>€</span>
        </div>

        <p className="text-xs mt-3" style={{ color: dark ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }}>
          Ces montants sont des estimations basées sur les barèmes officiels en vigueur.
        </p>
      </div>

      {/* Liste des dispositifs */}
      <div className="flex flex-col gap-3 mb-8">
        {dispositifsEligibles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2" style={{ color: dark ? '#FFFFFF' : '#6B6860' }}>Aucune aide détectée</p>
            <p className="text-sm" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}>Nos experts peuvent analyser votre situation plus en détail.</p>
          </div>
        ) : (
          dispositifsEligibles.map((d, i) => (
            <ResultatCard key={d.id} dispositif={d} index={i} />
          ))
        )}
      </div>

      {/* Disclaimer + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
        className="rounded-2xl p-6 sm:p-8 text-white text-center"
        style={
          dark
            ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }
            : { background: '#1A1A18' }
        }
      >
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(181,196,232,0.9)' }}
        >
          Ces montants sont des estimations. Un expert analyse votre dossier gratuitement
          et vous accompagne dans le montage des demandes.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-base
            hover:opacity-90 active:scale-95 transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg, #E8915A, #D4724A)',
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(232,145,90,0.35)',
          }}
        >
          Réserver mon appel gratuit
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Sans engagement · 30 minutes · 100% gratuit</p>
      </motion.div>

      {/* Recommencer */}
      <div className="text-center mt-6">
        <button
          onClick={onRestart}
          className="text-sm transition-colors duration-150"
          style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
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
  const [phase, setPhase] = useState('quiz') // 'quiz' | 'results'
  const [direction, setDirection] = useState(1)

  // Questions applicables selon les réponses actuelles
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

    // Auto-advance uniquement pour les choix simples
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

  const handleNext = () => {
    advance()
  }

  const handleRestart = () => {
    setReponses({})
    setCurrentIndex(0)
    setPhase('quiz')
    setDirection(1)
  }

  if (phase === 'results') {
    return (
      <div className={`px-4 py-10 sm:py-16 ${inline ? '' : 'min-h-screen bg-gray-50'}`}>
        <div className="max-w-2xl mx-auto">
          <Resultats reponses={reponses} onRestart={handleRestart} dark={dark} />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${inline ? '' : 'min-h-screen bg-white'}`}>
      {/* Header fixe avec logo + progress */}
      <header
        className="border-b px-4 py-4"
        style={
          dark
            ? { background: 'transparent', borderColor: 'rgba(255,255,255,0.10)' }
            : { background: '#FFFFFF', borderColor: '#F3F4F6', position: 'sticky', top: 0, zIndex: 10 }
        }
      >
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={
                dark
                  ? { background: 'linear-gradient(135deg, #E8915A, #D4724A)' }
                  : { background: '#1A1A18' }
              }
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: dark ? '#FFFFFF' : '#1A1A18' }}
            >
              Simulateur de subventions
            </span>
          </div>
          <ProgressBar
            current={currentIndex + 1}
            total={applicableQuestions.length}
            dark={dark}
          />
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {currentQuestion && (
              <Question
                key={currentQuestion.id}
                question={currentQuestion}
                value={currentValue}
                onChange={handleChange}
                onNext={handleNext}
                onBack={goBack}
                direction={direction}
                showBack={currentIndex > 0}
                dark={dark}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer discret */}
      <footer className="py-4 text-center">
        <p className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.25)' : '#D1D5DB' }}>
          Simulation gratuite · Sans engagement · Données confidentielles
        </p>
      </footer>
    </div>
  )
}
