import { CalendarDays, ChevronDown, CreditCard, Headphones, Search, ShieldCheck, UserRound } from 'lucide-react'
import { supportImage } from '../data/mockContent'
import { Link } from 'react-router-dom'

const topics = [
  ['Booking', 'Modify, cancel, or track your travel reservations easily.', CalendarDays, 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'],
  ['Payments', 'Billing history, refund requests, and payment methods.', CreditCard, 'bg-blue-100 text-blue-700'],
  ['Account', 'Manage your profile, security, and communication preferences.', UserRound, 'bg-orange-100 text-orange-700'],
  ['Local Guide', 'Discover Mirleft with curated insights and travel tips.', ShieldCheck, 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]'],
]

const faqs = [
  ['How do I cancel my hotel booking?', 'Open your bookings page, choose the reservation, and select cancel. Refund timing depends on the property policy.'],
  ['When will I receive my refund?', 'Most card refunds appear within 5 to 10 business days after the hotel confirms cancellation.'],
  ['Can I pay with multiple credit cards?', 'For now checkout accepts one card per booking. Split payment can be handled by contacting support.'],
  ['Are pet-friendly hotels clearly marked?', 'Yes. Pet-friendly stays are marked in the hotel amenities and listing badges.'],
]

export default function Support() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[var(--color-background)] px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">How can we help you?</h1>
        <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-full border border-gray-300 bg-white px-6 py-4 shadow-sm focus-within:border-[var(--color-primary-600)] focus-within:ring-1 focus-within:ring-[var(--color-primary-600)]">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            placeholder="Search for booking issues, payments, or local tips..."
            className="min-w-0 flex-1 bg-transparent text-base outline-none text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <p className="mt-6 text-sm text-gray-600">
          Popular: 
          <span className="ml-3 font-medium text-[var(--color-primary-600)] cursor-pointer hover:underline">Changing a reservation</span>
          <span className="ml-3 font-medium text-[var(--color-primary-600)] cursor-pointer hover:underline">Refund status</span>
          <span className="ml-3 font-medium text-[var(--color-primary-600)] cursor-pointer hover:underline">Local guide info</span>
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-2 xl:grid-cols-4">
        {topics.map(([title, text, Icon, colorClass]) => (
          <article key={title} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md cursor-pointer ring-1 ring-gray-100">
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${colorClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{text}</p>
          </article>
        ))}
      </section>

      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-gray-900">
                  {question}
                  <ChevronDown className="h-5 w-5 text-gray-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-6 rounded-3xl bg-[var(--color-primary-600)] p-10 text-white shadow-xl md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Still need help?</h3>
              <p className="mt-2 text-[var(--color-primary-100)] text-sm">Our team is available 24/7 to assist with your travel needs.</p>
            </div>
            <button className="rounded-full bg-white px-8 py-3 text-sm font-bold text-[var(--color-primary-700)] shadow-sm transition hover:bg-gray-50">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1fr_1fr] md:items-center">
        <div className="h-96 w-full overflow-hidden rounded-3xl shadow-lg ring-1 ring-gray-100">
          <img src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop" alt="Mirleft Community" className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Join our travel community</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            Stay updated with the latest Mirleft travel guides, community stories, and exclusive member discounts.
          </p>
          <div className="mt-8 flex max-w-lg overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-[var(--color-primary-600)] focus-within:ring-1 focus-within:ring-[var(--color-primary-600)]">
            <input placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent px-5 py-4 outline-none text-gray-900" />
            <button className="bg-[var(--color-primary-600)] px-8 py-4 font-bold text-white transition hover:bg-[var(--color-primary-700)]">Subscribe</button>
          </div>
        </div>
      </section>

      <Link
        to="/assistant"
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-600)] text-white shadow-xl transition hover:scale-105 hover:bg-[var(--color-primary-700)]"
        aria-label="Open Mirleft Guide AI"
      >
        <Headphones className="h-7 w-7" />
      </Link>
    </div>
  )
}
