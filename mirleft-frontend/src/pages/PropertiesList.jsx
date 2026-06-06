import { ChevronDown, Heart, Map, MapPin, Search, Star, Wifi } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProperties } from '../hooks/useApi'
import { resolveImage } from '../utils/imageMap'

export default function PropertiesList() {
  const { t, i18n } = useTranslation()
  const { data, loading } = useProperties()
  const properties = data

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <TopSearchBar t={t} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">
                {loading ? t('lists.loadingProperties') : `${properties.length} ${t('lists.propertiesInMirleft')}`}
              </h1>
            </div>
            <button className="flex items-center gap-2 text-sm font-semibold text-stone-500">
              {t('lists.sortBy')}:
              <span className="text-emerald-700">{t('lists.priceLowToHigh')}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5">
            {properties && properties.map((property) => (
              <article
                key={property.id}
                className="grid overflow-hidden rounded-3xl border border-stone-200 bg-[#faf7f4] shadow-sm md:grid-cols-[1.05fr_1.45fr]"
              >
                <div className="relative min-h-[240px]">
                  <img src={resolveImage(property.image)} alt={property.name} className="h-full w-full object-cover object-center" />
                  <button className="absolute right-4 top-4 rounded-full bg-white p-2 text-rose-500 shadow">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-col justify-between p-6">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-bold leading-tight text-stone-900">{property.name}</h2>
                        <p className="mt-2 flex items-center gap-2 text-sm text-stone-500">
                          <MapPin className="h-4 w-4" />
                          {property.location}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="mb-1 flex justify-end gap-1 text-emerald-600">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <span key={dot} className="h-2.5 w-2.5 rounded-full bg-current" />
                          ))}
                        </div>
                        <p className="text-sm text-stone-500">{property.rating || t('property.noRatingYet')}</p>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {[t('lists.freeWifi'), t('lists.pool')].map((perk) => (
                        <span
                          key={perk}
                          className="inline-flex items-center gap-1 rounded-full bg-stone-200/70 px-3 py-1 text-xs font-semibold text-stone-600"
                        >
                          <Wifi className="h-3.5 w-3.5" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-4xl font-extrabold text-stone-900">
                          {property.price || t('lists.checkPrice')}
                          <span className="ml-1 text-lg font-medium text-stone-500">{t('lists.perNight')}</span>
                        </p>
                    </div>

                    <Link
                      to={`/hotels/${property.id}`}
                      className="rounded-full bg-sky-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
                    >
                      {t('lists.viewDeal')}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!loading && properties.length === 0 && (
            <p className="mt-6 text-sm text-stone-500">{t('lists.noScrapedProperties')}</p>
          )}

          {loading && <p className="mt-6 text-sm text-stone-500">{t('lists.loadingLatestStays')}</p>}
        </section>

        <aside className="space-y-6 border-l border-stone-200 pl-0 lg:pl-8">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-[#d7d2ce] shadow-sm">
            <div className="flex min-h-[255px] items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.35),_rgba(0,0,0,0.08))]">
              <button className="flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-4 text-sm font-semibold text-white shadow-lg">
                <Map className="h-4 w-4" />
                {t('lists.viewOnMap')}
              </button>
            </div>
          </div>

          <FilterGroup title={t('lists.priceRange')} t={t}>
            <CheckRow checked label="$50 - $150" />
            <CheckRow label="$0 - $50" />
            <CheckRow label="$150 - $250" />
          </FilterGroup>

          <FilterGroup title={t('lists.starRating')} t={t}>
            <div className="grid grid-cols-5 gap-2">
              {['1+', '2+', '3+', '4+', '5'].map((value, index) => (
                <button
                  key={value}
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    index === 3 ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-stone-300 text-stone-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title={t('lists.propertyType')} t={t}>
            <div className="grid grid-cols-2 gap-3">
              {[t('lists.hotels'), t('lists.riads'), t('lists.villas'), t('lists.guesthouses')].map((value) => (
                <button key={value} className="rounded-xl bg-stone-200/70 px-4 py-3 text-sm font-medium text-stone-700">
                  {value}
                </button>
              ))}
            </div>
          </FilterGroup>
        </aside>
      </div>
    </div>
  )
}

function TopSearchBar({ t }) {
  return (
    <div className="grid gap-3 rounded-3xl border border-stone-200 bg-[#faf7f4] p-3 shadow-sm md:grid-cols-[1.45fr_0.72fr_0.72fr]">
      <InputPill icon={Search} label="Mirleft, Morocco" />
      <InputPill icon={Star} label="Oct 24 - Oct 28" />
      <InputPill icon={MapPin} label={t('search.guests')} />
    </div>
  )
}

function InputPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-600">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  )
}

function FilterGroup({ title, children, t }) {
  return (
    <section>
      <h3 className="mb-4 text-sm font-bold text-stone-800">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function CheckRow({ label, checked = false }) {
  return (
    <label className="flex items-center gap-3 text-sm text-stone-600">
      <span
        className={`h-5 w-5 rounded-md border ${checked ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300 bg-transparent'}`}
      />
      {label}
    </label>
  )
}
