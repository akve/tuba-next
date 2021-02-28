const currentLang = () => {
  if (typeof window === 'undefined') return 'ru';
  return localStorage.getItem('lang') || 'ru';
};

const setLang = (lang) => {
  localStorage.setItem('lang', lang);
};

const t = (s: string) => {
  const l = currentLang();
  if (!s) return s;
  const regex = /\[(R|U|E):(.*?)\]/gs;
  let m: any = null;
  let removed = false;
  while (s.match(regex)) {
    m = s.match(regex);
    removed = false;
    if (l === 'ru' && m[0].indexOf('[R:') !== 0) {
      s = s.replace(m[0], '');
      removed = true;
    }
    if (l === 'ua' && m[0].indexOf('[U:') !== 0) {
      s = s.replace(m[0], '');
      removed = true;
    }
    if (l === 'en' && m[0].indexOf('[E:') !== 0) {
      s = s.replace(m[0], '');
      removed = true;
    }
    if (!removed) {
      s = s.replace(m[0], m[0].substr(3, m[0].length - 4));
    }
  }
  return s;
};

export { currentLang, setLang, t };
