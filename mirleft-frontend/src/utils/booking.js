/**
 * Partner booking URL for a property (uses scraped/API booking_link when present).
 */
export function getPartnerBookingUrl(property) {
  if (!property) return null;

  const direct =
    property.booking_link ||
    property.partner_booking_url ||
    property.booking_url;

  if (direct && typeof direct === 'string' && direct.startsWith('http')) {
    return direct;
  }

  const name = property.name?.trim();
  if (!name) return 'https://www.booking.com/searchresults.html?ss=Mirleft';

  const params = new URLSearchParams({
    ss: name,
    lang: 'en-gb',
  });

  if (property.location) {
    params.set('ss', `${name} ${property.location}`);
  }

  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}
