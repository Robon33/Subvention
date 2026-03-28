import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'
import Simulateur from '../components/Simulateur'

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay },
  }),
}

function FadeUp({ children, delay = 0, className = '', lift = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
      variants={fadeUp}
      whileHover={lift ? { y: -2, transition: { duration: 0.2 } } : undefined}
    >
      {children}
    </motion.div>
  )
}

function Section({ children, className = '', id }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} id={id} className={`relative ${className}`}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ hidden: {}, visible: {} }}
      >
        {children}
      </motion.div>
    </section>
  )
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconDocument() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconAlertTriangle() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 013 1.18 2 2 0 015 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  )
}

function IconZap() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'vectra-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #E8915A, #D4724A)' }}
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold text-[#1A1A18] text-base tracking-tight">SubventionPro</span>
        </a>

        <div className="hidden sm:flex items-center gap-8">
          <a href="#comment-ca-marche" className="text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors duration-200">
            Comment ça marche
          </a>
          <a href="#faq" className="text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors duration-200">
            FAQ
          </a>
          <a href="#simulateur" className="btn-cta text-sm px-6 py-3">
            Simuler gratuitement
          </a>
        </div>

        <a href="#simulateur" className="sm:hidden btn-cta text-sm px-4 py-2.5">
          Simuler →
        </a>
      </div>
    </nav>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function MockupCard() {
  return (
    <div className="vectra-card p-6 max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#4CAF7D] animate-pulse" />
        <span className="text-xs text-[#6B6860] font-medium">3 aides trouvées</span>
      </div>
      <div className="text-3xl font-bold text-[#1A1A18] mb-1">
        34 000 <span className="text-[#E8915A]">€</span>
      </div>
      <div className="text-sm text-[#6B6860] mb-5">estimés pour votre profil</div>
      <div className="space-y-3">
        {[
          { nom: 'Chèque Numérique', montant: '5 000 €', tag: 'digital' },
          { nom: "Aide à l'alternance", montant: '6 000 €', tag: 'emploi' },
          { nom: 'ADEME Énergie', montant: '23 000 €', tag: 'écologie' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl"
            style={{ background: '#F5F0E8', border: '1px solid rgba(26,26,24,0.07)' }}
          >
            <div>
              <div className="text-sm font-medium text-[#1A1A18]">{item.nom}</div>
              <span className="text-[10px] text-[#6B6860] uppercase tracking-wide">{item.tag}</span>
            </div>
            <div className="text-sm font-bold text-[#E8915A]">{item.montant}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 overflow-hidden"
      style={{ background: '#F5F0E8' }}
    >
      {/* Blob décoratif top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px]"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(232,145,90,0.10) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-flex mb-8"
        >
          <span className="vectra-pill">
            <span className="text-[#E8915A]"><IconZap /></span>
            Simulation gratuite · Résultat immédiat
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="font-extrabold text-[#1A1A18] leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(48px, 8vw, 72px)', letterSpacing: '-0.03em' }}
        >
          L'État vous doit<br />
          <span className="gradient-text">de l'argent.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
          className="text-[#6B6860] leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ fontSize: '18px', lineHeight: '1.7' }}
        >
          Subventions régionales, aides nationales, fonds européens — votre entreprise est probablement éligible à des milliers d'euros que vous ne réclamez pas.{' '}
          <span className="text-[#1A1A18] font-semibold">On s'occupe de tout.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5"
        >
          <a href="#simulateur" className="btn-cta btn-cta-lg w-full sm:w-auto">
            Calculer mes aides gratuitement →
          </a>
          <a href="#comment-ca-marche" className="btn-ghost w-full sm:w-auto">
            Voir comment ça marche
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, ease: 'easeOut' }}
          className="text-sm text-[#6B6860] mb-14"
        >
          Résultat en 2 minutes · Zéro engagement · Zéro avance de frais
        </motion.p>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MockupCard />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

function StatCard({ target, suffix = '', label, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useCountUp(target, 1800, inView)

  return (
    <FadeUp delay={delay} lift className="vectra-card p-8 text-center hover-lift">
      <div
        ref={ref}
        className="font-extrabold text-[#1A1A18] mb-2 tabular-nums"
        style={{ fontSize: '56px', letterSpacing: '-0.02em', lineHeight: 1 }}
      >
        {count.toLocaleString('fr-FR')}{suffix}
      </div>
      <div className="text-sm text-[#6B6860] leading-snug">{label}</div>
    </FadeUp>
  )
}

function Stats() {
  return (
    <Section className="py-20 px-6" style={{ background: '#EDEAE3' }}>
      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
        <StatCard target={40000} suffix="€" label="identifiés en moyenne par simulation" delay={0} />
        <StatCard target={11} label="dispositifs cumulables analysés" delay={0.1} />
        <StatCard target={100} suffix="%" label="gratuit jusqu'au résultat" delay={0.2} />
      </div>
    </Section>
  )
}

// ─── Section Simulateur (dark) ────────────────────────────────────────────────

function SimulateurSection() {
  return (
    <Section id="simulateur" className="py-24 px-6 overflow-hidden" style={{ background: '#111010' }}>
      {/* Blob décoratif orange */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(232,145,90,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        <FadeUp className="text-center mb-10">
          <h2
            className="font-bold text-white mb-3"
            style={{ fontSize: 'clamp(36px, 5vw, 52px)', letterSpacing: '-0.02em' }}
          >
            Découvrez vos aides en 2 minutes
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '18px' }}>
            Simulation gratuite · Sans engagement · Résultat immédiat
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="dark-card" style={{ padding: '40px' }}>
            <Simulateur inline />
          </div>
        </FadeUp>
      </div>
    </Section>
  )
}

// ─── Comment ça marche ────────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    titre: 'Simulez en 2 minutes',
    desc: "Répondez à quelques questions sur votre activité et vos projets. Notre outil analyse instantanément votre éligibilité sur l'ensemble des dispositifs disponibles.",
    cta: { label: 'Lancer la simulation →', href: '#simulateur' },
  },
  {
    num: '02',
    titre: 'On monte tout',
    desc: 'Un expert prend en charge la constitution complète de vos dossiers. Vous signez, on envoie. Aucune démarche administrative de votre côté.',
    cta: null,
  },
  {
    num: '03',
    titre: 'Vous encaissez',
    desc: "Les fonds sont versés directement sur votre compte. Notre commission ? Un pourcentage uniquement sur ce qu'on obtient. Rien si on échoue.",
    cta: null,
  },
]

function CommentCaMarche() {
  return (
    <Section id="comment-ca-marche" className="py-24 px-6" style={{ background: '#F5F0E8' }}>
      <div className="max-w-2xl mx-auto">
        <FadeUp className="text-center mb-16">
          <h2
            className="font-bold text-[#1A1A18] mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.02em' }}
          >
            Trois étapes. Zéro prise de tête.
          </h2>
        </FadeUp>

        <div className="space-y-10">
          {STEPS.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.12}>
              <div className="relative flex gap-6">
                {/* Watermark number */}
                <div
                  aria-hidden
                  className="absolute -left-2 -top-4 select-none pointer-events-none font-extrabold leading-none"
                  style={{
                    fontSize: '96px',
                    background: 'linear-gradient(135deg, #E8915A, #D4724A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    opacity: 0.10,
                  }}
                >
                  {step.num}
                </div>

                {/* Content card */}
                <div className="vectra-card p-6 flex-1 relative">
                  <div
                    className="text-xs font-bold mb-3 tabular-nums"
                    style={{ color: '#E8915A' }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A18] mb-2">{step.titre}</h3>
                  <p className="text-[#6B6860] text-sm leading-relaxed mb-3">{step.desc}</p>
                  {step.cta && (
                    <a
                      href={step.cta.href}
                      className="text-sm font-semibold transition-colors"
                      style={{ color: '#E8915A' }}
                    >
                      {step.cta.label}
                    </a>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Pourquoi nous ────────────────────────────────────────────────────────────

const WHY_CARDS = [
  {
    icon: <IconDocument />,
    titre: 'Plus de 200 dispositifs',
    desc: 'Régionaux, nationaux, européens, sectoriels. Impossible à suivre seul. On cartographie tout pour vous.',
  },
  {
    icon: <IconAlertTriangle />,
    titre: 'Des dossiers conçus pour décourager',
    desc: 'Formulaires abscons, pièces justificatives multiples, délais incompréhensibles. On a appris à les aimer.',
  },
  {
    icon: <IconPhone />,
    titre: 'Personne ne vous appelle',
    desc: "L'État ne fait pas de marketing. Aucun organisme ne vous prévient que vous êtes éligible. C'est exactement notre rôle.",
  },
]

function PourquoiNous() {
  return (
    <Section className="py-24 px-6" style={{ background: '#EDEAE3' }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-4">
          <h2
            className="font-bold text-[#1A1A18]"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.02em' }}
          >
            Ce n'est pas votre faute si vous êtes passé à côté.
          </h2>
        </FadeUp>
        <FadeUp delay={0.1} className="text-center mb-14">
          <p className="text-[#6B6860] text-base max-w-xl mx-auto leading-relaxed" style={{ lineHeight: 1.7 }}>
            Le système de subventions français est complexe par conception. On a construit l'outil qu'il aurait fallu depuis le début.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-3 gap-5">
          {WHY_CARDS.map((card, i) => (
            <FadeUp key={card.titre} delay={i * 0.1} lift className="vectra-card p-7 h-full hover-lift">
              <div className="text-[#E8915A] mb-4">{card.icon}</div>
              <h3 className="font-bold text-[#1A1A18] text-base mb-3">{card.titre}</h3>
              <p className="text-[#6B6860] text-sm leading-relaxed" style={{ lineHeight: 1.7 }}>{card.desc}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Témoignages ──────────────────────────────────────────────────────────────

const TEMOIGNAGES = [
  {
    quote: "En 20 ans de restaurant je n'avais jamais touché une seule subvention. En trois semaines on a obtenu 23 000€ pour nos nouveaux équipements.",
    nom: 'Thomas D.',
    titre: 'Restaurateur · Lyon',
    montant: '+23 000€',
  },
  {
    quote: "Le dossier PMR traînait depuis deux ans. Ils l'ont monté en une semaine, on a eu 14 000€.",
    nom: 'Camille R.',
    titre: 'Gérante · Bordeaux',
    montant: '+14 000€',
  },
  {
    quote: "Je pensais que c'était réservé aux grandes boîtes. On a touché 18 500€ sans débourser un centime d'avance.",
    nom: 'Marc L.',
    titre: 'Artisan plombier · Nantes',
    montant: '+18 500€',
  },
]

function Temoignages() {
  return (
    <Section className="py-24 px-6" style={{ background: '#F5F0E8' }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <h2
            className="font-bold text-[#1A1A18]"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.02em' }}
          >
            Ils ne savaient pas non plus.
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-3 gap-5">
          {TEMOIGNAGES.map((t, i) => (
            <FadeUp key={t.nom} delay={i * 0.1} lift className="vectra-card p-7 flex flex-col gap-5 hover-lift h-full">
              {/* Quote marks décoratifs */}
              <div
                className="text-5xl font-serif leading-none select-none"
                style={{ color: '#E8915A', opacity: 0.25, lineHeight: 0.8 }}
              >
                "
              </div>

              {/* Badge montant */}
              <div
                className="inline-flex self-start items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #E8915A, #D4724A)' }}
              >
                {t.montant}
              </div>

              <p className="text-[#1A1A18] text-sm leading-relaxed flex-1 italic" style={{ lineHeight: 1.7 }}>
                "{t.quote}"
              </p>
              <div>
                <div className="font-semibold text-[#1A1A18] text-sm">{t.nom}</div>
                <div className="text-[#6B6860] text-xs mt-0.5">{t.titre}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "C'est vraiment gratuit ?",
    r: "Totalement. Aucun frais en amont, aucun abonnement. On prend un pourcentage uniquement sur les subventions effectivement obtenues. Zéro résultat, zéro facture.",
  },
  {
    q: "Combien peut-on espérer ?",
    r: "Ça dépend de votre profil et de vos projets. Nos simulations identifient en moyenne entre 15 000€ et 45 000€ de subventions potentielles cumulées. Faites la simulation pour voir.",
  },
  {
    q: "Mon secteur est éligible ?",
    r: "Restauration, commerce, artisanat, services, hôtellerie — la grande majorité des TPE/PME françaises sont éligibles à au moins trois dispositifs. Vérifiez en 2 minutes.",
  },
  {
    q: "Combien de temps pour recevoir les fonds ?",
    r: "Le montage de dossier prend 1 à 2 semaines. Le versement entre 1 et 6 mois selon les organismes. Certaines aides sont versées en moins de 30 jours.",
  },
  {
    q: "C'est légal ?",
    r: "Ces aides sont publiques, créées précisément pour les entreprises comme la vôtre. Notre métier existe depuis des années. On formalise et automatise ce que des consultants font à la main depuis toujours.",
  },
]

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false)

  return (
    <FadeUp delay={index * 0.05}>
      <div
        className="overflow-hidden"
        style={{
          borderBottom: '1px solid rgba(26,26,24,0.10)',
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-2 py-5 text-left"
        >
          <span className="font-semibold text-[#1A1A18] text-sm pr-4">{item.q}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 text-xl leading-none font-light"
            style={{ color: '#E8915A' }}
          >
            +
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-2 pb-5 text-sm text-[#6B6860] leading-relaxed" style={{ lineHeight: 1.7 }}>
                {item.r}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeUp>
  )
}

function Faq() {
  return (
    <Section id="faq" className="py-24 px-6" style={{ background: '#EDEAE3' }}>
      <div className="max-w-2xl mx-auto">
        <FadeUp className="text-center mb-12">
          <h2
            className="font-bold text-[#1A1A18]"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.02em' }}
          >
            Les questions qu'on nous pose tout le temps.
          </h2>
        </FadeUp>

        <div
          className="vectra-card px-6 py-2"
          style={{ borderRadius: '20px' }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── CTA Final (dark) ─────────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <Section className="py-24 px-6 overflow-hidden" style={{ background: '#111010' }}>
      {/* Blob bleu décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(181,196,232,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <FadeUp className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="dark-card px-8 py-16">
            <h2
              className="font-extrabold text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.02em' }}
            >
              Votre prochain investissement<br />
              est peut-être{' '}
              <span className="gradient-text">déjà financé.</span>
            </h2>

            <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
              Découvrez en 2 minutes ce que l'État, votre région et l'Europe peuvent couvrir pour vous.
            </p>

            <a href="#simulateur" className="btn-cta btn-cta-lg inline-flex">
              Lancer ma simulation →
            </a>

            <p className="text-sm mt-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Rejoignez les dirigeants qui ne laissent plus d'argent sur la table.
            </p>
          </div>
        </div>
      </FadeUp>
    </Section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-8 px-6" style={{ background: '#1A1A18' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E8915A, #D4724A)' }}
          >
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>SubventionPro</span>
        </div>
        <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 SubventionPro · Simulation gratuite · Données confidentielles
        </p>
      </div>
    </footer>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <SimulateurSection />
      <CommentCaMarche />
      <PourquoiNous />
      <Temoignages />
      <Faq />
      <CtaFinal />
      <Footer />
    </div>
  )
}
