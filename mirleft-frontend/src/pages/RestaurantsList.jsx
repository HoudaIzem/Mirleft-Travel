import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ListingCard from '../components/ListingCard';
import { LoadingState, ErrorState } from '../components/PageState';
import { MODEL_TYPES } from '../utils/apiHelpers';
import { useRestaurants } from '../hooks/useApi';
import { restaurantListings } from '../data/mockContent';

const ITEMS_PER_PAGE = 6;

export default function RestaurantsList() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: apiRestaurants, meta, loading, error, reload } = useRestaurants({
    per_page: ITEMS_PER_PAGE,
    page,
    search,
  });

  // If in English, use mock data instead of API data
  const restaurants = i18n.language === 'en' ? restaurantListings : apiRestaurants;
  
  // When using mock data, set totalPages to 1
  const totalPages = i18n.language === 'en' ? 1 : (meta?.last_page ?? 1);
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900">{t("lists.restaurantsTitle")}</h1>
        <p className="mt-3 text-lg text-gray-600">{t("lists.restaurantsSubtitle")}</p>
        <input
          type="search"
          placeholder={t("lists.restaurantsSearchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 w-full max-w-md rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-600)]"
        />
      </header>

      {i18n.language !== 'en' && loading && <LoadingState />}
      {i18n.language !== 'en' && error && <ErrorState message={error.message} onRetry={reload} />}

      {(!loading || i18n.language === 'en') && !error && (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((restaurant) => (
              <ListingCard
                key={restaurant.id}
                item={{
                  ...restaurant,
                  description: restaurant.description || restaurant.cuisine || restaurant.cuisine_type,
                }}
                to={`/restaurants/${restaurant.id}`}
                type="other"
                priceKey="price_range"
                modelType={MODEL_TYPES.restaurant}
              />
            ))}
            {restaurants.length === 0 && (
              <p className="col-span-full py-12 text-center text-gray-500">{t("lists.noRestaurantsFound")}</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:flex-row">
              <p className="text-sm text-gray-600">{t("common.page")} {currentPage} {t("common.of")} {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(v => Math.max(1, v - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium disabled:opacity-40"
                >
                  {t("common.prev")}
                </button>
                <button
                  type="button"
                  onClick={() => setPage(v => Math.min(totalPages, v + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full bg-[var(--color-primary-600)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  {t("common.next")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
