import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAuth = () => {
    if (password === 'subventionpro2026') setAuth(true)
  }

  useEffect(() => {
    if (auth) fetchLeads()
  }, [auth])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch {
      setLeads([])
    }
    setLoading(false)
  }

  // ── Écran login ──────────────────────────────────────────────────────────

  if (!auth) return (
    <div style={{
      minHeight: '100vh',
      background: '#010101',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 40,
        width: '100%',
        maxWidth: 360,
        boxSizing: 'border-box',
      }}>
        <h2 style={{ color: '#fff', marginBottom: 24, fontSize: 24, fontWeight: 700 }}>
          Dashboard SubventionPro
        </h2>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12,
            color: '#fff',
            fontSize: 16,
            marginBottom: 16,
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
        <button
          onClick={handleAuth}
          style={{
            width: '100%',
            padding: '12px 0',
            background: 'linear-gradient(135deg, #FF9270, #FFE989)',
            border: 'none',
            borderRadius: 100,
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            color: '#010101',
          }}
        >
          Accéder
        </button>
      </div>
    </div>
  )

  // ── Dashboard ────────────────────────────────────────────────────────────

  const stats = [
    { label: 'Total leads', value: leads.length },
    { label: 'Hot', value: leads.filter(l => l.score >= 75).length, color: '#FF9270' },
    { label: 'Warm', value: leads.filter(l => l.score >= 45 && l.score < 75).length, color: '#FFE989' },
    { label: 'Cold', value: leads.filter(l => l.score < 45).length, color: 'rgba(255,255,255,0.4)' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: 'clamp(16px, 4vw, 40px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          marginBottom: 40,
        }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700 }}>
            Leads SubventionPro
          </h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {stats.map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '12px 20px',
                textAlign: 'center',
                minWidth: 80,
              }}>
                <div style={{ color: stat.color || '#FF9270', fontSize: 24, fontWeight: 700 }}>
                  {stat.value}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton refresh */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={fetchLeads}
            disabled={loading}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 100,
              color: '#fff',
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Chargement...' : 'Rafraichir'}
          </button>
        </div>

        {/* Table leads */}
        {loading && leads.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 80 }}>
            Chargement...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {leads.map(lead => (
              <div key={lead.id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${
                  lead.score >= 75 ? 'rgba(255,146,112,0.3)' :
                  lead.score >= 45 ? 'rgba(255,233,137,0.2)' :
                  'rgba(255,255,255,0.08)'
                }`,
                borderRadius: 16,
                padding: 'clamp(16px, 3vw, 24px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                alignItems: 'center',
                gap: 16,
              }}>
                {/* Entreprise */}
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
                    {lead.nom_entreprise || 'Sans nom'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    {lead.email || "Pas d'email"} · {lead.siren || 'Sans SIREN'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 4 }}>
                    {[lead.secteur, lead.region, lead.taille].filter(Boolean).join(' · ')}
                  </div>
                </div>

                {/* Aides */}
                <div>
                  <div style={{ color: '#FF9270', fontWeight: 700, fontSize: 20 }}>
                    {(lead.montant_total || 0).toLocaleString('fr-FR')}€
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    {lead.nb_aides} aide{lead.nb_aides > 1 ? 's' : ''} trouvée{lead.nb_aides > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Date */}
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  {new Date(lead.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </div>

                {/* Score badge */}
                <div style={{ justifySelf: 'end' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: 100,
                    fontWeight: 700,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    background: lead.score >= 75 ? 'rgba(255,146,112,0.2)' :
                                 lead.score >= 45 ? 'rgba(255,233,137,0.15)' :
                                 'rgba(255,255,255,0.08)',
                    color: lead.score >= 75 ? '#FF9270' :
                           lead.score >= 45 ? '#FFE989' :
                           'rgba(255,255,255,0.4)',
                  }}>
                    {lead.score >= 75 ? 'Hot' :
                     lead.score >= 45 ? 'Warm' : 'Cold'}
                    {' '}({lead.score})
                  </span>
                </div>
              </div>
            ))}

            {leads.length === 0 && (
              <div style={{
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'center',
                padding: 80,
                fontSize: 16,
              }}>
                Aucun lead pour l'instant.
                Lancez des simulations pour les voir apparaitre ici.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
