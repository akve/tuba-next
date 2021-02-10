import { client } from './api-client';
import config from '@pdeals/next/lib/config';
const { API_URL } = config();

const AttachmentsApi = () => {
  return {
    getAttaches: (ids) => client().get(`attachments/${ids}`),
    attachmentBase: `${API_URL}/uploads`,
    upload: (payload) => client().post('attachments', payload),
  };
};

export { AttachmentsApi };
