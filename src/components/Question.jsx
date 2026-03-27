import { useState } from 'react'
import { motion } from 'framer-motion'

// --- Single choice ---
function SingleChoice({ question, value, onChange }) {
  return (
    <div className="grid gap-3">
      {question.options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 group
              ${selected
                ? 'border-navy bg-navy text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            {opt.icon && (
              <span className="text-xl shrink-0">{opt.icon}</span>
            )}
            <span className="flex flex-col">
              <span className="font-medium text-sm leading-snug">{opt.label}</span>
              {opt.sublabel && (
                <span className={`text-xs mt-0.5 ${selected ? 'text-blue-200' : 'text-gray-400'}`}>
                  {opt.sublabel}
                </span>
              )}
            </span>
            {selected && (
              <span className="ml-auto shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// --- Multiple choice ---
function MultipleChoice({ question, value = [], onChange, onNext }) {
  const toggle = (v) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {question.options.map((opt) => {
          const selected = value.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3
                ${selected
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {opt.icon && <span className="text-lg shrink-0">{opt.icon}</span>}
              <span className="flex flex-col">
                <span className="font-medium text-sm leading-snug">{opt.label}</span>
                {opt.sublabel && (
                  <span className={`text-xs mt-0.5 ${selected ? 'text-blue-200' : 'text-gray-400'}`}>
                    {opt.sublabel}
                  </span>
                )}
              </span>
              {selected && (
                <span className="ml-auto shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>
      <button
        onClick={onNext}
        disabled={!value || value.length === 0}
        className="mt-2 w-full sm:w-auto sm:self-start px-8 py-3.5 bg-navy text-white font-semibold rounded-xl
          hover:bg-opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continuer →
      </button>
    </div>
  )
}

// --- Region select ---
function RegionSelect({ value, onChange, options, onNext }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border-2 border-gray-200 rounded-xl px-5 py-4 text-gray-700 font-medium
            bg-white focus:outline-none focus:border-navy transition-colors duration-150 pr-10 cursor-pointer"
        >
          <option value="" disabled>Sélectionnez votre région…</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="w-full sm:w-auto sm:self-start px-8 py-3.5 bg-navy text-white font-semibold rounded-xl
          hover:bg-opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continuer →
      </button>
    </div>
  )
}

// --- Lead form ---
function LeadForm({ value = {}, onChange, onNext }) {
  const update = (key, val) => onChange({ ...value, [key]: val })
  const valid = value.prenom?.trim() && value.email?.includes('@')

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Votre prénom"
        value={value.prenom || ''}
        onChange={(e) => update('prenom', e.target.value)}
        className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-gray-700 font-medium
          focus:outline-none focus:border-navy transition-colors duration-150 placeholder-gray-300"
      />
      <input
        type="email"
        placeholder="Votre adresse email"
        value={value.email || ''}
        onChange={(e) => update('email', e.target.value)}
        className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-gray-700 font-medium
          focus:outline-none focus:border-navy transition-colors duration-150 placeholder-gray-300"
      />
      <p className="text-xs text-gray-400 leading-relaxed">
        Vos données sont confidentielles et ne seront jamais revendues.
      </p>
      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full sm:w-auto sm:self-start px-8 py-4 bg-cta text-white font-bold rounded-xl text-base
          hover:bg-opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-green-200"
      >
        Voir mes subventions →
      </button>
    </div>
  )
}

// --- Main Question component ---
const variants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function Question({ question, value, onChange, onNext, onBack, direction, showBack }) {
  return (
    <motion.div
      key={question.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      {/* Titre */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight mb-2">
          {question.titre}
        </h2>
        {question.soustitre && (
          <p className="text-gray-500 text-base leading-relaxed">{question.soustitre}</p>
        )}
      </div>

      {/* Contenu selon le type */}
      {question.type === 'single' && (
        <SingleChoice question={question} value={value} onChange={onChange} />
      )}
      {question.type === 'multiple' && (
        <MultipleChoice question={question} value={value} onChange={onChange} onNext={onNext} />
      )}
      {question.type === 'select' && (
        <RegionSelect options={question.options} value={value} onChange={onChange} onNext={onNext} />
      )}
      {question.type === 'lead' && (
        <LeadForm value={value} onChange={onChange} onNext={onNext} />
      )}

      {/* Navigation retour */}
      {showBack && (
        <button
          onClick={onBack}
          className="mt-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
      )}
    </motion.div>
  )
}
