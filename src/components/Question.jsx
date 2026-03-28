import { useState } from 'react'
import { motion } from 'framer-motion'

// --- Styles helpers ---
const sel = (dark) =>
  dark
    ? { border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }
    : undefined

const selCls = (dark, selected) =>
  selected
    ? dark
      ? ''
      : 'border-navy bg-navy text-white'
    : dark
      ? ''
      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'

const unselStyle = (dark) =>
  dark
    ? { border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }
    : undefined

// --- Single choice ---
function SingleChoice({ question, value, onChange, dark = false }) {
  return (
    <div className="grid gap-3">
      {question.options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 group ${selCls(dark, selected)}`}
            style={selected ? sel(dark) : unselStyle(dark)}
          >
            {opt.icon && (
              <span className="text-xl shrink-0">{opt.icon}</span>
            )}
            <span className="flex flex-col">
              <span className="font-medium text-sm leading-snug">{opt.label}</span>
              {opt.sublabel && (
                <span
                  className="text-xs mt-0.5"
                  style={{ color: selected ? 'rgba(255,255,255,0.7)' : dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
                >
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
function MultipleChoice({ question, value = [], onChange, onNext, dark = false }) {
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
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 ${selCls(dark, selected)}`}
              style={selected ? sel(dark) : unselStyle(dark)}
            >
              {opt.icon && <span className="text-lg shrink-0">{opt.icon}</span>}
              <span className="flex flex-col">
                <span className="font-medium text-sm leading-snug">{opt.label}</span>
                {opt.sublabel && (
                  <span
                    className="text-xs mt-0.5"
                    style={{ color: selected ? 'rgba(255,255,255,0.7)' : dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
                  >
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
        className="mt-2 w-full sm:w-auto sm:self-start px-8 py-3.5 font-semibold rounded-full
          active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #FF9270, #FFE989)', boxShadow: '0 4px 16px rgba(255,146,112,0.35)', color: '#010101' }}
      >
        Continuer →
      </button>
    </div>
  )
}

// --- Region select ---
function RegionSelect({ value, onChange, options, onNext, dark = false }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl px-5 py-4 font-medium
            focus:outline-none transition-colors duration-150 pr-10 cursor-pointer border-2"
          style={
            dark
              ? {
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                }
              : {
                  background: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#374151',
                }
          }
        >
          <option value="" disabled>Sélectionnez votre région…</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: dark ? '#010101' : '#FFFFFF', color: dark ? '#FFFFFF' : '#374151' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="w-full sm:w-auto sm:self-start px-8 py-3.5 font-semibold rounded-full
          active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #FF9270, #FFE989)', boxShadow: '0 4px 16px rgba(255,146,112,0.35)', color: '#010101' }}
      >
        Continuer →
      </button>
    </div>
  )
}

// --- Email step (optionnel, avec bouton Passer) ---
function EmailStep({ value = '', onChange, onNext, onSkip, dark = false }) {
  const valid = typeof value === 'string' && value.includes('@') && value.includes('.')

  const inputStyle = dark
    ? { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }
    : { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#374151' }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="votre@email.com"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && valid && onNext()}
        className="w-full border-2 rounded-xl px-5 py-4 font-medium focus:outline-none transition-colors duration-150"
        style={inputStyle}
        autoComplete="email"
      />
      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full sm:w-auto sm:self-start px-8 py-3.5 font-semibold rounded-full
          active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #FF9270, #FFE989)',
          boxShadow: '0 4px 16px rgba(255,146,112,0.35)',
          color: '#010101',
        }}
      >
        Voir mes résultats →
      </button>
      <button
        onClick={onSkip}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontSize: 14, color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF',
          transition: 'color 0.15s ease', textAlign: 'left',
        }}
        onMouseEnter={e => e.currentTarget.style.color = dark ? '#FFFFFF' : '#4B5563'}
        onMouseLeave={e => e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF'}
      >
        Passer
      </button>
    </div>
  )
}

// --- Lead form ---
function LeadForm({ value = {}, onChange, onNext, dark = false }) {
  const update = (key, val) => onChange({ ...value, [key]: val })
  const valid = value.prenom?.trim() && value.email?.includes('@')

  const inputStyle = dark
    ? { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }
    : { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#374151' }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Votre prénom"
        value={value.prenom || ''}
        onChange={(e) => update('prenom', e.target.value)}
        className="w-full border-2 rounded-xl px-5 py-4 font-medium
          focus:outline-none transition-colors duration-150"
        style={{
          ...inputStyle,
          '::placeholder': { color: dark ? 'rgba(255,255,255,0.3)' : '#D1D5DB' },
        }}
      />
      <input
        type="email"
        placeholder="Votre adresse email"
        value={value.email || ''}
        onChange={(e) => update('email', e.target.value)}
        className="w-full border-2 rounded-xl px-5 py-4 font-medium
          focus:outline-none transition-colors duration-150"
        style={inputStyle}
      />
      <p className="text-xs leading-relaxed" style={{ color: dark ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }}>
        Vos données sont confidentielles et ne seront jamais revendues.
      </p>
      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full sm:w-auto sm:self-start px-8 py-4 font-bold rounded-full text-base
          active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #FF9270, #FFE989)',
          boxShadow: '0 4px 16px rgba(255,146,112,0.35)',
          color: '#010101',
        }}
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

export default function Question({ question, value, onChange, onNext, onBack, onSkip, direction, showBack, dark = false }) {
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
        <h2
          className="text-2xl sm:text-3xl font-bold leading-tight mb-2"
          style={{ color: dark ? '#FFFFFF' : '#1A1A18' }}
        >
          {question.titre}
        </h2>
        {question.soustitre && (
          <p
            className="text-base leading-relaxed"
            style={{ color: dark ? 'rgba(255,255,255,0.55)' : '#6B7280' }}
          >
            {question.soustitre}
          </p>
        )}
      </div>

      {/* Contenu selon le type */}
      {question.type === 'single' && (
        <SingleChoice question={question} value={value} onChange={onChange} dark={dark} />
      )}
      {question.type === 'multiple' && (
        <MultipleChoice question={question} value={value} onChange={onChange} onNext={onNext} dark={dark} />
      )}
      {question.type === 'select' && (
        <RegionSelect options={question.options} value={value} onChange={onChange} onNext={onNext} dark={dark} />
      )}
      {question.type === 'email' && (
        <EmailStep value={value} onChange={onChange} onNext={onNext} onSkip={onSkip} dark={dark} />
      )}
      {question.type === 'lead' && (
        <LeadForm value={value} onChange={onChange} onNext={onNext} dark={dark} />
      )}

      {/* Navigation retour */}
      {showBack && (
        <button
          onClick={onBack}
          className="mt-6 flex items-center gap-1.5 text-sm transition-colors duration-150"
          style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
          onMouseEnter={e => e.currentTarget.style.color = dark ? '#FFFFFF' : '#4B5563'}
          onMouseLeave={e => e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF'}
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
