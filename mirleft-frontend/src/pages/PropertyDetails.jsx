import { CalendarDays, CircleCheck, Globe, Leaf, MapPin, ShieldCheck, Users, Heart, Share, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { hotelListings } from '../data/mockContent'
import { useProperty, postJson } from '../hooks/useApi'
import { resolveImage } from '../utils/imageMap'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function PropertyDetails() {
  const { id } = useParams()
  const isNumericId = /^\d+$/.test(id ?? '')
  const { data: propertyFromApi, loading, refetch } = useProperty(isNumericId ? id : null)
  const fallback = isNumericId ? null : hotelListings.find((item) => item.id === id) ?? hotelListings[0]
  const property = propertyFromApi
    ? {
        ...(fallback ?? {}),
        ...propertyFromApi,
        gallery: fallback?.gallery ?? [propertyFromApi.image, 'legzira-arch', 'mirleft-2', 'sunset-mirleft', 'wonders-mirleft'],
        amenities: fallback?.amenities,
        guestReviews: propertyFromApi.reviews, // Use API reviews
        about: propertyFromApi.description || fallback?.about || 'No description available for this property yet.',
      }
    : fallback

  const { user, token } = useAuth()
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', text: '' })
  const [reviewStatus, setReviewStatus] = useState('')

  async function submitReview(event) {
    event.preventDefault()
    setReviewStatus('Submitting review...')
    try {
      const payload = {
        reviewable_type: 'App\\Models\\Property',
        reviewable_id: property.id,
        ...reviewForm,
      }
      await postJson('/reviews', payload, token)
      setReviewStatus('Review added successfully!')
      setReviewForm({ rating: 5, title: '', text: '' })
      refetch()
    } catch (error) {
      setReviewStatus(error.message)
    }
  }

  if (loading && isNumericId) return <div className="p-20 text-center text-gray-500">Loading...</div>
  if (!property) return <div className="p-20 text-center text-gray-500">Not found</div>

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[var(--color-primary-600)]">Home</Link>
          <span>&gt;</span>
          <Link to="/hotels" className="hover:text-[var(--color-primary-600)]">Hotels</Link>
          <span>&gt;</span>
          <span className="text-gray-900">{property.name}</span>
        </div>

        {/* Header */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{property.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-[var(--color-primary-600)] font-bold">
                <Star className="h-4 w-4 fill-current" />
                <span>4.8</span>
                <span className="text-gray-500 font-normal">({property.guestReviews?.length ?? 124} reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Marabout Heights, Mirleft</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
              <Share className="h-4 w-4" /> Share
            </button>
            <button className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
              <Heart className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        {/* Gallery */}
        <section className="mt-8 grid gap-3 lg:grid-cols-2">
          <div className="h-[400px] w-full overflow-hidden rounded-l-2xl">
            <img src={resolveImage(property.gallery?.[0] || property.image)} alt={property.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[400px]">
            {(property.gallery?.slice(1, 5) || [property.image, property.image, property.image, property.image]).map((image, index) => (
              <div key={image + index} className="relative h-full w-full overflow-hidden">
                <img src={resolveImage(image)} alt="" className={`h-full w-full object-cover transition-transform duration-700 hover:scale-105 ${index === 1 ? 'rounded-tr-2xl' : ''} ${index === 3 ? 'rounded-br-2xl' : ''}`} />
                {index === 3 && (
                  <button className="absolute bottom-4 right-4 rounded-lg bg-white/95 px-4 py-2 text-sm font-bold text-gray-900 shadow hover:bg-white">
                    View all photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
          
          {/* Left Column */}
          <div className="space-y-12">
            
            {/* About */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">About this property</h2>
              <p className="text-lg leading-relaxed text-gray-600">{property.about}</p>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-6 text-xl font-bold text-gray-900">Top Amenities</h3>
              <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                {[
                  [CircleCheck, property.amenities?.[0] ?? 'Free High-Speed Wifi'],
                  [CircleCheck, property.amenities?.[1] ?? 'Infinity Pool'],
                  [Leaf, property.amenities?.[2] ?? 'Organic Restaurant'],
                  [ShieldCheck, property.amenities?.[3] ?? 'Full-service Spa'],
                  [Users, property.amenities?.[4] ?? 'Valet Parking'],
                  [MapPin, property.amenities?.[5] ?? 'Private Beach'],
                ].map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-3 text-gray-700">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Location</h3>
              <div className="h-80 w-full overflow-hidden rounded-2xl bg-gray-200">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" alt="Map" className="h-full w-full object-cover opacity-75 grayscale" />
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Guest Reviews</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Star className="h-5 w-5 text-[var(--color-primary-600)] fill-current" />
                    <span className="text-xl font-bold text-gray-900">4.8</span>
                    <span className="text-sm text-gray-500">({property.guestReviews?.length ?? 0} reviews)</span>
                  </div>
                </div>
                {user && (
                  <button onClick={() => document.getElementById('review_modal').showModal()} className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                    Write a review
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {property.guestReviews?.map((review) => (
                  <article key={review.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-lg font-bold text-[var(--color-primary-700)]">
                          {review.user_name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{review.user_name}</p>
                          <p className="text-xs text-gray-500">{review.created_at}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 flex gap-1 text-[var(--color-primary-600)]">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <h4 className="mb-2 font-bold text-gray-900">{review.title}</h4>
                    <p className="text-gray-600">{review.text}</p>
                  </article>
                ))}
              </div>

              {!property.guestReviews?.length && (
                <article className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm ring-1 ring-gray-100">
                  No detailed guest reviews available for this property yet.
                </article>
              )}
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <aside>
            <div className="sticky top-24 space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-gray-900">{property.price ?? '$210'}</span>
                      <span className="text-gray-500">/ night</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--color-primary-50)] px-3 py-1 text-xs font-bold text-[var(--color-primary-700)]">
                    Best Value
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-gray-200">
                    <div className="flex border-b border-gray-200">
                      <div className="flex-1 p-3">
                        <p className="text-xs font-bold uppercase text-gray-900">Check-In</p>
                        <p className="text-sm text-gray-600">Oct 24, 2024</p>
                      </div>
                      <div className="flex-1 border-l border-gray-200 p-3">
                        <p className="text-xs font-bold uppercase text-gray-900">Check-Out</p>
                        <p className="text-sm text-gray-600">Oct 28, 2024</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold uppercase text-gray-900">Guests</p>
                      <p className="text-sm text-gray-600">2 Adults, 0 Children</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between text-sm text-gray-600">
                  <span>$210 x 4 nights</span>
                  <span>$840</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>Taxes and fees</span>
                  <span>$42</span>
                </div>
                <div className="my-4 border-t border-gray-200"></div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>$882</span>
                </div>

                <Link to="/checkout" className="mt-6 flex w-full justify-center rounded-xl bg-[var(--color-primary-600)] px-5 py-4 font-bold text-white transition hover:bg-[var(--color-primary-700)]">
                  Reserve Now
                </Link>
                <p className="mt-4 text-center text-xs text-gray-500">You won't be charged yet</p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {/* Review Modal */}
      <dialog id="review_modal" className="modal">
        <div className="modal-box rounded-2xl">
          <h3 className="mb-6 text-xl font-bold text-gray-900">Write a Review</h3>
          <form onSubmit={submitReview}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-900">Rating</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-primary-600)]"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-900">Title (Optional)</label>
              <input
                type="text"
                placeholder="Summary of your experience"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-primary-600)]"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-900">Your Review</label>
              <textarea
                className="h-32 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-primary-600)]"
                placeholder="Share your detailed experience"
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
              ></textarea>
            </div>
            {reviewStatus && <p className="mb-4 text-center text-sm font-medium text-[var(--color-primary-600)]">{reviewStatus}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" className="rounded-xl px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100" onClick={() => document.getElementById('review_modal').close()}>Cancel</button>
              <button type="submit" className="rounded-xl bg-[var(--color-primary-600)] px-6 py-3 font-semibold text-white hover:bg-[var(--color-primary-700)]">Submit Review</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}
