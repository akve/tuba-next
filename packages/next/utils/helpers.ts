import { isArray, isObject, isString, isFinite } from 'lodash';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import lightFormat from 'date-fns/lightFormat';

export const footerSumCalculator = (unit = '') => columnData => `${columnData.reduce((acc, item) => acc + item, 0)} ${unit}`;

export const footerPercentCalculator = (unit = '') =>
  (columnData) => `${(columnData.reduce((acc, item) => acc + item, 0) / columnData.length).toFixed(2)} ${unit}`;

export const counterCreater = (startIndex: number = 0): () => number => {
  let index = startIndex;
  return (): number => index++;
};

export const getId = (router: any, firstParam?: boolean) => {
  const query = router.query;
  let id;
  if (!query) return null;
  if (isArray(query.id)) {
    const ids = firstParam
      ? [...query.id]
      : [...query.id].reverse();

    id = ids.find(i => +i && isFinite(+i));
  } else if (isString(query.id)) {
    id = query.id;
  } else if (isObject(query.id)) {
    id = query.id.id;
  }

  if (!id) {
    id = router.asPath.slice(router.route.length).split('/')?.[1];
  }

  return id;
};

export const getStartOfMonth = (date: Date = new Date()) => {
  const start = startOfMonth(date);
  const result = lightFormat(start, 'yyyy-MM-dd');
  return result;
};

export const getEndOfMonth = (date = new Date()) => {
  const start = endOfMonth(date);
  const result = lightFormat(start, 'yyyy-MM-dd');
  return result;
};
