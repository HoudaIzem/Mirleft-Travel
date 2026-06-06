import { Menu, X, Globe, Heart, Bot } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import i18n from '../i18n';

const navItems = [
  { to: '/hotels', key: 'hotels' },
  { to: '/restaurants', key: 'restaurants' },
  { to: '/activities', key: 'thingsToDo' },
  { to: '/vacation-rentals', key: 'vacationRentals' },
  { to: '/assistant', key: 'assistant', icon: Bot },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('mirleft_lang', lng);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0 text-xl font-bold tracking-tight text-[var(--color-primary-600)] sm:text-2xl">
          Mirleft Travel
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ to, key, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <span className="inline-flex items-center gap-1.5">
                {Icon && <Icon className="h-4 w-4" />}
                {t(`navbar.${key}`)}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <label className="relative flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm">
            <Globe className="h-4 w-4 text-gray-400" />
            <select
              defaultValue={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="cursor-pointer bg-transparent pr-1 outline-none"
              aria-label={t('navbar.language')}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
          </label>

          {isAuthenticated && (
            <Link
              to="/profile"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
              aria-label={t('navbar.favorites')}
            >
              <Heart className="h-5 w-5" />
            </Link>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {user?.name?.split(' ')[0]}
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-[var(--color-primary-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-700)]"
            >
              {t('navbar.login')}
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-700 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ to, key, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={() => setOpen(false)}>
                <span className="inline-flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {t(`navbar.${key}`)}
                </span>
              </NavLink>
            ))}
            <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
              {t('navbar.contact')}
            </NavLink>
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
            <select
              defaultValue={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-primary-600)]">
                  {t('navbar.favorites')}
                </Link>
                <button type="button" onClick={handleLogout} className="text-left text-sm text-red-600">
                  {t('navbar.logout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[var(--color-primary-600)] py-3 text-center text-sm font-semibold text-white"
              >
                {t('navbar.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
