import { client } from '@pdeals/next/lib/api/api-client';

export const getLanguages = async () => {
  return await client().get('/general/crud/language');
};
