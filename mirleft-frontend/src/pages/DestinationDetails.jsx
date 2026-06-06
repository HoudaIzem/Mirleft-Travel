import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { destinationService } from "../services/services";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";

export default function DestinationDetails() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, checkFavorite } = useFavorites();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await destinationService.getBySlug(slug);
        setPayload(response.data);
        await checkFavorite(response.data.destination.id, "App\\Models\\Destination");
        if (response.data?.seo?.title) document.title = response.data.seo.title;
      } catch (error) {
        console.error("Failed to load destination", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const destination = payload?.destination;
  const ratingDistribution = useMemo(() => payload?.rating_distribution || {}, [payload]);

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-14">Loading destination guide...</div>;
  if (!destination) return <div className="mx-auto max-w-6xl px-4 py-14">Destination not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl">
        <img src={destination.cover_image || "https://via.placeholder.com/1400x500"} alt={destination.name} className="h-[400px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-8 text-white">
          <h1 className="text-5xl font-bold">{destination.name}</h1>
          <p className="mt-3 max-w-2xl text-white/90">{destination.short_intro || destination.overview}</p>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <GuideSection title="Overview" content={destination.overview} />
          <GuideSection title="Best time to visit" content={destination.best_time_to_visit} />
          <GuideSection title="Weather" content={destination.weather} />
          <GuideSection title="Transportation" content={destination.transportation} />
          <GuideSection title="Budget tips" content={destination.budget_tips} />

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-2xl font-bold">Places to Visit</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <PlacePill title="Beaches" />
              <PlacePill title="Surf spots" />
              <PlacePill title="Hiking areas" />
              <PlacePill title="Viewpoints" />
            </div>
          </section>

          <RelatedSection title="Nearby Hotels" items={destination.properties} basePath="/hotels" labelKey="name" />
          <RelatedSection title="Nearby Restaurants" items={destination.restaurants} basePath="/restaurants" labelKey="name" />
          <RelatedSection title="Nearby Activities" items={destination.activities} basePath="/activities" labelKey="title" />

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-2xl font-bold">Photo Gallery</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {(destination.photos || []).map((photo) => (
                <img key={photo.id} src={photo.url} alt={photo.alt_text || destination.name} className="h-40 w-full rounded-xl object-cover" loading="lazy" />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {isAuthenticated && (
              <div className="mt-4">
                <ReviewForm itemId={destination.id} itemType="App\\Models\\Destination" />
              </div>
            )}
            <div className="mt-5 space-y-3">
              {(destination.reviews || []).length ? (
                destination.reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="text-xl font-semibold">Rating Statistics</h3>
            <p className="mt-2 text-gray-700">Average: {destination.average_rating || 0} / 5</p>
            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center justify-between text-sm">
                  <span>{star} stars</span>
                  <span>{ratingDistribution[star] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <button onClick={() => toggleFavorite(destination.id, "App\\Models\\Destination")} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">
              {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
            </button>
            <p className="mt-3 text-xs text-gray-500">Map preview coming from coordinates integration.</p>
            <div className="mt-3 h-40 rounded-xl bg-gradient-to-br from-blue-100 to-teal-100" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function GuideSection({ title, content }) {
  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-3 leading-7 text-gray-700">{content || "Information will be updated soon."}</p>
    </section>
  );
}

function PlacePill({ title }) {
  return <div className="rounded-lg border bg-gray-50 px-4 py-3 font-medium">{title}</div>;
}

function RelatedSection({ title, items, basePath, labelKey }) {
  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {(items || []).map((item) => (
          <Link key={item.id} to={`${basePath}/${item.id}`} className="rounded-lg border bg-gray-50 p-3 hover:bg-gray-100">
            <p className="font-semibold">{item[labelKey]}</p>
            <p className="text-sm text-gray-600">{item.location}</p>
          </Link>
        ))}
        {!(items || []).length && <p className="text-gray-500">No nearby items yet.</p>}
      </div>
    </section>
  );
}
