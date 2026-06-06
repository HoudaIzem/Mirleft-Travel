import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useProperties } from '../hooks/useApi';
import ListingCard from '../components/ListingCard';
import MirleftMap from '../components/MirleftMap';
import DateRangeField from '../components/DateRangeField';
import { LoadingState, ErrorState } from '../components/PageState';
import { MODEL_TYPES } from '../utils/apiHelpers';
import { fakeProperties } from '../data/fakeData';

const ITEMS_PER_PAGE = 4;

export default function PropertiesListImproved() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    sort_by: searchParams.get('sort_by') || 'latest',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    page: searchParams.get('page') || '1',
  });
  const [dates, setDates] = useState({
    checkIn: searchParams.get('check_in') || '',
    checkOut: searchParams.get('check_out') || '',
  });

  const { data: apiProperties, loading, error, meta, reload } = useProperties({
    per_page: ITEMS_PER_PAGE,
    ...filters,
  });

  const fallbackProperties = useMemo(() => {
    let filtered = [...fakeProperties];

    if (filters.type) {
      filtered = filtered.filter((property) => property.type === filters.type);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.min_price) {
      filtered = filtered.filter((property) => property.price >= Number(filters.min_price));
    }

    if (filters.max_price) {
      filtered = filtered.filter((property) => property.price <= Number(filters.max_price));
    }

    if (filters.sort_by === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort_by === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort_by === 'rating') {
      filtered.sort((a, b) => b.average_rating - a.average_rating);
    }

    return filtered;
  }, [filters]);

  const useFallback = !loading && (error || apiProperties.length === 0);
  const totalItems = useFallback ? fallbackProperties.length : meta?.total ?? apiProperties.length;
  const totalPages = Math.max(
    1,
    useFallback ? Math.ceil(fallbackProperties.length / ITEMS_PER_PAGE) : meta?.last_page ?? 1
  );
  const currentPage = Math.min(Number(filters.page) || 1, totalPages);

  const properties = useMemo(() => {
    if (useFallback) {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return fallbackProperties.slice(start, start + ITEMS_PER_PAGE);
    }

    return apiProperties;
  }, [apiProperties, currentPage, fallbackProperties, useFallback]);

  const syncSearchParams = (nextFilters) => {
    const next = new URLSearchParams();

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });

    if (dates.checkIn) next.set('check_in', dates.checkIn);
    if (dates.checkOut) next.set('check_out', dates.checkOut);

    setSearchParams(next);
  };

  const applyFilters = (nextFilters = filters) => {
    syncSearchParams(nextFilters);
    reload();
  };

  const updateFilter = (key, value) => {
    const nextFilters = { ...filters, [key]: value, page: '1' };
    setFilters(nextFilters);
    applyFilters(nextFilters);
  };

  const updateDates = (nextDates) => {
    setDates(nextDates);
    syncSearchParams(filters);
  };

  const goToPage = (nextPage) => {
    const page = Math.min(Math.max(1, nextPage), totalPages);
    const nextFilters = { ...filters, page: String(page) };
    setFilters(nextFilters);
    applyFilters(nextFilters);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="flex-1">
              <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                {t('search.placeholder')}
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  placeholder="Mirleft, Morocco"
                  className="w-full text-sm outline-none"
                />
              </div>
            </label>
            <div className="flex-1">
              <DateRangeField
                checkIn={dates.checkIn}
                checkOut={dates.checkOut}
                onCheckInChange={(value) => updateDates({ ...dates, checkIn: value })}
                onCheckOutChange={(value) => updateDates({ ...dates, checkOut: value })}
              />
            </div>
            <button
              type="button"
              onClick={() => applyFilters()}
              className="rounded-xl bg-[var(--color-primary-600)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-700)]"
            >
              {t('search.search')}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-12 sm:px-6">
        <div className="lg:col-span-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {totalItems} {t('navbar.hotels')} — Mirleft
            </h1>
            <select
              value={filters.sort_by}
              onChange={(event) => updateFilter('sort_by', event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="latest">{t('filters.latest')}</option>
              <option value="price_asc">{t('filters.priceAsc')}</option>
              <option value="price_desc">{t('filters.priceDesc')}</option>
              <option value="rating">{t('filters.topRated')}</option>
            </select>
          </div>

          {loading && <LoadingState message={t('lists.loadingProperties')} />}
          {error && !properties.length && <ErrorState message={error.message} onRetry={reload} />}

          {!loading && (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                {properties.map((property) => (
                  <ListingCard
                    key={property.id}
                    item={property}
                    to={`/hotels/${property.id}?check_in=${dates.checkIn}&check_out=${dates.checkOut}`}
                    modelType={MODEL_TYPES.property}
                  />
                ))}
                {properties.length === 0 && (
                  <p className="col-span-full py-12 text-center text-gray-500">
                    {t('lists.noPropertiesFound')}
                  </p>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:flex-row">
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-full bg-[var(--color-primary-600)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <MirleftMap markers={properties} height="280px" />
            <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-100">
              <h3 className="font-bold text-gray-900">{t('filters.type')}</h3>
              <label className="mt-4 block text-sm">
                <select
                  value={filters.type}
                  onChange={(event) => updateFilter('type', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                >
                  <option value="">{t('filters.all')}</option>
                  <option value="hotel">{t('filters.hotel')}</option>
                  <option value="riad">{t('filters.riad')}</option>
                  <option value="villa">{t('filters.villa')}</option>
                  <option value="guesthouse">{t('filters.guesthouse')}</option>
                </select>
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
