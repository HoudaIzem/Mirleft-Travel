import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultCenter = [29.582, -10.035];

const CATEGORY_COLORS = {
  hotel: '#0b6b46',
  restaurant: '#c45c26',
  activity: '#1a6b7a',
  rental: '#8b5a2b',
};

const iconCache = {};

function getCategoryIcon(type = 'hotel') {
  const key = type in CATEGORY_COLORS ? type : 'hotel';
  if (iconCache[key]) return iconCache[key];

  const color = CATEGORY_COLORS[key];
  iconCache[key] = L.divIcon({
    className: 'mirleft-map-marker',
    html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 10px rgba(26,18,8,0.35);"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
  return iconCache[key];
}

export default function MirleftMap({
  markers = [],
  height = '320px',
  zoom = 11,
  className = '',
  scrollWheelZoom = false,
}) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const categoryLabels = {
    hotel: t('home.mapCategoryHotel'),
    restaurant: t('home.mapCategoryRestaurant'),
    activity: t('home.mapCategoryActivity'),
    rental: t('home.mapCategoryRental'),
  };

  const points = markers.filter((m) => m.latitude != null && m.longitude != null);

  const center =
    points.length > 0
      ? [
          points.reduce((sum, m) => sum + m.latitude, 0) / points.length,
          points.reduce((sum, m) => sum + m.longitude, 0) / points.length,
        ]
      : defaultCenter;

  return (
    <div
      className={`overflow-hidden rounded-2xl ring-1 ring-[#e8ddd4] ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        className="z-0 h-full w-full min-h-[inherit]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((m) => {
          const type = m.type || 'hotel';
          return (
            <Marker
              key={m.id ?? `${m.latitude}-${m.longitude}-${type}`}
              position={[m.latitude, m.longitude]}
              icon={getCategoryIcon(type)}
            >
              <Popup>
                <div className="min-w-[140px] max-w-[220px] pr-1" dir={isRtl ? 'rtl' : 'ltr'}>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#6b5c50]">
                    {categoryLabels[type] || type}
                  </p>
                  <strong className="mt-0.5 block text-sm text-[#1a1208] sm:text-base">
                    {m.name || m.title}
                  </strong>
                  {m.location && (
                    <p className="mt-1 text-xs leading-snug text-gray-600 sm:text-sm">{m.location}</p>
                  )}
                  {m.link && (
                    <Link
                      to={m.link}
                      className="mt-2 inline-block text-xs font-semibold text-[#0b6b46] hover:underline sm:text-sm"
                    >
                      {t('home.mapViewDetails')} {isRtl ? '←' : '→'}
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
