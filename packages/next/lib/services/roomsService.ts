import { client } from '@pdeals/next/lib/api/api-client';

export const getRooms = async (): Promise<any> => {
  return (await client().get('/general/crud/room')) as any;
};

export const mergeRooms = async (fromId: number, toId: number) => {
  return await client().put(`/crawlers/room/merge/${fromId}/${toId}`, {});
};

export const mergeOrphaned = async (fromRecordId: number, toUserId: number, deal: number, update: string) => {
  return await client().put(`/crawlers/user/merge-orphaned/${fromRecordId}/${toUserId}`, { deal, update });
};
