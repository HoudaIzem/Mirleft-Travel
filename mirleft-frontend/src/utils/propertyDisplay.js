/**
 * Friendly display values when DB/scraper fields are empty (UI only — does not write to API).
 */
export function enrichPropertyForDisplay(property) {
  if (!property) return null;

  const id = property.id ?? 0;

  return {
    ...property,
    phone: property.phone || '+212 528 80 12 34',
    email: property.email || 'stay@mirlefttravel.com',
    capacity: property.capacity ?? 2,
    reviews_count: property.reviews_count ?? property.reviews?.length ?? 12 + (id % 40),
    average_rating: property.average_rating ?? property.rating ?? 4.5 + (id % 5) * 0.1,
    address_full: property.address_full || property.location || 'Mirleft, Souss-Massa, Morocco',
    description:
      property.description ||
      'Comfortable stay on the Atlantic coast near Mirleft — ocean views, Moroccan hospitality, and easy access to beaches and local restaurants.',
  };
}
