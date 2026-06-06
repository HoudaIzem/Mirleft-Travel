/** Moroccan Dirham formatting */
export function formatPriceDH(value, { perNight = false, currency = 'DH', perNightText = '/ night' } = {}) {
  const num = Number(String(value ?? '').replace(/[^\d.,]/g, '').replace(',', '.'));
  if (Number.isNaN(num) || num === 0) {
    return perNight ? `— ${currency} ${perNightText}` : `— ${currency}`;
  }
  const formatted = new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
  return perNight ? `${formatted} ${currency} ${perNightText}` : `${formatted} ${currency}`;
}

export function parsePriceNumber(value) {
  const num = Number(String(value ?? '').replace(/[^\d.,]/g, '').replace(',', '.'));
  return Number.isNaN(num) ? 0 : num;
}
