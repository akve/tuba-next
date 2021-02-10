import { ListRequestDto } from '@pdeals/models/dto/ListDto';
import { getTypeormConnection } from '@pdeals/db';
import generateUserFilter from '../utils/generateUserFilter';

const getUserListing = async (listParams: ListRequestDto, isCount: boolean): Promise<any> => {
  const fields = `
  "user".*        
  `;
  let sort = '"user".id desc';
  if (listParams.sort) {
    if (['id', 'createdDate', 'balance'].indexOf(listParams.sort) >= 0) {
      sort = `"user"."${listParams.sort}"`;
    } else {
      sort = listParams.sort;
    }
    sort += listParams.sortDirectionIsAsc ? ' asc' : ' desc';
  }
  let sql = `
    select [FIELDS] 
    from "user"
    WHERE [WHERE]
    [ORDER]
    LIMIT ${listParams.limit || 10}
    OFFSET ${isCount ? 0 : listParams.offset || 0}
`;
  let where = `"user".role <> 'admin'`;
  where += generateUserFilter(listParams);
  sql = sql.replace('[WHERE]', where);

  if (isCount) {
    const count = await getTypeormConnection().query(sql.replace('[FIELDS]', 'count(*)').replace('[ORDER]', ``));
    return parseInt(count[0].count || '0');
  }
  const rows = await getTypeormConnection().query(
    sql.replace('[FIELDS]', fields).replace('[ORDER]', `ORDER BY ${sort}`)
  );
  return rows;
};

export default { getUserListing };
