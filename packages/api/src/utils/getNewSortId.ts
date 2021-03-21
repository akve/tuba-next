import { getTypeormConnection } from '../../../db';

export const getNewSortId = async (entity: string) => {
  const d: any = await getTypeormConnection().query(`select max(id) mx from ${entity}`);
  if (!d || !d.length) return 1;
  return d[0].mx + 1;
};
