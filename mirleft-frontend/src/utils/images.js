import { resolveImage } from './imageMap';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1559586616-361e18714958?auto=format&fit=crop&q=80&w=1200';

/** Resolve API image URL, local asset key, or fallback */
export function getImageUrl(item, fallback = PLACEHOLDER) {
  let candidate =
    item?.image ||
    item?.images?.[0] ||
    item?.cover_image ||
    item?.og_image ||
    item?.photos?.[0]?.url ||
    item?.url;

  if (!candidate) return fallback;

  // If it's already a string (imported asset or direct URL), return it
  if (typeof candidate === 'string' && (candidate.startsWith('http') || candidate.startsWith('/') || candidate.startsWith('data:'))) {
    // Make Booking.com images wider
    if (candidate.includes('bstatic.com')) {
      candidate = candidate.replace(/square600|max1024x768/, 'max1920x1080');
    }
    // If it starts with /storage, add API base
    if (candidate.startsWith('/storage')) {
      const base = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');
      return `${base}${candidate}`;
    }
    return candidate;
  }
  
  // Otherwise try to resolve using image map
  return resolveImage(candidate, fallback);
}

/** Resolve a photo row or string from API / scraper */
export function resolvePhotoUrl(photo, fallback = PLACEHOLDER) {
  if (!photo) return fallback;
  if (typeof photo === 'string') return getImageUrl({ image: photo }, fallback);
  return getImageUrl(photo, fallback);
}

/** Build ordered gallery URLs for property detail */
export function buildPropertyGallery(property) {
  if (!property) return [PLACEHOLDER];

  const urls = [];

  if (property.photos?.length) {
    property.photos.forEach((p) => {
      const u = resolvePhotoUrl(p);
      if (u && !urls.includes(u)) urls.push(u);
    });
  }

  if (property.images?.length) {
    property.images.forEach((img) => {
      const u = getImageUrl({ image: img });
      if (u && !urls.includes(u)) urls.push(u);
    });
  }

  const cover = getImageUrl(property);
  if (cover && !urls.includes(cover)) urls.unshift(cover);

  return urls.length ? urls : [PLACEHOLDER];
}
