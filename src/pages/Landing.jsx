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
    transition: { duration: 0.3, ease: 'easeOut', delay },
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

function Section({ children, className = '', id, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} id={id} className={`relative ${className}`} style={style}>
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

function IconDocument({ color = 'currentColor' }) {
  return (
    <svg width="24" height="24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  )
}

function IconAlertTriangle({ color = 'currentColor' }) {
  return (
    <svg width="24" height="24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconPhone({ color = 'currentColor' }) {
  return (
    <svg width="24" height="24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 013 1.18 2 2 0 015 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  )
}

// ─── Navbar pill ──────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const shadow = scrolled
    ? '0 4px 30px rgba(0,0,0,0.14), 0 1px 6px rgba(0,0,0,0.08)'
    : '0 2px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)'

  return (
    <>
      {/* Desktop — pill flottante */}
      <nav
        aria-label="Navigation principale"
        className="hidden sm:flex"
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: '#FFFFFF',
          borderRadius: '100px',
          padding: '6px 6px 6px 20px',
          alignItems: 'center',
          gap: '4px',
          boxShadow: shadow,
          whiteSpace: 'nowrap',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <a href="/" style={{ fontWeight: 700, color: '#010101', marginRight: '16px', fontSize: '15px', textDecoration: 'none' }}>
          SubventionPro
        </a>
        <a href="#comment-ca-marche" style={{ padding: '8px 16px', borderRadius: '100px', color: '#6B6B6B', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
          Comment ça marche
        </a>
        <a href="#faq" style={{ padding: '8px 16px', borderRadius: '100px', color: '#6B6B6B', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
          FAQ
        </a>
        <a href="#simulateur" style={{ padding: '10px 20px', background: '#010101', color: '#FFFFFF', borderRadius: '100px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', marginLeft: '8px' }}>
          Simuler gratuitement →
        </a>
      </nav>

      {/* Mobile — barre pleine largeur */}
      <nav
        aria-label="Navigation mobile"
        className="flex sm:hidden"
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(1,1,1,0.06)',
          padding: '12px 20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <a href="/" style={{ fontWeight: 700, color: '#010101', fontSize: '15px', textDecoration: 'none' }}>
          SubventionPro
        </a>
        <a href="#simulateur" style={{ padding: '8px 16px', background: '#010101', color: '#FFFFFF', borderRadius: '100px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          Simuler →
        </a>
      </nav>
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function MockupCard() {
  return (
    <div
      className="light-card p-6 mx-auto"
      style={{ maxWidth: '480px', marginTop: '48px' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF7D', animation: 'pulse 2s infinite' }} />
        <span style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 500 }}>3 aides trouvées</span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 800, color: '#010101', marginBottom: '4px' }}>
        34 000{' '}
        <span style={{
          background: 'linear-gradient(135deg, #FF9270, #FFE989)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>€</span>
      </div>
      <div style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '20px' }}>estimés pour votre profil</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { nom: 'Chèque Numérique', montant: '5 000 €', tag: 'digital' },
          { nom: "Aide à l'alternance", montant: '6 000 €', tag: 'emploi' },
          { nom: 'ADEME Énergie', montant: '23 000 €', tag: 'écologie' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '12px',
              background: '#F7F7F7',
              border: '1px solid rgba(1,1,1,0.06)',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#010101' }}>{item.nom}</div>
              <div style={{ fontSize: '10px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.tag}</div>
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF9270, #FFE989)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>{item.montant}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section
      style={{
        background: '#F7F7F7',
        paddingTop: '140px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ marginBottom: '24px' }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#EFEFEF',
            color: '#6B6B6B',
            borderRadius: '100px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 500,
          }}>
            <span style={{ color: '#FF9270' }}>●</span>
            Simulation gratuite · Sans engagement
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          style={{
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 800,
            color: '#010101',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: '16px',
          }}
        >
          L'État vous doit<br />
          <span style={{
            background: 'linear-gradient(135deg, #FF9270, #FFE989)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            de l'argent.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
          style={{
            fontSize: '18px',
            color: '#6B6B6B',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '0 auto 40px',
          }}
        >
          Subventions régionales, aides nationales, fonds européens — votre entreprise est probablement éligible à des milliers d'euros que vous ne réclamez pas.{' '}
          <span style={{ color: '#010101', fontWeight: 600 }}>On s'occupe de tout.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}
        >
          <a href="#simulateur" className="btn-primary btn-primary-lg">
            Calculer mes aides gratuitement →
          </a>
          <a href="#comment-ca-marche" className="btn-ghost">
            Voir comment ça marche
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, ease: 'easeOut' }}
          style={{ fontSize: '13px', color: '#6B6B6B' }}
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
    <FadeUp delay={delay}>
      <motion.div
        className="light-card hover-lift"
        style={{ padding: '32px', textAlign: 'center' }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div
          ref={ref}
          style={{ fontSize: '56px', fontWeight: 800, color: '#010101', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '8px' }}
        >
          {count.toLocaleString('fr-FR')}{suffix}
        </div>
        <div style={{ fontSize: '14px', color: '#6B6B6B' }}>{label}</div>
      </motion.div>
    </FadeUp>
  )
}

function Stats() {
  return (
    <Section style={{ background: '#EFEFEF', padding: '80px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard target={40000} suffix="€" label="identifiés en moyenne par simulation" delay={0} />
        <StatCard target={11} label="dispositifs cumulables analysés" delay={0.1} />
        <StatCard target={100} suffix="%" label="gratuit jusqu'au résultat" delay={0.2} />
      </div>
    </Section>
  )
}

// ─── Simulateur (dark) ────────────────────────────────────────────────────────

function SimulateurSection() {
  return (
    <Section id="simulateur" style={{ background: '#010101', padding: '96px 24px', overflow: 'hidden' }}>
      {/* Blob orange */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,146,112,0.20) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <FadeUp className="text-center" style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}
          >
            Découvrez vos aides en 2 minutes
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
            Simulation gratuite · Sans engagement · Résultat immédiat
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '24px',
            padding: '40px',
          }}>
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
    <Section id="comment-ca-marche" style={{ background: '#F7F7F7', padding: '96px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <FadeUp className="text-center" style={{ marginBottom: '64px' }}>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 700,
              color: '#010101',
              letterSpacing: '-0.02em',
            }}
          >
            Trois étapes. Zéro prise de tête.
          </h2>
        </FadeUp>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {STEPS.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.1}>
              <div style={{ position: 'relative' }}>
                {/* Watermark */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '-20px',
                    fontSize: '120px',
                    fontWeight: 900,
                    color: 'rgba(1,1,1,0.04)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {step.num}
                </div>

                <motion.div
                  className="light-card"
                  style={{ padding: '24px', position: 'relative' }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#FF9270', marginBottom: '10px', letterSpacing: '0.05em' }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#010101', marginBottom: '8px' }}>{step.titre}</h3>
                  <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.6, marginBottom: step.cta ? '12px' : 0 }}>{step.desc}</p>
                  {step.cta && (
                    <a href={step.cta.href} style={{ fontSize: '14px', fontWeight: 600, color: '#FF9270', textDecoration: 'none' }}>
                      {step.cta.label}
                    </a>
                  )}
                </motion.div>
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
  { icon: IconDocument, titre: 'Plus de 200 dispositifs', desc: 'Régionaux, nationaux, européens, sectoriels. Impossible à suivre seul. On cartographie tout pour vous.' },
  { icon: IconAlertTriangle, titre: 'Des dossiers conçus pour décourager', desc: 'Formulaires abscons, pièces justificatives multiples, délais incompréhensibles. On a appris à les aimer.' },
  { icon: IconPhone, titre: 'Personne ne vous appelle', desc: "L'État ne fait pas de marketing. Aucun organisme ne vous prévient que vous êtes éligible. C'est exactement notre rôle." },
]

function PourquoiNous() {
  return (
    <Section style={{ background: '#EFEFEF', padding: '96px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <FadeUp className="text-center" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: '#010101', letterSpacing: '-0.02em' }}>
            Ce n'est pas votre faute si vous êtes passé à côté.
          </h2>
        </FadeUp>
        <FadeUp delay={0.1} className="text-center" style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '16px', color: '#6B6B6B', maxWidth: '560px', margin: '12px auto 0', lineHeight: 1.7 }}>
            Le système de subventions français est complexe par conception. On a construit l'outil qu'il aurait fallu depuis le début.
          </p>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {WHY_CARDS.map((card, i) => (
            <FadeUp key={card.titre} delay={i * 0.1}>
              <motion.div
                className="light-card hover-lift"
                style={{ padding: '28px', height: '100%' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div style={{ color: '#010101', marginBottom: '16px' }}>
                  <card.icon color="#010101" />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#010101', marginBottom: '10px' }}>{card.titre}</h3>
                <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7 }}>{card.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Témoignages ──────────────────────────────────────────────────────────────

const TEMOIGNAGES = [
  { quote: "En 20 ans de restaurant je n'avais jamais touché une seule subvention. En trois semaines on a obtenu 23 000€ pour nos nouveaux équipements.", nom: 'Thomas D.', titre: 'Restaurateur · Lyon', montant: '+23 000€' },
  { quote: "Le dossier PMR traînait depuis deux ans. Ils l'ont monté en une semaine, on a eu 14 000€.", nom: 'Camille R.', titre: 'Gérante · Bordeaux', montant: '+14 000€' },
  { quote: "Je pensais que c'était réservé aux grandes boîtes. On a touché 18 500€ sans débourser un centime d'avance.", nom: 'Marc L.', titre: 'Artisan plombier · Nantes', montant: '+18 500€' },
]

function Temoignages() {
  return (
    <Section style={{ background: '#F7F7F7', padding: '96px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <FadeUp className="text-center" style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: '#010101', letterSpacing: '-0.02em' }}>
            Ils ne savaient pas non plus.
          </h2>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {TEMOIGNAGES.map((t, i) => (
            <FadeUp key={t.nom} delay={i * 0.1}>
              <motion.div
                className="light-card hover-lift"
                style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', height: '100%' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Quote mark décoratif */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '16px',
                    fontSize: '80px',
                    fontWeight: 900,
                    color: '#EFEFEF',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  "
                </div>

                {/* Badge montant */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #FF9270, #FFE989)',
                    color: '#010101',
                    fontSize: '13px',
                    fontWeight: 700,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {t.montant}
                </div>

                <p style={{ fontSize: '14px', color: '#010101', lineHeight: 1.7, fontStyle: 'italic', flex: 1, position: 'relative', zIndex: 1 }}>
                  "{t.quote}"
                </p>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#010101' }}>{t.nom}</div>
                  <div style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '2px' }}>{t.titre}</div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  { q: "C'est vraiment gratuit ?", r: "Totalement. Aucun frais en amont, aucun abonnement. On prend un pourcentage uniquement sur les subventions effectivement obtenues. Zéro résultat, zéro facture." },
  { q: "Combien peut-on espérer ?", r: "Ça dépend de votre profil et de vos projets. Nos simulations identifient en moyenne entre 15 000€ et 45 000€ de subventions potentielles cumulées. Faites la simulation pour voir." },
  { q: "Mon secteur est éligible ?", r: "Restauration, commerce, artisanat, services, hôtellerie — la grande majorité des TPE/PME françaises sont éligibles à au moins trois dispositifs. Vérifiez en 2 minutes." },
  { q: "Combien de temps pour recevoir les fonds ?", r: "Le montage de dossier prend 1 à 2 semaines. Le versement entre 1 et 6 mois selon les organismes. Certaines aides sont versées en moins de 30 jours." },
  { q: "C'est légal ?", r: "Ces aides sont publiques, créées précisément pour les entreprises comme la vôtre. Notre métier existe depuis des années. On formalise et automatise ce que des consultants font à la main depuis toujours." },
]

function FaqItem({ item, index, isLast }) {
  const [open, setOpen] = useState(false)

  return (
    <FadeUp delay={index * 0.05}>
      <div style={{ borderBottom: isLast ? 'none' : '1px solid rgba(1,1,1,0.08)' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 0',
            textAlign: 'left',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#010101', paddingRight: '16px' }}>{item.q}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ flexShrink: 0, fontSize: '20px', color: '#010101', lineHeight: 1 }}
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
              <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7, paddingBottom: '20px' }}>
                {item.r}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeUp>
  )
}

function Faq() {
  return (
    <Section id="faq" style={{ background: '#EFEFEF', padding: '96px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <FadeUp className="text-center" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: '#010101', letterSpacing: '-0.02em' }}>
            Les questions qu'on nous pose tout le temps.
          </h2>
        </FadeUp>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={item.q} item={item} index={i} isLast={i === FAQ_ITEMS.length - 1} />
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── CTA Final (dark) ─────────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <Section style={{ background: '#010101', padding: '96px 24px', overflow: 'hidden' }}>
      {/* Blob bleu */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(172,206,234,0.20) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <FadeUp style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '64px 48px',
          }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}>
              Votre prochain investissement<br />
              est peut-être{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF9270, #FFE989)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>déjà financé.</span>
            </h2>

            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
              Découvrez en 2 minutes ce que l'État, votre région et l'Europe peuvent couvrir pour vous.
            </p>

            <a href="#simulateur" className="btn-cta-gradient" style={{ padding: '16px 32px' }}>
              Lancer ma simulation →
            </a>

            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '20px' }}>
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
    <footer style={{ background: '#010101', padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>SubventionPro</span>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
          © 2026 SubventionPro · Simulation gratuite · Données confidentielles
        </p>
      </div>
    </footer>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh' }}>
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
