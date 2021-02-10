export const userNameSqlFragment = (tableName: string = 'u', fieldName: string = 'username') => {
  return `CASE 
          WHEN ${tableName}.id is null
              THEN '-'
          ELSE
              concat(${tableName}."firstName", ' ', ${tableName}."lastName")
          END ${fieldName}`;
};
