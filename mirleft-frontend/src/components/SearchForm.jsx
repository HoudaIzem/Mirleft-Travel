import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchForm = ({ compact = false }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      q: formData.destination || 'Mirleft',
      guests: String(formData.guests),
    });
    if (formData.checkIn) params.set("check_in", formData.checkIn);
    if (formData.checkOut) params.set("check_out", formData.checkOut);
    navigate(`/search?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];
  const isRtl = i18n.language === 'ar';

  if (compact) {
    return (
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-full shadow-xl p-2 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-1.5"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Destination */}
        <div className="flex-1 min-w-0 w-full">
          <div className="relative">
            <MapPin className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("home.destinationPlaceholder")}
              className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-[#006687] focus:border-transparent outline-none"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div className="flex-1 min-w-0 w-full">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              min={today}
              className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-[#006687] focus:border-transparent outline-none"
              value={formData.checkIn}
              onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="flex-1 min-w-0 w-full">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              min={formData.checkIn || today}
              className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-[#006687] focus:border-transparent outline-none"
              value={formData.checkOut}
              onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 min-w-0 w-full">
          <div className="relative">
            <Users className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={formData.guests}
              onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
              className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-[#006687] focus:border-transparent outline-none cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? t("home.guestOne") : t("home.guestOther")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-[#006687] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#005F41] transition-colors flex items-center gap-1.5 text-sm whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          {t("search.search")}
        </button>
      </form>
    );
  }

  // Full-size version for hero section
  return (
    <form 
      onSubmit={handleSubmit}
      className="mt-6 w-full max-w-5xl px-1 text-start sm:mt-9 sm:px-0 lg:max-w-6xl"
      aria-label={t("search.search")}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_16px_48px_rgba(0,0,0,0.3)] ring-1 ring-white/60 backdrop-blur-sm sm:rounded-2xl">
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(112px,132px)] lg:items-stretch">
          <SearchCell label={t("home.destination")} isFirst isRtl={isRtl}>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder={t("home.destinationPlaceholder")}
              className={heroInputClass}
            />
          </SearchCell>
          <SearchCell label={t("search.checkIn")} isRtl={isRtl}>
            <input
              type="date"
              min={today}
              value={formData.checkIn}
              onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              className={`${heroInputClass} hero-search-input`}
            />
          </SearchCell>
          <SearchCell label={t("search.checkOut")} isRtl={isRtl}>
            <input
              type="date"
              min={formData.checkIn || today}
              value={formData.checkOut}
              onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              className={`${heroInputClass} hero-search-input`}
            />
          </SearchCell>
          <SearchCell label={t("search.guests")} isRtl={isRtl}>
            <select
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
              className={`${heroInputClass} cursor-pointer`}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? t("home.guestOne") : t("home.guestOther")}
                </option>
              ))}
            </select>
          </SearchCell>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#006687] px-4 text-white transition hover:bg-[#005F41] active:scale-[0.99]"
          >
            <Search className="h-5 w-5 shrink-0" strokeWidth={2.25} />
            <span className="text-sm font-bold sm:text-[15px]">{t("search.search")}</span>
          </button>
        </div>

        <div className="flex flex-col lg:hidden">
          <SearchCell label={t("home.destination")} stacked isRtl={isRtl}>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder={t("home.destinationPlaceholder")}
              className={heroInputClass}
            />
          </SearchCell>
          <div className="grid grid-cols-2 border-t border-[#ebe3da]">
            <SearchCell label={t("search.checkIn")} stacked isRtl={isRtl}>
              <input
                type="date"
                min={today}
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className={`${heroInputClass} hero-search-input`}
              />
            </SearchCell>
            <SearchCell label={t("search.checkOut")} stacked borderSide isRtl={isRtl}>
              <input
                type="date"
                min={formData.checkIn || today}
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className={`${heroInputClass} hero-search-input`}
              />
            </SearchCell>
          </div>
          <SearchCell label={t("search.guests")} stacked isRtl={isRtl}>
            <select
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
              className={`${heroInputClass} cursor-pointer`}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? t("home.guestOne") : t("home.guestOther")}
                </option>
              ))}
            </select>
          </SearchCell>
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 bg-[#006687] text-sm font-bold text-white transition hover:bg-[#005F41]"
          >
            <Search className="h-4 w-4" />
            {t("search.search")}
          </button>
        </div>
      </div>
    </form>
  );
};

const FIELD_H = "h-[42px] sm:h-[44px]";
const heroInputClass = `hero-search-input ${FIELD_H} w-full min-w-0 border-0 bg-transparent p-0 text-sm font-semibold leading-tight text-[#1a1208] outline-none placeholder:font-medium placeholder:text-[#9a8b7f] focus:ring-0 sm:text-[15px]`;

function SearchCell({ label, children, isFirst, stacked, borderSide, isRtl }) {
  const sideBorder = borderSide
    ? isRtl
      ? "border-r"
      : "border-l"
    : isFirst === false && !stacked
      ? isRtl
        ? "border-r"
        : "border-l"
      : "";

  return (
    <div
      className={`flex min-w-0 flex-col justify-center px-3.5 py-3 sm:px-4 sm:py-3.5 ${
        stacked
          ? `border-t border-[#ebe3da] ${borderSide ? sideBorder : ""}`
          : `border-[#ebe3da] ${isFirst ? "" : sideBorder}`
      }`}
    >
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#6b5c50] sm:text-[11px]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default SearchForm;