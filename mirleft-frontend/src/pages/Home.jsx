import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home as HomeIcon,
  Landmark,
  Search as SearchIcon,
  Star,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import MirleftMap from "../components/MirleftMap";
import {
  propertyService,
  restaurantService,
  activityService,
  vacationRentalService,
} from "../services/services";
import {
  activityListings,
  hotelListings,
  restaurantListings,
} from "../data/mockContent";
const FIELD_H = "h-[42px] sm:h-[44px]";

const FALLBACK_MAP_MARKERS = [
  {
    id: "hotel-aftas",
    name: "Aftas Beach Boutique Hotel",
    type: "hotel",
    latitude: 29.582,
    longitude: -10.035,
    location: "Aftas Beach, Mirleft",
    link: "/hotels",
  },
  {
    id: "rest-brise",
    name: "La Brise de Mer",
    type: "restaurant",
    latitude: 29.578,
    longitude: -10.028,
    location: "Plage Sidi Mohammed, Mirleft",
    link: "/restaurants",
  },
  {
    id: "act-legzira",
    name: "Legzira Surf Camp",
    type: "activity",
    latitude: 29.401,
    longitude: -10.152,
    location: "Legzira Beach",
    link: "/activities",
  },
  {
    id: "rental-cliff",
    name: "Cliffside Ocean Villa",
    type: "rental",
    latitude: 29.586,
    longitude: -10.042,
    location: "Marabout Heights, Mirleft",
    link: "/vacation-rentals",
  },
  {
    id: "hotel-kasbah",
    name: "Riad de la Mer",
    type: "hotel",
    latitude: 29.584,
    longitude: -10.031,
    location: "Old Town, Mirleft",
    link: "/hotels",
  },
  {
    id: "act-sunset",
    name: "Sunset Coastal Trek",
    type: "activity",
    latitude: 29.575,
    longitude: -10.022,
    location: "Mirleft coastline",
    link: "/activities",
  },
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    q: "Mirleft",
    checkIn: "",
    checkOut: "",
    guests: 2,
  });
  const [mapMarkers, setMapMarkers] = useState(FALLBACK_MAP_MARKERS);

  const quickActions = useMemo(
    () => [
      { labelKey: "home.quickHotels", icon: HomeIcon, color: "bg-emerald-400", href: "/hotels" },
      { labelKey: "home.quickRestaurants", icon: UtensilsCrossed, color: "bg-sky-400", href: "/restaurants" },
      { labelKey: "home.quickThingsToDo", icon: Landmark, color: "bg-amber-300", href: "/activities" },
      { labelKey: "home.quickVacationRentals", icon: Waves, color: "bg-emerald-200", href: "/vacation-rentals" },
    ],
    []
  );

  const highlights = useMemo(
    () => [
      {
        titleKey: "home.highlightLegziraTitle",
        descKey: "home.highlightLegziraDesc",
        badgeKey: "home.highlightLegziraBadge",
        image: "/Legzira,.jfif",
        href: "/activities",
      },
      {
        titleKey: "home.highlightKasbahTitle",
        descKey: "home.highlightKasbahDesc",
        image: "/old town.jfif",
        href: "/hotels",
      },
      {
        titleKey: "home.highlightSidiTitle",
        descKey: "home.highlightSidiDesc",
        image: "/Sidi Mohammed Ben Abdellah.jfif",
        href: "/activities",
      },
    ],
    []
  );

  useEffect(() => {
    loadMapMarkers();
  }, [i18n.language]);

  const loadMapMarkers = async () => {
    try {
      const [propsRes, restRes, actRes, rentalRes] = await Promise.all([
        propertyService.getAll({ per_page: 12 }).catch(() => null),
        restaurantService.getAll({ per_page: 12 }).catch(() => null),
        activityService.getAll({ per_page: 12 }).catch(() => null),
        vacationRentalService.getAll({ per_page: 12 }).catch(() => null),
      ]);

      const markers = [
        ...toMapMarkers(propsRes?.data?.data ?? hotelListings, "hotel", "/hotels", 0),
        ...toMapMarkers(restRes?.data?.data ?? restaurantListings, "restaurant", "/restaurants", 20),
        ...toMapMarkers(actRes?.data?.data ?? activityListings, "activity", "/activities", 40),
        ...toMapMarkers(rentalRes?.data?.data ?? [], "rental", "/vacation-rentals", 60),
      ];

      setMapMarkers(markers.length > 0 ? markers : FALLBACK_MAP_MARKERS);
    } catch {
      setMapMarkers(FALLBACK_MAP_MARKERS);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      q: search.q,
      guests: String(search.guests),
    });
    if (search.checkIn) params.set("check_in", search.checkIn);
    if (search.checkOut) params.set("check_out", search.checkOut);
    navigate(`/search?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];
  const isRtl = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-[#fbf4ef] text-gray-900">
      <section className="relative overflow-hidden bg-[#f7ede7]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("/🌊 Mirleft & Legzira_ Morocco’s Hidden Coastal Gems.jfif")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#5a1f09]/65 via-[#6f3516]/25 to-[#2a1b12]/15" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(85vh,720px)] max-w-7xl flex-col items-center justify-center px-3 pb-6 pt-24 text-center sm:min-h-[min(88vh,780px)] sm:px-6 sm:pb-8 sm:pt-28 lg:pt-32">
          <p className="mb-3 inline-flex max-w-[95vw] rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur sm:mb-4 sm:px-4 sm:text-sm">
            {t("home.badge")}
          </p>
          <h1 className="max-w-4xl px-1 text-[1.65rem] font-extrabold leading-tight text-white drop-shadow-lg sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl">
            {t("home.heroHeadline")}
          </h1>

          <HeroSearchForm
            search={search}
            setSearch={setSearch}
            onSubmit={handleSearch}
            today={today}
            t={t}
            isRtl={isRtl}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-3 pb-10 sm:px-6 sm:pb-12 lg:max-w-6xl">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
            {quickActions.map(({ labelKey, icon: Icon, color, href }) => (
              <Link
                key={labelKey}
                to={href}
                className="group flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/85 px-2.5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-sm transition hover:bg-white hover:shadow-md sm:rounded-xl sm:px-3 sm:py-3"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color} text-gray-900`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-gray-800 sm:text-xs">
                  {t(labelKey)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-3 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <section className="mb-12 sm:mb-14">
          <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 sm:mb-8 sm:text-3xl md:text-4xl">
            {t("home.magicTitle")}
          </h2>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 lg:grid-rows-2">
            {highlights.map((item, index) => (
              <HighlightCard key={item.titleKey} item={item} large={index === 0} t={t} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:mb-3 sm:text-3xl md:text-4xl">
            {t("home.mapTitle")}
          </h2>
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base">
            {t("home.mapSubtitle")}
          </p>
          <div className="-mx-3 overflow-hidden rounded-xl bg-white shadow-[0_12px_40px_rgba(61,40,23,0.1)] ring-1 ring-[#e8ddd4] sm:mx-0 sm:rounded-2xl">
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-[#f0e6dc] bg-[#fffdf9] px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
              <MapLegend color="bg-[#0b6b46]" label={t("home.mapHotels")} />
              <MapLegend color="bg-[#c45c26]" label={t("home.mapRestaurants")} />
              <MapLegend color="bg-[#1a6b7a]" label={t("home.mapActivities")} />
              <MapLegend color="bg-[#8b5a2b]" label={t("home.mapRentals")} />
            </div>
            <MirleftMap
              markers={mapMarkers}
              height="clamp(280px, 55vh, 480px)"
              className="rounded-none ring-0"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroSearchForm({ search, setSearch, onSubmit, today, t, isRtl }) {
  const guestLabel = (n) =>
    `${n} ${n === 1 ? t("home.guestOne") : t("home.guestOther")}`;

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 w-full max-w-5xl px-1 text-start sm:mt-9 sm:px-0 lg:max-w-6xl"
      aria-label={t("search.search")}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_16px_48px_rgba(0,0,0,0.3)] ring-1 ring-white/60 backdrop-blur-sm sm:rounded-2xl">
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(112px,132px)] lg:items-stretch">
          <SearchCell label={t("home.destination")} isFirst isRtl={isRtl}>
            <input
              type="text"
              value={search.q}
              onChange={(e) => setSearch({ ...search, q: e.target.value })}
              placeholder={t("home.destinationPlaceholder")}
              className={heroInputClass}
            />
          </SearchCell>
          <SearchCell label={t("search.checkIn")} isRtl={isRtl}>
            <input
              type="date"
              min={today}
              value={search.checkIn}
              onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
              className={`${heroInputClass} hero-search-input`}
            />
          </SearchCell>
          <SearchCell label={t("search.checkOut")} isRtl={isRtl}>
            <input
              type="date"
              min={search.checkIn || today}
              value={search.checkOut}
              onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
              className={`${heroInputClass} hero-search-input`}
            />
          </SearchCell>
          <SearchCell label={t("search.guests")} isRtl={isRtl}>
            <select
              value={search.guests}
              onChange={(e) => setSearch({ ...search, guests: Number(e.target.value) })}
              className={`${heroInputClass} cursor-pointer`}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {guestLabel(n)}
                </option>
              ))}
            </select>
          </SearchCell>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#0b6b46] px-4 text-white transition hover:bg-[#074d32] active:scale-[0.99]"
          >
            <SearchIcon className="h-5 w-5 shrink-0" strokeWidth={2.25} />
            <span className="text-sm font-bold sm:text-[15px]">{t("search.search")}</span>
          </button>
        </div>

        <div className="flex flex-col lg:hidden">
          <SearchCell label={t("home.destination")} stacked isRtl={isRtl}>
            <input
              type="text"
              value={search.q}
              onChange={(e) => setSearch({ ...search, q: e.target.value })}
              placeholder={t("home.destinationPlaceholder")}
              className={heroInputClass}
            />
          </SearchCell>
          <div className="grid grid-cols-2 border-t border-[#ebe3da]">
            <SearchCell label={t("search.checkIn")} stacked isRtl={isRtl}>
              <input
                type="date"
                min={today}
                value={search.checkIn}
                onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                className={`${heroInputClass} hero-search-input`}
              />
            </SearchCell>
            <SearchCell label={t("search.checkOut")} stacked borderSide isRtl={isRtl}>
              <input
                type="date"
                min={search.checkIn || today}
                value={search.checkOut}
                onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                className={`${heroInputClass} hero-search-input`}
              />
            </SearchCell>
          </div>
          <SearchCell label={t("search.guests")} stacked isRtl={isRtl}>
            <select
              value={search.guests}
              onChange={(e) => setSearch({ ...search, guests: Number(e.target.value) })}
              className={`${heroInputClass} cursor-pointer`}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {guestLabel(n)}
                </option>
              ))}
            </select>
          </SearchCell>
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 bg-[#0b6b46] text-sm font-bold text-white transition hover:bg-[#074d32]"
          >
            <SearchIcon className="h-4 w-4" />
            {t("search.search")}
          </button>
        </div>
      </div>
    </form>
  );
}

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

