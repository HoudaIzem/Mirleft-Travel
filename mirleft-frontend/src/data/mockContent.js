import legziraArch from '../assets/mirleft/legzira-arch.jpg'
import legziraBeach from '../assets/mirleft/legzira-beach.jpg'
import legziraBeauty from '../assets/mirleft/legzira-beauty.jpg'
import mirleft2 from '../assets/mirleft/mirleft-2.jpg'
import mirleft3 from '../assets/mirleft/mirleft-3.jpg'
import plageMirleft from '../assets/mirleft/plage-mirleft.jpg'
import sunsetMirleft from '../assets/mirleft/sunset-mirleft.jpg'
import wondersMirleft from '../assets/mirleft/wonders-mirleft.jpg'

export const homeHeroImage = wondersMirleft
export const authHeroImage = legziraBeauty
export const supportImage = mirleft2

export const homeCategories = [
  { label: 'Hotels', icon: 'hotel', href: '/hotels', accent: 'bg-emerald-100 text-emerald-700' },
  { label: 'Restaurants', icon: 'utensils-crossed', href: '/restaurants', accent: 'bg-sky-100 text-sky-700' },
  { label: 'Things to Do', icon: 'tickets', href: '/activities', accent: 'bg-amber-100 text-amber-700' },
  { label: 'Vacation Rentals', icon: 'house', href: '/hotels', accent: 'bg-stone-100 text-stone-600' },
]

export const homeHighlights = [
  {
    title: 'Legzira Beach',
    badge: 'Must Visit',
    description: 'Witness the world-famous natural red sandstone arches that span the pristine shoreline.',
    image: legziraArch,
  },
  {
    title: 'Old Town Kasbah',
    description: 'Explore the historic heart of the village.',
    image: mirleft2,
  },
  {
    title: 'Sidi Mohammed Ben Abdallah',
    description: 'The premier spot for surfing and sunset views.',
    image: sunsetMirleft,
  },
]

export const testimonials = [
  {
    name: 'Sarah J.',
    meta: 'London, UK - Oct 2023',
    text: "The arches at Legzira are even more impressive in person. Mirleft Travel's guide on where to eat nearby was spot on!",
    link: 'Review of Hotel Arches',
    avatar: 'SJ',
  },
  {
    name: 'Marcus K.',
    meta: 'Berlin, DE - Sep 2023',
    text: 'Great place for surfers. The waves at Sidi Mohammed were consistent and the locals very friendly.',
    link: 'Review of Ocean Surf Camp',
    avatar: 'MK',
  },
  {
    name: 'Elena M.',
    meta: 'Madrid, ES - Nov 2023',
    text: "The seafood tajine at the local port is a must. One of the most authentic Moroccan experiences I've had.",
    link: 'Review of Portside Grill',
    avatar: 'EM',
  },
]

export const hotelListings = [
  {
    id: 'aftas-beach-boutique-hotel',
    name: 'Aftas Beach Boutique Hotel',
    location: 'Overlooking Aftas Beach, Mirleft',
    price: '1150',
    oldPrice: '1400',
    reviews: 245,
    rating: 4.8,
    image: plageMirleft,
    perks: ['Free Wifi', 'Pool', 'Breakfast included'],
    tag: 'Best Value',
    description: 'Oceanfront boutique stay with warm Moroccan textures and panoramic terraces.',
    gallery: [plageMirleft, legziraArch, mirleft2, sunsetMirleft, wondersMirleft],
    about:
      'Perched on the rugged cliffs of Mirleft, Aftas Beach Boutique Hotel offers an unparalleled experience of Moroccan coastal charm. Combining traditional craftsmanship with contemporary minimalist design, each suite provides a sanctuary of calm with panoramic views of the Atlantic.',
    amenities: [
      'Free High-Speed Wifi',
      'Infinity Pool',
      'Organic Restaurant',
      'Full-service Spa',
      'Valet Parking',
      'Private Beach',
    ],
    guestReviews: [
      {
        name: 'Julianne Davies',
        meta: 'London, UK - 12 reviews',
        delay: '3 days ago',
        title: 'Breathtaking views and impeccable service',
        text: 'The location is simply unbeatable. Waking up to the sound of the ocean was magical. Highly recommend for couples looking for a quiet getaway.',
        avatar: 'JD',
      },
      {
        name: 'Mark K.',
        meta: 'Berlin, Germany - 4 reviews',
        delay: '1 week ago',
        title: 'A true hidden gem in Morocco',
        text: 'Clean, modern, and very well managed. The organic restaurant serves the best seafood tajine I have ever had.',
        avatar: 'MK',
      },
    ],
  },
  {
    id: 'the-cliffside-kasbah',
    name: 'The Cliffside Kasbah',
    location: 'Marabout Heights, Mirleft',
    price: '2100',
    reviews: 89,
    rating: 4.6,
    image: sunsetMirleft,
    perks: ['Exceptional 9.8', 'Spa services'],
    description: 'A serene retreat above the Atlantic with elegant suites and sunset lounges.',
  },
  {
    id: 'riad-de-la-mer',
    name: 'Riad de la Mer',
    location: 'Old Town, Mirleft',
    price: '650',
    reviews: 42,
    rating: 4.4,
    image: mirleft3,
    perks: ['Pet Friendly'],
    description: 'Traditional riad tucked inside the medina with a leafy courtyard and rooftop tea.',
  },
]

