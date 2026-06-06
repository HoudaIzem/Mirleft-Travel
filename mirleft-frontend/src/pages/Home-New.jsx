import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import {
  propertyService,
  restaurantService,
  activityService,
} from "../services/services";
import {
  Heart,
  MapPin,
  Star,
  Waves,
  Utensils,
  Compass,
  Users,
  Award,
} from "lucide-react";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propsRes, restRes, actRes] = await Promise.all([
        propertyService.getAll({ per_page: 6 }),
        restaurantService.getAll({ per_page: 6 }),
        activityService.getAll({ per_page: 6 }),
      ]);
      setFeatured(propsRes.data.data);
      setRestaurants(restRes.data.data);
      setActivities(actRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Mirleft</h1>
          <p className="text-xl text-gray-100 mb-8">
            Discover the best travel experiences on Morocco's Atlantic coast
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={() => {}} onFilter={() => {}} />

      {/* Stats Section */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard icon={Award} number="50+" label="Hotels & Riads" />
          <StatCard icon={Utensils} number="30+" label="Restaurants" />
          <StatCard icon={Compass} number="40+" label="Activities" />
          <StatCard icon={Users} number="10k+" label="Happy Travelers" />
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Featured Hotels & Accommodations
            </h2>
            <p className="text-gray-600 mt-2">
              Experience authentic Moroccan hospitality
            </p>
          </div>
          <Link
            to="/hotels"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Why Mirleft Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Mirleft?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Waves}
              title="Beautiful Beaches"
              description="Pristine Atlantic beaches perfect for swimming, surfing, and relaxation"
            />
            <FeatureCard
              icon={Utensils}
              title="Culinary Delights"
              description="Authentic Moroccan cuisine and fresh seafood from local fishermen"
            />
            <FeatureCard
              icon={MapPin}
              title="Rich Culture"
              description="Experience traditional Moroccan culture and hospitality"
            />
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Top Restaurants
            </h2>
            <p className="text-gray-600 mt-2">
              Savor the finest dining experiences
            </p>
          </div>
          <Link
            to="/restaurants"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Explore More →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.slice(0, 3).map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <div className="h-48 bg-gray-300 overflow-hidden">
                <img
                  src={
                    restaurant.image || "https://via.placeholder.com/300x200"
                  }
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {restaurant.cuisine_type}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-semibold">
                      {restaurant.average_rating || "N/A"}
                    </span>
                  </div>
                  <span className="text-blue-600 font-semibold">
                    {restaurant.price_range}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Activities Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Exciting Activities
              </h2>
              <p className="text-gray-600 mt-2">Adventure awaits in Mirleft</p>
            </div>
            <Link
              to="/activities"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              See All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.slice(0, 3).map((activity) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="h-48 bg-gray-300 overflow-hidden relative">
                  <img
                    src={
                      activity.image || "https://via.placeholder.com/300x200"
                    }
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${activity.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.category}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <Compass size={16} />
                    {activity.difficulty_level}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get travel tips, special offers, and updates about Mirleft
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, number, label }) {
  return (
    <div className="text-center">
      <Icon size={48} className="mx-auto text-blue-600 mb-4" />
      <div className="text-4xl font-bold text-gray-900">{number}</div>
      <div className="text-gray-600 mt-2">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <Icon size={36} className="text-blue-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
