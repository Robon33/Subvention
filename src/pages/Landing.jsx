import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'
import Simulateur from '../components/Simulateur'

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
}

function FadeUp({ children, delay = 0, className = '' }) {
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
        scrolled ? 'apple-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#5E5CE6] flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold text-[#1D1D1F] text-base tracking-tight">SubventionPro</span>
        </a>

        <div className="hidden sm:flex items-center gap-8">
          <a href="#comment-ca-marche" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors duration-200">
            Comment ça marche
          </a>
          <a href="#faq" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors duration-200">
            FAQ
          </a>
          <a href="#simulateur" className="btn-cta text-sm px-5 py-2.5">
            Simuler gratuitement
          </a>
        </div>

        {/* Mobile CTA */}
        <a href="#simulateur" className="sm:hidden btn-cta text-sm px-4 py-2">
          Simuler →
        </a>
      </div>
    </nav>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function MockupCard() {
  return (
    <div className="apple-card p-6 max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
        <span className="text-xs text-[#6E6E73] font-medium">3 aides trouvées</span>
      </div>
      <div className="text-3xl font-bold text-[#1D1D1F] mb-1">
        34 000 <span className="text-[#0071E3]">€</span>
      </div>
      <div className="text-sm text-[#6E6E73] mb-5">estimés pour votre profil</div>
      <div className="space-y-3">
        {[
          { nom: 'Chèque Numérique', montant: '5 000 €', tag: 'digital' },
          { nom: "Aide à l'alternance", montant: '6 000 €', tag: 'emploi' },
          { nom: 'ADEME Énergie', montant: '23 000 €', tag: 'écologie' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7]"
          >
            <div>
              <div className="text-sm font-medium text-[#1D1D1F]">{item.nom}</div>
              <span className="text-[10px] text-[#6E6E73] uppercase tracking-wide">{item.tag}</span>
            </div>
            <div className="text-sm font-bold text-[#0071E3]">{item.montant}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-gradient-to-b from-[#F5F5F7] to-white">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 apple-pill mb-8"
        >
          <span>⚡</span>
          <span>Simulation gratuite · Résultat en 2 minutes</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold text-[#1D1D1F] leading-[1.05] tracking-tight mb-6"
        >
          L'État vous doit<br />
          <span className="gradient-text">de l'argent.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg sm:text-xl text-[#6E6E73] leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Subventions régionales, aides nationales, fonds européens — votre entreprise est probablement éligible à des milliers d'euros que vous ne réclamez pas.{' '}
          <span className="text-[#1D1D1F] font-semibold">On s'occupe de tout.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <a href="#simulateur" className="btn-cta btn-cta-lg w-full sm:w-auto">
            Calculer mes aides gratuitement →
          </a>
          <a
            href="#comment-ca-marche"
            className="btn-ghost w-full sm:w-auto px-7 py-4 text-base"
          >
            Voir comment ça marche
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-sm text-[#6E6E73] mb-14"
        >
          ⚡ Résultat en 2 minutes · Zéro engagement · Zéro avance de frais
        </motion.p>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
    <FadeUp delay={delay} className="apple-card p-8 text-center hover-lift">
      <div ref={ref} className="text-4xl sm:text-5xl font-extrabold text-[#1D1D1F] mb-2 tabular-nums">
        {count.toLocaleString('fr-FR')}{suffix}
      </div>
      <div className="text-sm text-[#6E6E73] leading-snug">{label}</div>
    </FadeUp>
  )
}

function Stats() {
  return (
    <Section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
        <StatCard target={40000} suffix="€" label="identifiés en moyenne par simulation" delay={0} />
        <StatCard target={11} label="dispositifs cumulables analysés" delay={0.1} />
        <StatCard target={100} suffix="%" label="gratuit jusqu'au résultat" delay={0.2} />
      </div>
    </Section>
  )
}

// ─── Simulateur intégré ────────────────────────────────────────────────────────

function SimulateurSection() {
  return (
    <Section id="simulateur" className="py-24 px-6 bg-[#F5F5F7]">
      <div className="max-w-3xl mx-auto">
        <FadeUp className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] mb-3">
            Découvrez vos aides en 2 minutes
          </h2>
          <p className="text-[#6E6E73] text-base">
            Simulation gratuite · Sans engagement · Résultat immédiat
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div
            className="bg-white border border-[#D2D2D7] overflow-hidden"
            style={{ borderRadius: '24px', boxShadow: '0 4px 40px rgba(0,0,0,0.08), 0 1px 6px rgba(0,0,0,0.04)' }}
          >
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
    <Section id="comment-ca-marche" className="py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] mb-4">
            Trois étapes. Zéro prise de tête.
          </h2>
        </FadeUp>

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-7 top-10 bottom-10 w-px bg-gradient-to-b from-[#0071E3]/30 via-[#5E5CE6]/20 to-transparent hidden sm:block"
          />

          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.15}>
                <div className="flex gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-2xl apple-card flex items-center justify-center text-[#0071E3] font-extrabold text-lg">
                    {step.num}
                  </div>
                  <div className="pt-2 flex-1">
                    <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">{step.titre}</h3>
                    <p className="text-[#6E6E73] text-sm leading-relaxed mb-3">{step.desc}</p>
                    {step.cta && (
                      <a
                        href={step.cta.href}
                        className="text-sm font-semibold text-[#0071E3] hover:text-[#0077ED] transition-colors"
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
      </div>
    </Section>
  )
}

// ─── Pourquoi nous ────────────────────────────────────────────────────────────

const WHY_CARDS = [
  {
    icon: '📋',
    titre: 'Plus de 200 dispositifs',
    desc: 'Régionaux, nationaux, européens, sectoriels. Impossible à suivre seul. On cartographie tout pour vous.',
  },
  {
    icon: '😤',
    titre: 'Des dossiers conçus pour décourager',
    desc: 'Formulaires abscons, pièces justificatives multiples, délais incompréhensibles. On a appris à les aimer.',
  },
  {
    icon: '📞',
    titre: 'Personne ne vous appelle',
    desc: "L'État ne fait pas de marketing. Aucun organisme ne vous prévient que vous êtes éligible. C'est exactement notre rôle.",
  },
]

function PourquoiNous() {
  return (
    <Section className="py-24 px-6 bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F]">
            Ce n'est pas votre faute si vous êtes passé à côté.
          </h2>
        </FadeUp>
        <FadeUp delay={0.1} className="text-center mb-14">
          <p className="text-[#6E6E73] text-base max-w-xl mx-auto leading-relaxed">
            Le système de subventions français est complexe par conception. On a construit l'outil qu'il aurait fallu depuis le début.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-3 gap-5">
          {WHY_CARDS.map((card, i) => (
            <FadeUp key={card.titre} delay={i * 0.12}>
              <div className="apple-card p-7 h-full hover-lift">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-[#1D1D1F] text-base mb-3">{card.titre}</h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">{card.desc}</p>
              </div>
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
    <Section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F]">
            Ils ne savaient pas non plus.
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-3 gap-5">
          {TEMOIGNAGES.map((t, i) => (
            <FadeUp key={t.nom} delay={i * 0.12}>
              <div className="apple-card p-7 flex flex-col gap-5 hover-lift h-full">
                <div className="inline-flex self-start items-center gap-1.5 bg-[#34C759]/10 border border-[#34C759]/25 text-[#1E7E34] text-sm font-bold px-3 py-1.5 rounded-full">
                  {t.montant}
                </div>
                <p className="text-[#1D1D1F] text-sm leading-relaxed flex-1 italic">
                  "{t.quote}"
                </p>
                <div>
                  <div className="font-semibold text-[#1D1D1F] text-sm">{t.nom}</div>
                  <div className="text-[#6E6E73] text-xs mt-0.5">{t.titre}</div>
                </div>
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
    <FadeUp delay={index * 0.06}>
      <div className="apple-card overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-5 text-left"
        >
          <span className="font-semibold text-[#1D1D1F] text-sm pr-4">{item.q}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 text-[#0071E3] text-xl leading-none"
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
              <div className="px-6 pb-5 text-sm text-[#6E6E73] leading-relaxed border-t border-[#D2D2D7] pt-4">
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
    <Section id="faq" className="py-24 px-6 bg-[#F5F5F7]">
      <div className="max-w-2xl mx-auto">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F]">
            Les questions qu'on nous pose tout le temps.
          </h2>
        </FadeUp>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── CTA Final ────────────────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <Section className="py-24 px-6 bg-white">
      <FadeUp>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="apple-card px-8 py-16"
            style={{ background: 'linear-gradient(160deg, #F0F7FF 0%, #FFFFFF 60%)', borderRadius: '24px' }}
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] leading-tight mb-5">
              Votre prochain investissement<br />
              est peut-être{' '}
              <span className="gradient-text">déjà financé.</span>
            </h2>

            <p className="text-[#6E6E73] text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Découvrez en 2 minutes ce que l'État, votre région et l'Europe peuvent couvrir pour vous.
            </p>

            <a href="#simulateur" className="btn-cta btn-cta-lg inline-flex">
              Lancer ma simulation →
            </a>

            <p className="text-[#6E6E73] text-sm mt-6">
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
    <footer className="py-8 px-6 border-t border-[#D2D2D7] bg-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0071E3] to-[#5E5CE6] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-[#6E6E73] text-sm font-medium">SubventionPro</span>
        </div>
        <p className="text-[#6E6E73] text-xs text-center">
          © 2026 SubventionPro · Simulation gratuite · Données confidentielles
        </p>
      </div>
    </footer>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
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
