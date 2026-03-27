import { useState, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { questions } from '../data/questions'
import { calculerEligibilite, calculerMontantTotal } from '../data/eligibilite'
import { useCountUp } from '../hooks/useCountUp'
import ProgressBar from './ProgressBar'
import Question from './Question'
import ResultatCard from './ResultatCard'

// --- Page résultats ---
function Resultats({ reponses, onRestart }) {
  const dispositifsEligibles = useMemo(() => calculerEligibilite(reponses), [reponses])
  const montantTotal = useMemo(() => calculerMontantTotal(dispositifsEligibles), [dispositifsEligibles])
  const countedTotal = useCountUp(montantTotal, 1500, true)

  const CALENDLY_URL = 'https://calendly.com/votre-lien'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header résultats */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-cta text-sm font-semibold px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-cta inline-block animate-pulse" />
          {dispositifsEligibles.length} aide{dispositifsEligibles.length > 1 ? 's' : ''} trouvée{dispositifsEligibles.length > 1 ? 's' : ''}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-navy leading-tight mb-3">
          Vous êtes éligible à{' '}
          <span className="text-cta">
            {dispositifsEligibles.length} aide{dispositifsEligibles.length > 1 ? 's' : ''}
          </span>
        </h1>

        <p className="text-gray-500 text-base mb-6">pour un montant total estimé de</p>

        <div className="inline-flex items-baseline gap-1">
          <span className="text-5xl sm:text-6xl font-bold text-navy tabular-nums">
            {countedTotal.toLocaleString('fr-FR')}
          </span>
          <span className="text-2xl font-bold text-navy">€</span>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Ces montants sont des estimations basées sur les barèmes officiels en vigueur.
        </p>
      </div>

      {/* Liste des dispositifs */}
      <div className="flex flex-col gap-3 mb-8">
        {dispositifsEligibles.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium mb-2">Aucune aide détectée</p>
            <p className="text-sm">Nos experts peuvent analyser votre situation plus en détail.</p>
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
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-navy rounded-2xl p-6 sm:p-8 text-white text-center"
      >
        <p className="text-sm text-blue-200 leading-relaxed mb-6">
          Ces montants sont des estimations. Un expert analyse votre dossier gratuitement
          et vous accompagne dans le montage des demandes.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-cta text-white font-bold px-8 py-4 rounded-xl text-base
            hover:bg-opacity-90 active:scale-95 transition-all duration-150 shadow-lg shadow-green-900/30"
        >
          Réserver mon appel gratuit
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <p className="text-xs text-blue-300 mt-3">Sans engagement · 30 minutes · 100% gratuit</p>
      </motion.div>

      {/* Recommencer */}
      <div className="text-center mt-6">
        <button
          onClick={onRestart}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          Recommencer la simulation
        </button>
      </div>
    </motion.div>
  )
}

// --- Composant principal ---
export default function Simulateur() {
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
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <Resultats reponses={reponses} onRestart={handleRestart} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header fixe avec logo + progress */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-navy">Simulateur de subventions</span>
          </div>
          <ProgressBar
            current={currentIndex + 1}
            total={applicableQuestions.length}
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
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer discret */}
      <footer className="py-4 text-center">
        <p className="text-xs text-gray-300">
          Simulation gratuite · Sans engagement · Données confidentielles
        </p>
      </footer>
    </div>
  )
}
