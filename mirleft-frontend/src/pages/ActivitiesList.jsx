import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivities } from '../hooks/useApi';
import ListingCard from '../components/ListingCard';
import { LoadingState, ErrorState } from '../components/PageState';
import { MODEL_TYPES } from '../utils/apiHelpers';
import { activityListings } from '../data/mockContent';

const ITEMS_PER_PAGE = 6;

export default function ActivitiesList() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { data: apiActivities, meta, loading, error, reload } = useActivities({
    per_page: ITEMS_PER_PAGE,
    page,
    category: category || undefined,
  });

  // If in English, use mock data instead of API data
  const activities = i18n.language === 'en' ? activityListings : apiActivities;
  
  // When using mock data, set totalPages to 1
  const totalPages = i18n.language === 'en' ? 1 : (meta?.last_page ?? 1);
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">{t("lists.activitiesTitle")}</h1>
          <p className="mt-3 text-lg text-gray-600">{t("lists.activitiesSubtitle")}</p>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="mt-6 rounded-xl border border-gray-200 px-4 py-2 text-sm"
          >
            <option value="">{t("filters.allCategories")}</option>
            <option value="surf">{t("filters.surf")}</option>
            <option value="hiking">{t("filters.hiking")}</option>
            <option value="culture">{t("filters.culture")}</option>
            <option value="food">{t("filters.food")}</option>
          </select>
        </header>

        {i18n.language !== 'en' && loading && <LoadingState message={t("lists.loadingActivities")} />}
        {i18n.language !== 'en' && error && !activities.length && <ErrorState message={error.message} onRetry={reload} />}

        {(!loading || i18n.language === 'en') && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <ListingCard
                  key={activity.id}
                  item={{ ...activity, name: activity.title }}
                  to={`/activities/${activity.id}`}
                  titleKey="title"
                  priceKey="price"
                  type="other"
                  modelType={MODEL_TYPES.activity}
                />
              ))}
              {activities.length === 0 && (
                <p className="col-span-full py-12 text-center text-gray-500">{t("lists.noActivitiesFound")}</p>
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
    </div>
  );
}
