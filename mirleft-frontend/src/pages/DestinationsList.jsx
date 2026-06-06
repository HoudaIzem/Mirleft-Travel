import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { destinationService } from "../services/services";

export default function DestinationsList() {
  const [data, setData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    region: "",
    type: "",
    sort_by: "popular",
    page: 1,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await destinationService.getAll(filters);
        setData(response.data);
      } catch (error) {
        console.error("Failed to load destinations", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  const destinations = useMemo(() => data.data || [], [data]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900">Destinations</h1>
      <p className="mt-2 text-gray-600">Explore Mirleft and nearby travel areas with guides, hotels, restaurants, and attractions.</p>

      <div className="sticky top-16 z-10 mt-6 grid gap-3 rounded-xl border bg-white p-3 shadow-sm md:grid-cols-4">
        <input
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
          placeholder="Search destinations"
          className="rounded-lg border px-3 py-2"
        />
        <input
          value={filters.region}
          onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value, page: 1 }))}
          placeholder="Region"
          className="rounded-lg border px-3 py-2"
        />
        <input
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value, page: 1 }))}
          placeholder="Type"
          className="rounded-lg border px-3 py-2"
        />
        <select
          value={filters.sort_by}
          onChange={(e) => setFilters((prev) => ({ ...prev, sort_by: e.target.value, page: 1 }))}
          className="rounded-lg border px-3 py-2"
        >
          <option value="popular">Most popular</option>
          <option value="rating">Highest rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : destinations.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-gray-50 p-10 text-center text-gray-600">No destinations found.</div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Link key={destination.id} to={`/destinations/${destination.slug}`} className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <img src={destination.cover_image || "https://via.placeholder.com/600x300"} alt={destination.name} className="h-52 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <h2 className="text-2xl font-bold text-gray-900">{destination.name}</h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{destination.short_intro || destination.overview}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{destination.region || "Mirleft Region"}</span>
                  <span>{destination.average_rating || 0} ★</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <button onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))} disabled={filters.page === 1} className="rounded border px-4 py-2 disabled:opacity-40">
          Previous
        </button>
        <span>Page {filters.page}</span>
        <button onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))} className="rounded border px-4 py-2">
          Next
        </button>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="animate-pulse rounded-2xl border bg-white p-4">
          <div className="h-40 rounded bg-gray-200" />
          <div className="mt-4 h-5 rounded bg-gray-200" />
          <div className="mt-3 h-4 rounded bg-gray-100" />
          <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
