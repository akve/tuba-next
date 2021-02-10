import { Repository } from 'typeorm';

const verifyColumnTypes = (payload: any, repo: Repository<any>) => {
  const cols = repo.metadata.ownColumns;
  const colByName = (name: string) => {
    return cols.find((r) => r.propertyName === name);
  };
  Object.keys(payload).forEach((key) => {
    const col = colByName(key);
    if (col) {
      // change '' to null for numbers
      if (payload[key] === '' && `${col.type}`.indexOf('Number') > 0) payload[key] = null;
    }
  });
  return payload;
};

export { verifyColumnTypes };
