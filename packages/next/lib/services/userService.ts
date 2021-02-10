import { client } from '@pdeals/next/lib/api/api-client';

export const getUsers = async (): Promise<any> => {
  return (await client().get('/general/crud/user')) as any;
};