function HighlightCard({ item, large = false, t }) {
  return (
    <Link
      to={item.href}
      className={`group relative block overflow-hidden rounded-xl bg-gray-900 shadow-lg sm:rounded-2xl ${
        large
          ? "min-h-[280px] sm:min-h-[360px] lg:col-span-2 lg:row-span-2 lg:min-h-[560px]"
          : "min-h-[220px] sm:min-h-[270px]"
      }`}
    >
      <img
        src={item.image}
        alt={t(item.titleKey)}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
        {item.badgeKey && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-semibold sm:mb-3 sm:px-3 sm:py-1 sm:text-xs">
            <span>{t(item.badgeKey)}</span>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-2.5 w-2.5 fill-current sm:h-3 sm:w-3" />
              ))}
            </span>
          </div>
        )}
        <h3 className="text-lg font-semibold sm:text-2xl">{t(item.titleKey)}</h3>
        <p className="mt-1 line-clamp-2 max-w-xl text-xs leading-relaxed text-white/90 sm:text-sm sm:leading-6">
          {t(item.descKey)}
        </p>
      </div>
    </Link>
  );
}

function MapLegend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:gap-2 sm:text-sm">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3 ${color}`} />
      {label}
    </span>
  );
}

function toMapMarkers(items, type, basePath, offset = 0) {
  return (items || []).map((item, index) => {
    const id = item.id ?? item.slug ?? index;
    const name = item.name || item.title;
    const lat = item.latitude ?? 29.582 + ((offset + index) % 7) * 0.006 - 0.018;
    const lng = item.longitude ?? -10.035 + ((offset + index) % 5) * 0.008 - 0.016;

    return {
      id: `${type}-${id}`,
      name,
      type,
      latitude: Number(lat),
      longitude: Number(lng),
      location: item.location || "Mirleft, Morocco",
      link: `${basePath}/${id}`,
    };
  });
}