export const activityFilters = ['All Activities', 'Surfing', 'Trekking', 'Cultural Tours']

export const activityListings = [
  { id: 'private-surf-lesson', title: 'Private Surf Lesson at Legzira Beach', duration: '2-4 hours', price: '450', reviews: 128, badge: 'Top Rated', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80' },
  { id: 'sunset-coastal-trek', title: 'Sunset Coastal Trekking Experience', duration: '3 hours', price: '250', reviews: 52, image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80' },
  { id: 'berber-cooking-class', title: 'Authentic Berber Cooking Class & Lunch', duration: '5 hours', price: '350', reviews: 32, badge: 'New', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' },
  { id: 'sunrise-yoga', title: 'Seaside Morning Yoga & Meditation', duration: '1.5 hours', price: '200', reviews: 45, image: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&q=80' },
]

export const restaurantListings = [
  {
    id: 'la-brise-de-mer',
    name: 'La Brise de Mer',
    cuisine: 'Ocean View',
    location: 'Plage Sidi Mohammed Ben Abdellah, Mirleft',
    price_range: '150 - 300 DH',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    description: 'Fresh seafood, terrace sunsets, and a polished dining room above the coast.',
  },
  {
    id: 'portside-grill',
    name: 'Portside Grill',
    cuisine: 'Seafood',
    location: 'Harbor Road, Mirleft',
    price_range: '80 - 150 DH',
    image: 'plage-mirleft',
    description: 'Grilled fish, local spices, and a casual harbor atmosphere.',
  },
  {
    id: 'kasbah-rooftop',
    name: 'Kasbah Rooftop',
    cuisine: 'Fine Dining',
    location: 'Old Town Kasbah, Mirleft',
    price_range: '250 - 400 DH',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    description: 'Elevated Moroccan plates with sweeping rooftops and candlelit evenings.',
  },
]

export const restaurantDetails = {
  'la-brise-de-mer': {
    name: 'La Brise de Mer',
    reviews: 452,
    ranking: '#1 of 12 Restaurants in Mirleft',
    priceRange: '$$ - $$$',
    about:
      'Experience the finest coastal Moroccan cuisine at La Brise de Mer. Situated on the rugged cliffs of Mirleft, our restaurant offers an unparalleled dining experience where freshness of the Atlantic meets traditional Berber flavors.',
    gallery: [mirleft3, sunsetMirleft, legziraBeauty, plageMirleft],
    tags: ['Ocean View', 'Fresh Seafood', 'Fine Dining'],
    menu: [
      { name: 'Lobster Tagine', price: '$32.00', text: 'Slow-cooked Atlantic lobster with preserved lemons and saffron-infused garden vegetables.' },
      { name: 'Char-Grilled Octopus', price: '$24.00', text: 'Tender octopus marinated in chermoula, served with smoked paprika potatoes and wild arugula.' },
      { name: 'Saffron Sea Bass', price: '$28.00', text: 'Pan-seared sea bass fillet on a bed of herb-crusted couscous with a light saffron veloute.' },
      { name: 'Honey Glazed Lamb', price: '$26.00', text: 'Atlas mountain lamb shoulder braised for 12 hours with local honey, almonds, and dried apricots.' },
    ],
    reviewsList: [
      {
        name: 'Sarah L.',
        meta: 'London, UK - 12 reviews',
        title: 'Best seafood in Mirleft',
        text: 'We came here for our anniversary and it was magical. The sunset view from the terrace is unbeatable.',
        avatar: 'S',
      },
      {
        name: 'Marc-Andre L.',
        meta: 'Paris, France - 45 reviews',
        title: 'Stunning location, good food',
        text: 'The architecture of this place is beautiful. Food is solid, though the service can be a bit slow during the dinner rush.',
        avatar: 'M',
      },
    ],
  },
}

export const footerColumns = [
  {
    title: 'Mirleft Travel',
    links: ["Your expert companion for exploring the hidden gems of Morocco's southern coast."],
  },
  {
    title: 'Quick Links',
    links: ['About Us', 'Support', 'Terms of Use'],
  },
  {
    title: 'Resources',
    links: ['Privacy Policy', 'Language: English (US)'],
  },
]
