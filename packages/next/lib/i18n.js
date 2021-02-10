import I18n from 'i18n-js';
import translations from './translations';

I18n.fallbacks = true;
I18n.missingBehaviour = 'guess';
I18n.translations = translations;

const replacements = {};

const I18nCustom = {
  initReplacements: (_replacements) => {
    _replacements.forEach((r) => {
      replacements[r.from] = r.to;
    });
  },
  getLocale: () => {
    return I18n.locale;
  },
  setLocale: (locale) => {
    if (locale === 'ru') {
      locale = 'ru';
    } else if (locale === 'es') {
      locale = 'es';
    } else {
      locale = 'en';
    }

    I18n.locale = locale;
  },
  t: (_text) => {
    try {
      let text = _text;
      if (!text) return '';
      if (replacements[_text]) text = replacements[_text];
      return I18n.t(text) || text; // "TTT" + text//
    } catch (e) {
      return _text || '';
    }
  },
};

export default I18nCustom;
