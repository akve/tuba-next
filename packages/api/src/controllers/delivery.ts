import { Context, Path, PreProcessor, ServiceContext, GET, QueryParam, PathParam } from 'typescript-rest';
import { RequestPreProcess } from '../utils/request-with-user';
import axios from 'axios';

@Path('/v1/delivery')
@PreProcessor(RequestPreProcess)
export class DeliveryController {
  @Context
  public context: ServiceContext;

  @Path('/cities')
  @GET
  public async citiesLookup(@QueryParam('search') city: string): Promise<any> {
    if (!city) {
      return [
        { label: 'Київ', value: '8d5a980d-391c-11dd-90d9-001a92567626' },
        { label: 'Львів', value: 'db5c88f5-391c-11dd-90d9-001a92567626' },
        { label: 'Одеса', value: 'db5c88d0-391c-11dd-90d9-001a92567626' },
        { label: 'Дніпро', value: 'db5c88f0-391c-11dd-90d9-001a92567626' },
        { label: 'Харків', value: 'db5c88e0-391c-11dd-90d9-001a92567626' },
      ];
    }
    const r = await axios.post(
      'http://api.novaposhta.ua/v2.0/json/Address/searchSettlements/',
      {
        apiKey: 'fbc704eab3825847c33ae387c649daf1',
        modelName: 'Address',
        calledMethod: 'searchSettlements',
        methodProperties: {
          CityName: city,
          Limit: 10,
        },
      },
      {
        headers: {}, // Authorization: `Bearer ${process.env.TURBOSMS_KEY}`
      }
    );
    if (r.data && r.data.data && r.data.data[0].Addresses) {
      return r.data.data[0].Addresses.map((r: any) => {
        return { label: r.Present, value: r.DeliveryCity };
      });
    }

    return [];
  }

  @Path('/warehouses/:id')
  @GET
  public async whLookup(@PathParam('id') id: string, @QueryParam('search') search: string): Promise<any> {
    const methodProperties: any = { CityRef: id };
    if (search) {
      methodProperties.FindByString = search;
    }
    const r = await axios.post(
      'http://api.novaposhta.ua/v2.0/json/AddressGeneral/getWarehouses',
      {
        modelName: 'AddressGeneral',
        calledMethod: 'getWarehouses',
        methodProperties,
        apiKey: 'fbc704eab3825847c33ae387c649daf1',
      },
      {
        headers: {}, // Authorization: `Bearer ${process.env.TURBOSMS_KEY}`
      }
    );
    if (r.data && r.data.data) {
      return r.data.data.map((r: any) => {
        return { label: r.Description, value: r.Description };
      });
    }

    return [];
  }
}
