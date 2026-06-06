import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { homeService } from "../services/services";
import ListingCard from "../components/ListingCard";
import { LoadingState, ErrorState } from "../components/PageState";
import { MODEL_TYPES } from "../utils/apiHelpers";

export default function SearchResults() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState({
    destinations: [],
    properties: [],
    restaurants: [],
    activities: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) return;
    const key = "recent_searches";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const next = [q, ...existing.filter((item) => item !== q)].slice(0, 8);
    localStorage.setItem(key, JSON.stringify(next));
  }, [q]);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await homeService.search({ q });
        setResults(response.data);
      } catch (err) {
        console.error("Search failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [q]);

  if (!q) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        Enter a search term.
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ErrorState message="Search failed" onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const allResults = [
    ...results.properties,
    ...results.restaurants,
    ...results.activities,
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">
        {t("search.resultsFor")} "{q}"
      </h1>
      <p className="mt-2 text-gray-600">
        {results.total} {t("search.resultsFound")}
      </p>

      {loading ? (
        <LoadingState />
      ) : allResults.length === 0 ? (
        <div className="mt-10 text-center py-20">
          <p className="text-xl text-gray-600">{t("search.noResults")}</p>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          <SearchSection
            title={t("navbar.hotels")}
            items={results.properties}
            routePrefix="/hotels"
            type="property"
            modelType={MODEL_TYPES.property}
          />
          <SearchSection
            title={t("navbar.restaurants")}
            items={results.restaurants}
            routePrefix="/restaurants"
            type="other"
            modelType={MODEL_TYPES.restaurant}
          />
          <SearchSection
            title={t("navbar.thingsToDo")}
            items={results.activities}
            routePrefix="/activities"
            type="other"
            titleKey="title"
            modelType={MODEL_TYPES.activity}
          />
        </div>
      )}
    </div>
  );
}

function SearchSection({
  title,
  items,
  routePrefix,
  type = "property",
  titleKey = "name",
  modelType,
}) {
  if (!items?.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ListingCard
            key={item.id}
            item={item}
            to={`${routePrefix}/${item.id}`}
            type={type}
            titleKey={titleKey}
            modelType={modelType}
          />
        ))}
      </div>
    </section>
  );
}
