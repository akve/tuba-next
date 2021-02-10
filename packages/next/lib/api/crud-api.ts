import { client } from './api-client';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

const CrudApi = ({ apiUrlPrefix, overrideListUrlPrefix }: ICrud) => {
  return {
    getObjects: (params = {}) => client().post(overrideListUrlPrefix || `general/crud/${apiUrlPrefix}/list`, params),
    getObject: (id) => client().get(`general/crud/${apiUrlPrefix}/${id}`),
    save: (id, data) => client().put(`general/crud/${apiUrlPrefix}/${id}`, data),
    create: (data) => client().post(`general/crud/${apiUrlPrefix}`, data),
    delete: (id) => client().delete(`general/crud/${apiUrlPrefix}/${id}`),
  };
};

export { CrudApi };
