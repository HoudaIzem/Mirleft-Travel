import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Star,
  MapPin,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import ReviewForm from "../components/ReviewForm";
import ReviewCard from "../components/ReviewCard";
import { propertyService, reviewService } from "../services/services";
import { useAuth } from "../hooks/useAuth";
import FavoriteButton from "../components/FavoriteButton";
import MirleftMap from "../components/MirleftMap";
import { formatPriceDH } from "../utils/format";
import { buildPropertyGallery } from "../utils/images";
import { getPartnerBookingUrl } from "../utils/booking";
import { enrichPropertyForDisplay } from "../utils/propertyDisplay";
import { MODEL_TYPES } from "../utils/apiHelpers";
import { LoadingState } from "../components/PageState";
import { fakeProperties } from "../data/fakeData";

export default function PropertyDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [rawProperty, setRawProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();

  const property = useMemo(
    () => (rawProperty ? enrichPropertyForDisplay(rawProperty) : null),
    [rawProperty]
  );

  const gallery = useMemo(
    () => (property ? buildPropertyGallery(property) : []),
    [property]
  );

  const bookingUrl = useMemo(
    () => (property ? getPartnerBookingUrl(property) : null),
    [property]
  );

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getById(id);
      const data = response.data?.data ?? response.data;
      setRawProperty(data);
      await fetchReviews();
    } catch (error) {
      console.error("Failed to fetch property, using fake data:", error);
      const fakeProp = fakeProperties.find(
        (p) => p.id === Number(id) || String(p.id) === id
      );
      if (fakeProp) setRawProperty(fakeProp);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getByItem({
        reviewable_type: "App\\Models\\Property",
        reviewable_id: id,
      });
      setReviews(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  if (loading) {
    return <LoadingState message={t("property.loadingProperty")} />;
  }

  if (!property) {
    return <div className="py-20 text-center">{t("property.propertyNotFound")}</div>;
  }

  const rating = property.average_rating || property.rating;
  const hasRating = rating != null && rating !== "";

  let amenities = property.amenities;
  if (
    amenities &&
    Array.isArray(amenities) &&
    typeof amenities[0] === "string"
  ) {
    amenities = amenities.map((name, i) => ({ id: i, name }));
  } else if (!amenities?.length && property.amenities_description) {
    amenities = property.amenities_description
      .split(/[,;]/)
      .map((name, i) => ({ id: i, name: name.trim() }))
      .filter((a) => a.name);
  }

  const goPrev = () =>
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  const goNext = () =>
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Gallery — fixed height, no overflow */}
      <section className="bg-[#1a1208]">
        <div className="mx-auto max-w-6xl px-3 pt-4 sm:px-4 lg:px-6">
          <div className="relative h-[220px] overflow-hidden rounded-xl sm:h-[280px] md:h-[340px] lg:h-[380px]">
            <img
              src={gallery[currentImageIndex]}
              alt={property.name}
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
              <FavoriteButton id={property.id} type={MODEL_TYPES.property} />
            </div>
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow transition hover:bg-white sm:left-4"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow transition hover:bg-white sm:right-4"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
                <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {currentImageIndex + 1} / {gallery.length}
                </span>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {gallery.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition sm:h-16 sm:w-24 ${
                    index === currentImageIndex
                      ? "ring-[var(--color-primary-600)]"
                      : "ring-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="mb-2 inline-block rounded-full bg-[var(--color-primary-100)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
                    {property.type || t("filters.hotel")}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                    {property.name}
                  </h1>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-gray-100 p-3 transition hover:bg-gray-200"
                  aria-label={t("common.share")}
                >
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <MapPin size={18} className="shrink-0" />
                <span className="text-sm sm:text-base">{property.address_full}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(Number(rating) || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900">
                  {hasRating ? Number(rating).toFixed(1) : t("property.noRatingYet")}
                </span>
                <span className="text-sm text-gray-500">
                  ({property.reviews_count} {t("property.guestReviews")})
                </span>
              </div>
            </div>

            <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <h2 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl">
                {t("property.about")}
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                {property.description}
              </p>
            </div>

            {amenities && amenities.length > 0 && (
              <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
                  {t("property.amenities")}
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                        ✓
                      </span>
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.latitude && property.longitude && (
              <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
                  {t("property.location")}
                </h2>
                <MirleftMap markers={[property]} height="260px" zoom={13} />
              </div>
            )}

            {reviews.length > 0 && (
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
                <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
                  {t("property.guestReviews")}
                </h2>
                {isAuthenticated && (
                  <ReviewForm
                    itemId={id}
                    itemType="App\\Models\\Property"
                    onReviewSubmitted={fetchReviews}
                  />
                )}
                <div className="mt-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}
            {reviews.length === 0 && isAuthenticated && (
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
                <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
                  {t("property.guestReviews")}
                </h2>
                <ReviewForm
                  itemId={id}
                  itemType="App\\Models\\Property"
                  onReviewSubmitted={fetchReviews}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <div className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {formatPriceDH(property.price, { perNight: true, currency: t('common.currency'), perNightText: t('common.perNight') })}
              </div>

              {bookingUrl && (
                <>
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-600)] py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-primary-700)] sm:text-base"
                  >
                    {t("property.bookNow")}
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                  <p className="mb-5 text-center text-xs leading-relaxed text-gray-500">
                    {t("property.bookingNote")}
                  </p>
                </>
              )}

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("property.contactNote")}
              </p>
              <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
                <div>
                  <p className="text-gray-500">{t("property.phone")}</p>
                  <p className="font-semibold text-gray-900">{property.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t("property.email")}</p>
                  <p className="font-semibold text-gray-900 break-all">{property.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t("property.capacity")}</p>
                  <p className="font-semibold text-gray-900">
                    {property.capacity} {t("property.guests")}
                  </p>
                </div>
              </div>

              <Link
                to="/hotels"
                className="mt-5 block text-center text-sm font-medium text-[var(--color-primary-600)] hover:underline"
              >
                ← {t("lists.hotelsTitle")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
