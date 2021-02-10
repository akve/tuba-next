import { client } from '@pdeals/next/lib/api/api-client';

export const getCurrencies = async () => {
  return await client().get('/general/crud/currency');
};
