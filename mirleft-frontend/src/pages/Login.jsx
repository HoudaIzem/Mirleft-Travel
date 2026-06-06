import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const COLORS = {
  sand: '#f5ece0',
  gold: '#113611',
  goldDark: '#123b1e',
  brown: '#153526',
  brownLight: 'rgba(34,128,75,0.4)',
  brownFaint: 'rgba(35,126,59,0.3)',
  cream: '#fdf3e3',
  taupe: '#152d23',
  goldBorder: 'rgba(12,62,25,0.4)',
}

export default function Login() {
  const { t, i18n } = useTranslation()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [status, setStatus] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function submit(event) {
    event.preventDefault()
    setStatus('Connecting...')
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password, form.password_confirmation)
        setStatus(`Welcome${form.name ? `, ${form.name}` : ''} to Mirleft!`)
      } else {
        await login(form.email, form.password)
        setStatus(`Welcome back to Mirleft!`)
      }
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      setStatus(error.response?.data?.message || 'An error occurred')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Jost:wght@300;400;500&display=swap');
        .ml-tab-btn { transition: color 0.2s; }
        .ml-field-inner { transition: border-color 0.2s; }
        .ml-field-inner:focus-within { border-bottom-color: ${COLORS.gold} !important; }
        .ml-enter-btn:hover { background: ${COLORS.goldDark} !important; }
        .ml-forgot:hover { color: ${COLORS.gold} !important; }
      `}</style>

      <div style={{ display: 'flex', width: '100%', maxWidth: 860, minHeight: 520, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(61,42,15,0.18)' }}>

        {/* LEFT — illustration panel */}
        <div style={{ width: '52%', position: 'relative', flexShrink: 0 }}>
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 290 520"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stopColor="#c9a96e" />
                <stop offset="40%" stopColor="#a07840" />
                <stop offset="100%" stopColor="#3d2a0f" />
              </linearGradient>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4956a" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#c9a96e" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3d2a0f" stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect width="290" height="520" fill="url(#bg)" />
            <rect width="290" height="520" fill="url(#sky)" />
            {/* Dune silhouettes */}
            <path d="M0 300 Q50 250 100 290 Q140 240 180 275 Q220 230 290 255 L290 520 L0 520Z" fill="#3d2a0f" opacity="0.5" />
            <path d="M0 370 Q60 330 120 360 Q175 320 230 350 Q255 335 290 345 L290 520 L0 520Z" fill="#2a1a08" opacity="0.7" />
            <path d="M0 430 Q70 405 140 425 Q200 400 290 415 L290 520 L0 520Z" fill="#1e1206" opacity="0.9" />
            {/* Sun */}
            <circle cx="210" cy="85" r="38" fill="#e8a040" opacity="0.22" />
            <circle cx="210" cy="85" r="26" fill="#e8a040" opacity="0.2" />
            {/* Moroccan star */}
            <polygon points="75,55 81,74 101,74 86,86 92,105 75,93 58,105 64,86 49,74 69,74" fill="none" stroke="#fdf3e3" strokeWidth="0.7" opacity="0.35" />
            {/* Atlantic wave lines */}
            <path d="M0 455 Q36 446 72 455 Q108 464 144 455 Q180 446 216 455 Q252 464 290 455" stroke="#d4b896" strokeWidth="0.9" fill="none" opacity="0.4" />
            <path d="M0 472 Q36 463 72 472 Q108 481 144 472 Q180 463 216 472 Q252 481 290 472" stroke="#d4b896" strokeWidth="0.7" fill="none" opacity="0.28" />
          </svg>

          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(42,28,14,0.15) 0%, rgba(42,28,14,0.6) 100%)' }} />

          {/* Quote */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.2rem' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: COLORS.cream, lineHeight: 1.25, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}>
              {i18n.language === 'en' ? 'Discover Mirleft: Where the Atlantic meets the Sahara' : 
              (i18n.language === 'fr' ? 'Découvrez Mirleft: Où l’Atlantique rencontre le Sahara' : 
              'اكتشف ميرلفت: حيث يلتقي المحيط الأطلسي بالصحراء')}
            </p>
            <p style={{ fontSize: 11, fontWeight: 300, color: COLORS.taupe, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Mirleft · Souss-Massa · Morocco
            </p>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div style={{ flex: 1, background: COLORS.sand, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.4rem 2rem', position: 'relative' }}>
          {/* Gold left border */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: COLORS.gold }} />

          {/* Brand */}
          <div style={{ border: `1.5px solid ${COLORS.gold}`, padding: '8px 20px', marginBottom: '2rem' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: COLORS.brown, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Mirleft Travel
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', width: '100%', borderBottom: `1px solid rgba(184,134,42,0.35)`, marginBottom: '1.6rem' }}>
            {['login', 'register'].map((tab) => (
              <button
                key={tab}
                className="ml-tab-btn"
                onClick={() => { setMode(tab); setStatus('') }}
                style={{
                  flex: 1, padding: '7px 0', fontSize: 11,
                  fontFamily: "'Jost', sans-serif", fontWeight: 500,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: mode === tab ? COLORS.gold : COLORS.brownLight,
                  background: 'none', border: 'none',
                  borderBottom: mode === tab ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  marginBottom: -1, cursor: 'pointer',
                }}
              >
                {tab === 'login' ? t('auth.signIn') : t('auth.signUp')}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ width: '100%' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, color: COLORS.brown, marginBottom: 3 }}>
              {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </p>
            <p style={{ fontSize: 11, fontWeight: 300, color: COLORS.brownLight, letterSpacing: '0.05em', marginBottom: '1.4rem' }}>
              {i18n.language === 'en' ? 'Access your Mirleft Travel account' : 
              (i18n.language === 'fr' ? 'Accédez à votre compte Mirleft Travel' : 
              'الوصول إلى حسابك في ميرلفت ترافيل')}
            </p>

            {mode === 'register' && (
              <Field
                placeholder={t('auth.fullName')}
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
            )}
            <Field
              placeholder={t('auth.email')}
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <Field
              placeholder={t('auth.password')}
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v, password_confirmation: v })}
            />

            {mode === 'login' && (
              <p className="ml-forgot" style={{ textAlign: 'right', fontSize: 11, color: 'rgba(184,134,42,0.7)', marginBottom: '1.4rem', cursor: 'pointer', fontWeight: 300, letterSpacing: '0.04em' }}>
                {t('auth.forgotPassword')}
              </p>
            )}

            <button
              type="submit"
              className="ml-enter-btn"
              style={{ width: '100%', padding: 12, background: COLORS.gold, color: COLORS.cream, border: 'none', borderRadius: 2, fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', cursor: 'pointer', marginTop: mode === 'register' ? 6 : 0 }}
            >
              {i18n.language === 'en' ? 'Continue' : (i18n.language === 'fr' ? 'Continuer' : 'متابعة')}
            </button>
          </form>

          {status && (
            <p style={{ marginTop: 14, fontSize: 12, color: '#7a5a1a', textAlign: 'center', letterSpacing: '0.04em', fontWeight: 300 }}>
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ placeholder, value, onChange, type = 'text' }) {
  return (
    <div style={{ width: '100%', marginBottom: 14 }}>
      <div
        className="ml-field-inner"
        style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid rgba(184,134,42,0.4)`, padding: '8px 2px' }}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: '#3d2a0f', letterSpacing: '0.04em' }}
        />
      </div>
    </div>
  )
}
