import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, MapPin, Star, ArrowLeft, UtensilsCrossed } from "lucide-react";
import { useTranslation } from "react-i18next";
import { restaurantService, reviewService } from "../services/services";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import { getImageUrl } from "../utils/images";
import FavoriteButton from "../components/FavoriteButton";
import { MODEL_TYPES } from "../utils/apiHelpers";
import { restaurantListings, restaurantDetails } from "../data/mockContent";

export default function RestaurantDetails() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, checkFavorite } = useFavorites();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (i18n.language === 'en') {
          // Use mock data for English
          const mockRestaurant = restaurantListings.find(r => r.id === id);
          if (mockRestaurant) {
            setRestaurant(mockRestaurant);
            // Check if we have mock restaurant details
            const details = restaurantDetails[id];
            if (details) {
              setReviews(details.reviewsList || []);
            }
          } else {
            setRestaurant(null);
          }
          setLoading(false);
        } else {
          // Use API for other languages
          const response = await restaurantService.getById(id);
          setRestaurant(response.data?.data ?? response.data);
          await checkFavorite(id, "App\\Models\\Restaurant");
          await loadReviews();
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load restaurant:", error);
        setLoading(false);
      }
    };
    load();
  }, [id, i18n.language]);

  const loadReviews = async () => {
    const response = await reviewService.getByItem({
      reviewable_type: "App\\Models\\Restaurant",
      reviewable_id: id,
    });
    setReviews(response.data.data || []);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#F2C94C] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-[#5E4A3A]">Loading...</p>
      </div>
    </div>
  );
  if (!restaurant) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#5E4A3A] text-xl">Not found</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FDF8F2] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={getImageUrl({ image: restaurant.image })}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Link
            to="/restaurants"
            className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ArrowLeft size={18} className="text-[#5E4A3A]" />
            <span className="font-medium text-[#5E4A3A]">Back</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 text-[#F2C94C]">
                <Star size={20} className="fill-current" />
                <span className="font-semibold text-white">{restaurant.average_rating || "4.8"}</span>
              </div>
              <span className="text-white/80">•</span>
              <span className="text-white/80">{restaurant.reviews_count || "0"} reviews</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-['Cormorant_Garamond']">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-[#F2C94C]" />
              <span className="text-white/90">{restaurant.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {/* Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FDF0E6] rounded-full flex items-center justify-center">
                <UtensilsCrossed size={24} className="text-[#B38B5F]" />
              </div>
              <div>
                <p className="text-sm text-[#8B7355]">Cuisine</p>
                <p className="font-semibold text-[#5E4A3A]">{restaurant.cuisine || "Moroccan"}</p>
              </div>
            </div>
            {restaurant.price_range && (
              <div className="flex items-center gap-3">
                <p className="text-sm text-[#8B7355]">Price Range</p>
                <span className="bg-[#FDF0E6] text-[#B38B5F] px-4 py-1 rounded-full font-medium">
                  {restaurant.price_range}
                </span>
              </div>
            )}
            <button
              onClick={() => toggleFavorite(id, "App\\Models\\Restaurant")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 transition-all ${
                isFavorite
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-[#B38B5F] text-[#B38B5F] hover:bg-[#FDF0E6]"
              }`}
            >
              <Heart size={20} className={isFavorite ? "fill-current" : ""} />
              <span>{isFavorite ? "Saved" : "Save"}</span>
            </button>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-[#5E4A3A] mb-4 font-['Cormorant_Garamond']">
              About
            </h2>
            <p className="text-[#5E4A3A]/80 leading-relaxed text-lg">
              {restaurant.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="pt-8 border-t border-[#E8D5C4]">
            <h2 className="text-2xl font-semibold text-[#5E4A3A] mb-6 font-['Cormorant_Garamond']">
              Reviews
            </h2>
            {isAuthenticated && (
              <div className="mb-8">
                <ReviewForm 
                  itemId={id} 
                  itemType="App\\Models\\Restaurant" 
                  onReviewSubmitted={loadReviews} 
                />
              </div>
            )}
            <div className="space-y-4">
              {reviews.length ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-12 bg-[#FDF8F2] rounded-xl">
                  <p className="text-[#8B7355]">No reviews yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
