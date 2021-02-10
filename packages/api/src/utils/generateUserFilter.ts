import { ListRequestDto } from '@pdeals/models/dto/ListDto';

const generateUserFilter = (list: ListRequestDto) => {
  const filter = list.userFilter;
  let where = '';
  if (filter) {
    filter.map((row) => {
      let condition = '=';
      let value: any = `'${`${row.value}`.replace("'", "''")}'`;
      if (row.condition == 'neq') condition = '<>';
      if (row.condition === 'like') {
        condition = 'ilike';
        value = `'%${row.value.replace("'", "''")}%'`;
      }
      if (row.condition === 'gt') condition = '>';
      if (row.field.indexOf('string::') <0 && (row.fieldtype === 'lazydropdown' || row.fieldtype === 'number')) {
        if (isNaN(parseFloat(row.value))) {
          value = 0;
        } else {
          value = parseFloat(row.value);
        }
      }
      if (row.fieldtype === 'checkbox') {
        value = !!row.value;
      }
      where += ` and ${row.field.replace('string::','')} ${condition} ${value}`;
    });
  }
  return where;
};
export default generateUserFilter;
