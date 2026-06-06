import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, LockKeyhole } from 'lucide-react';
import { bookingService, propertyService } from '../services/services';
import { useAuth } from '../hooks/useAuth';
import DateRangeField from '../components/DateRangeField';
import { formatPriceDH, parsePriceNumber } from '../utils/format';
import { getImageUrl } from '../utils/images';
import { LoadingState, ErrorState } from '../components/PageState';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const propertyId = searchParams.get('property_id');

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [dates, setDates] = useState({
    checkIn: searchParams.get('check_in') || '',
    checkOut: searchParams.get('check_out') || '',
  });

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    guests: 2,
    special_requests: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/checkout?property_id=${propertyId}`);
      return;
    }
    if (!propertyId) {
      setLoading(false);
      return;
    }
    propertyService
      .getById(propertyId)
      .then((res) => {
        const p = res.data?.data ?? res.data;
        setProperty(p);
        setForm((f) => ({
          ...f,
          first_name: user?.name?.split(' ')[0] || '',
          last_name: user?.name?.split(' ').slice(1).join(' ') || '',
          email: user?.email || '',
        }));
      })
      .catch(() => setStatus({ type: 'error', message: 'Could not load property.' }))
      .finally(() => setLoading(false));
  }, [propertyId, isAuthenticated, user, navigate]);

  const nights =
    dates.checkIn && dates.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

  const nightly = parsePriceNumber(property?.price);
  const total = nightly * nights;

  async function submit(e) {
    e.preventDefault();
    if (!dates.checkIn || !dates.checkOut) {
      setStatus({ type: 'error', message: 'Please select check-in and check-out dates.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Creating your booking...' });

    try {
      const { data } = await bookingService.create({
        property_id: Number(propertyId),
        ...form,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        total_price: total,
      });

      setStatus({ type: 'success', message: data.message || 'Booking created successfully!' });

      if (property?.booking_link) {
        setTimeout(() => window.open(property.booking_link, '_blank'), 1500);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || err.message });
    }
  }

  if (loading) return <LoadingState message="Loading checkout..." />;
  if (!propertyId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-gray-600">Select a property to book.</p>
        <Link to="/hotels" className="mt-4 inline-block text-[var(--color-primary-600)] font-semibold">
          Browse hotels
        </Link>
      </div>
    );
  }
  if (!property) return <ErrorState message="Property not found." />;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.5fr_1fr] sm:px-6">
        <section>
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-5 ring-1 ring-gray-100">
            <LockKeyhole className="h-6 w-6 text-[var(--color-primary-600)]" />
            <div>
              <p className="font-bold text-gray-900">Secure booking</p>
              <p className="text-sm text-gray-600">Dates and guest details are validated with the API.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6 rounded-2xl bg-white p-8 ring-1 ring-gray-100">
            <h2 className="text-xl font-bold">Your stay</h2>
            <DateRangeField
              checkIn={dates.checkIn}
              checkOut={dates.checkOut}
              onCheckInChange={(v) => setDates({ ...dates, checkIn: v })}
              onCheckOutChange={(v) => setDates({ ...dates, checkOut: v })}
            />

            <label className="block text-sm font-medium">
              Guests
              <input
                type="number"
                min={1}
                max={property.capacity || 20}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                First name
                <input
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium">
                Last name
                <input
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
            </div>

            <label className="block text-sm font-medium">
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>

            <label className="block text-sm font-medium">
              Special requests
              <textarea
                value={form.special_requests}
                onChange={(e) => setForm({ ...form, special_requests: e.target.value })}
                className="mt-1 min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary-600)] py-4 font-bold text-white hover:bg-[var(--color-primary-700)]"
            >
              <ShieldCheck className="h-5 w-5" />
              Confirm booking
            </button>

            {status.message && (
              <p
                className={`rounded-xl px-4 py-3 text-center text-sm font-medium ${
                  status.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : status.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-700'
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        </section>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
            <img src={getImageUrl(property)} alt={property.name} className="h-48 w-full object-cover" />
            <div className="p-6">
              <h1 className="text-2xl font-bold">{property.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{property.location}</p>
              <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{formatPriceDH(nightly)} × {nights} nights</span>
                  <span className="font-bold">{formatPriceDH(total)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[var(--color-primary-700)]">
                  <span>Total</span>
                  <span>{formatPriceDH(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
