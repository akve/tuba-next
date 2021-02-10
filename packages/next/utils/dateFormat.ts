import format from 'date-fns/format';

const dateString = 'MMM do, yyyy';
const dateStringWithoutYear = 'MMM Do';
import i18n from '../lib/i18n';

function formatDate(date: string | null) {
  if (!date) return '';
  return format(new Date(date), dateString);
}

function formatTime(date: string, tz: string, mode: 'full' | 'short') {
  let dateFormat = 'M/d/yy h:mma';
  if (i18n.getLocale() === 'es') {
    dateFormat = 'd/M/yy h:mma';
  }

  if (mode === 'full') {
    dateFormat = 'EEEE, MMM do yyyy, h:mma';
  }
  const stringsToTranslate = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let res = `${format(new Date(date), dateFormat)} ${tz}`;
  stringsToTranslate.forEach((str) => {
    res = res.replace(str, i18n.t(str));
  });
  return res;
}

export { formatDate, formatTime, dateString, dateStringWithoutYear };
