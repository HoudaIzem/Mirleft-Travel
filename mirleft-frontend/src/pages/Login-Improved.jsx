import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Field({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input
          {...props}
          className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] ${
            Icon ? 'pl-10' : ''
          } ${props.className || ''}`}
        />
      </div>
    </label>
  );
}

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const redirectTo = searchParams.get('redirect') || location.state?.from || '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.passwordConfirmation) {
          setError(t('auth.passwordMismatch'));
          return;
        }

        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.passwordConfirmation
        );
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (nextIsLogin) => {
    setIsLogin(nextIsLogin);
    setError('');
    setShowPassword(false);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.7),_transparent_40%),linear-gradient(180deg,#0f172a_0%,#1e293b_100%)]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.72), rgba(15,23,42,0.72)), url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2000&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,rgba(15,23,42,0)_40%,rgba(14,165,233,0.08)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white backdrop-blur-md lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
                Mirleft Travel
              </p>
              <h1 className="mt-4 max-w-md text-4xl font-bold tracking-tight">
                {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
                {t('auth.yourJourneyBegins')}
              </p>
            </div>

            <div className="grid gap-4 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Secure login for bookings, favorites, and profile management.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Create an account to save trips, bookings, and reviews.
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-600)] text-white shadow-lg shadow-emerald-200/50">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Mirleft Travel
              </h2>
              <p className="mt-2 text-sm text-slate-600">{t('auth.yourJourneyBegins')}</p>
            </div>

            <div className="mb-6 flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isLogin
                    ? 'bg-white text-[var(--color-primary-700)] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('auth.signIn')}
              </button>
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  !isLogin
                    ? 'bg-white text-[var(--color-primary-700)] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('auth.signUp')}
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Field
                  label={t('auth.fullName')}
                  icon={UserRound}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('auth.fullName')}
                  required
                />
              )}

              <Field
                label={t('auth.email')}
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{t('auth.password')}</span>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-xs font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)]"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <Field
                  label={t('auth.confirmPassword')}
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  placeholder={t('auth.confirmPassword')}
                  required
                  minLength={6}
                />
              )}

              {isLogin && (
                <label className="flex items-center gap-2 pt-1 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)]"
                  />
                  {t('auth.rememberMe')}
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[var(--color-primary-600)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 transition hover:bg-[var(--color-primary-700)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? isLogin
                    ? t('auth.signingIn')
                    : t('auth.registering')
                  : isLogin
                    ? t('auth.signInToYourJourney')
                    : t('auth.createAccount')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              {isLogin ? (
                <p>
                  {t('auth.dontHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => toggleMode(false)}
                    className="font-semibold text-[var(--color-primary-600)] hover:underline"
                  >
                    {t('auth.createAccount')}
                  </button>
                </p>
              ) : (
                <p>
                  {t('auth.alreadyHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => toggleMode(true)}
                    className="font-semibold text-[var(--color-primary-600)] hover:underline"
                  >
                    {t('auth.signIn')}
                  </button>
                </p>
              )}
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
