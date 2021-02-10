const formatNumber = (value: any) => {
  const valueArr = String(value).split('.');
  const fractionalPart = valueArr[1];
  const numberPart = valueArr[0];
  let temp = '';
  for (let i = 0; i < numberPart.length; i++) {
    if (i > 0 && i % 3 === 0) {
      temp += ',';
    }
    temp += numberPart[numberPart.length - 1 - i];
  }
  let rez = '';
  for (let i = 0; i < temp.length; i++) {
    rez += temp[temp.length - 1 - i];
  }
  return `${rez}${fractionalPart ? '.' + fractionalPart : ''}`;
};

export { formatNumber };
