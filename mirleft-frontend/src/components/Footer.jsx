import { Link } from 'react-router-dom';
import { Share2, Globe, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gray-200 bg-[#F5F1E8] py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-4 lg:gap-16">
        {/* Brand & Description */}
        <div>
          <h3 className="mb-4 text-base font-bold text-gray-900">
            {t("footer.brandTitle")}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            {t("footer.brandDescription")}
          </p>
        </div>

        {/* Explore / Quick Links */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">
            {t("footer.explore")}
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <Link
                to="/about"
                className="hover:text-[var(--color-primary-600)] transition-colors"
              >
                {t("footer.aboutUs")}
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="hover:text-[var(--color-primary-600)] transition-colors"
              >
                {t("footer.support")}
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-[var(--color-primary-600)] transition-colors"
              >
                {t("footer.termsOfUse")}
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-[var(--color-primary-600)] transition-colors"
              >
                {t("footer.privacyPolicy")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Destinations / Support */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">
            {t("footer.destinations")}
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <Link
                to="/destinations/sidi-ifni"
                className="hover:text-[var(--color-primary-600)] transition-colors"
              >
                {t("footer.sidiIfni")}
              </Link>
            </li>
            <li>
              <Link
                to="/destinations/legzira"
                className="hover:text-[var(--color-primary-600)] transition-colors"
              >
                {t("footer.legziraBeach")}
              </Link>
            </li>
            <li>
              <Link
                to="/destinations/tiznit"
                className="hover:text-[var(--color-primary-600)] transition-colors"
              >
                {t("footer.tiznit")}
              </Link>
            </li>
            <li>
              <Link
                to="/destinations/agadir"
                className="hover:text-[var(--color-primary-600)] transition-colors"
              >
                {t("footer.agadir")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">
            {t("footer.contact")}
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 mb-6">
            <li>Email: info@mirlefttravel.com</li>
          </ul>

          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-[var(--color-primary-600)]">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-[var(--color-primary-600)]">
              <Globe className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-[var(--color-primary-600)]">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Mirleft Tourism Board
        </p>
      </div>
    </footer>
  );
}
