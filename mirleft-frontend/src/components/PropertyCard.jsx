import { DollarSign, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PropertyCard({ property }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf7f4] shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-52 bg-stone-200">
        <img src={property.image} alt={property.name} className="h-full w-full object-cover" />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-stone-700">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {property.rating || '4.5'}
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold text-stone-900">{property.name}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{property.description}</p>
        <p className="mt-4 flex items-center gap-2 text-sm text-stone-500">
          <MapPin className="h-4 w-4 text-sky-700" />
          {property.location}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4">
          <div className="flex items-center gap-1 text-xl font-bold text-stone-900">
            <DollarSign className="h-5 w-5 text-emerald-700" />
            {property.price || 'Check Site'}
          </div>

          <Link
            to={`/hotels/${property.id}`}
            className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}
