import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ListingCard from '../components/ListingCard';
import { LoadingState, ErrorState } from '../components/PageState';
import { MODEL_TYPES } from '../utils/apiHelpers';
import { useVacationRentals } from '../hooks/useApi';

const ITEMS_PER_PAGE = 4;

export default function VacationRentals() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data: rentals, meta, loading, error, reload } = useVacationRentals({
    per_page: ITEMS_PER_PAGE,
    page,
  });

  const totalPages = meta?.last_page ?? 1;
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900">{t('lists.vacationRentalsTitle')}</h1>
        <p className="mt-3 text-lg text-gray-600">
          {t('lists.vacationRentalsSubtitleAlt')}
        </p>
      </header>

      {loading && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={reload} />}

      {!loading && !error && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rentals.map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                to={`/hotels/${item.id}`}
                modelType={MODEL_TYPES.property}
              />
            ))}
            {rentals.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-10">{t('lists.noVacationRentalsFound')}</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:flex-row">
              <p className="text-sm text-gray-600">
                {t('common.page')} {currentPage} {t('common.of')} {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('common.prev')}
                </button>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full bg-[var(--color-primary-600)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('common.next')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}