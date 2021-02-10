import i18n from '../lib/i18n';

// Transforms price range to string
function priceRange(priceRangeValues: any, currency: string) {
  // If there no price show free
  if (!priceRangeValues) return i18n.t('caption__free');
  if (!priceRangeValues.min && !priceRangeValues.max) return i18n.t('caption__free');

  // If there same price combine
  if (+priceRangeValues.min === +priceRangeValues.max) {
    return +priceRangeValues.min === 0 ? i18n.t('caption__free') : `${currency}${+priceRangeValues.min}`;
  }

  return `${currency}${+priceRangeValues.min} - ${currency}${+priceRangeValues.max}`;
}

export default priceRange;
