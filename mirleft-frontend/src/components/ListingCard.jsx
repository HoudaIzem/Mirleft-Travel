import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star } from 'lucide-react';
import { formatPriceDH } from '../utils/format';
import { getImageUrl } from '../utils/images';
import FavoriteButton from './FavoriteButton';
import { MODEL_TYPES } from '../utils/apiHelpers';

export default function ListingCard({
  item,
  to,
  type = 'property',
  titleKey = 'name',
  priceKey = 'price',
  modelType = MODEL_TYPES.property,
}) {
  const { t } = useTranslation();
  const title = item[titleKey] || item.name || item.title;
  const rating = item.average_rating ?? item.rating;

  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(item)}
          alt={title}
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute right-2 top-2">
          <FavoriteButton id={item.id} type={modelType} />
        </div>
      </div>
      <div className="p-3">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{title}</h3>
          {rating != null && (
            <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-[var(--color-primary-50)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-primary-700)]">
              <Star className="h-2.5 w-2.5 fill-current" />
              {Number(rating).toFixed(1)}
            </span>
          )}
        </div>
        <p className="mb-1 flex items-center gap-1 text-[10px] text-gray-500">
          <MapPin className="h-2.5 w-2.5 shrink-0" />
          <span className="line-clamp-1">{item.location || 'Mirleft, Morocco'}</span>
        </p>
        {item.description && (
          <p className="mb-2 line-clamp-1 text-[10px] text-gray-600">{item.description}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-[var(--color-primary-700)]">
            {type === 'property'
              ? formatPriceDH(item[priceKey], { perNight: true, currency: t('common.currency'), perNightText: t('common.perNight') })
              : item.price_range || formatPriceDH(item[priceKey], { currency: t('common.currency') }) || '—'}
          </p>
          <Link
            to={to}
            className="rounded-full bg-[var(--color-primary-600)] px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-[var(--color-primary-700)]"
          >
            {t("common.view")}
          </Link>
        </div>
      </div>
    </article>
  );
}
