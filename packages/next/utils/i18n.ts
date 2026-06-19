import { setCookie } from '../lib/utils/cookiesHelper';

let _serverLang = 'ua';

const currentLang = () => {
  // return 'ua';
  if (typeof window === 'undefined') return _serverLang || 'ua';
  let r = localStorage.getItem('lang');
  if (!r || r === 'ru') r = 'ua';
  return r; //localStorage.getItem('lang') || 'ua';
};

const isEnglish = () => {
  return currentLang() === 'en';
}

const setLang = (lang) => {
  if (typeof window === 'undefined') {
    _serverLang = lang;
    return;
  }
  setCookie('lang', lang, 365);
  localStorage.setItem('lang', lang);
};

const t = (s: string, leaveHtml?: boolean) => {
  let l = currentLang();
  if (!s) return s;
  const regex = /\[(R|U|E):(.*?)\]/gs;
  let m: any = null;
  let removed = false;
  if (l === 'en' && s.indexOf('[E') < 0) {
    // fallback to UA :(
    l = 'ua';
  }
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
  if (!leaveHtml) s = s.replace('<br>', ', ');
  return s;
};

export { currentLang, setLang, t, isEnglish };
