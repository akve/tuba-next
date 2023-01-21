import { setLang, t } from '@pdeals/next/utils/i18n';

function iterate(obj) {
  for (var property in obj) {
    if (property === 'createdDate' || property === 'updatedDate') {
      delete obj[property];
      continue;
    }
    if (obj.hasOwnProperty(property)) {
      if(obj[property] === null) {
        delete obj[property];
        continue;
      }
      if (typeof obj[property] == "object") {
        iterate(obj[property]);
      }
      else {
        if(typeof obj[property] === 'string') {
          const s = obj[property];
          if (s.indexOf('[') >=0) {
            obj[property] = t(s);
          }
        }
      }
    }
  }
}

export const serverTranslate = (context, content) => {
  iterate(content);

  return content;
}

export const serverSetLang = (context) => {
  const parsedLang = context.req.cookies.lang || 'ua';
  setLang(parsedLang);
  console.log('TRANS', parsedLang);
}