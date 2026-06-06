import { useId } from 'react';
import { useTranslation } from 'react-i18next';

export default function DateRangeField({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  className = '',
}) {
  const { t } = useTranslation();
  const idIn = useId();
  const idOut = useId();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${className}`}>
      <label htmlFor={idIn} className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
          {t('search.checkIn')}
        </span>
        <input
          id={idIn}
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)]"
        />
      </label>
      <label htmlFor={idOut} className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
          {t('search.checkOut')}
        </span>
        <input
          id={idOut}
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
          className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)]"
        />
      </label>
    </div>
  );
}
