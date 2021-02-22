import { Context, GET, POST, Path, PreProcessor, PathParam, ServiceContext } from 'typescript-rest';
import { attachmentsService } from '../services/attachmentsService';
import { RequestPreProcess } from '../utils/request-with-user';
import { LookupsController } from './lookups';
import { getTypeormConnection } from '../../../db';
import { SimpleResponseDto } from '@pdeals/models/dto/SimpleResponseDto';
import * as i18n from '../utils/i18n';
import * as orderService from '../services/orderService';

@Path('/v1/open')
@PreProcessor(RequestPreProcess)
export class OpenController {
  @Context
  public context: ServiceContext;

  @Path('/attachment/:id')
  @GET
  public async getAttachment(@PathParam('id') id: number): Promise<any> {
    const path = await attachmentsService.getPathById(id);
    if (!path) return null;
    const fullPath = attachmentsService.getFileLocation(path);
    return fullPath;
  }

  @Path('/alldata')
  @GET
  public async getAllData(): Promise<any> {
    const lookupsController = new LookupsController();
    lookupsController.context = this.context;
    const data: any = {};
    data.categories = await lookupsController.categoriesLookup(null);
    const rows = await getTypeormConnection().query('select * from product');

    data.products = rows;

    data.snippets = await getTypeormConnection().query('select * from snippet');
    data.colors = await getTypeormConnection().query('select * from color');
    return data;
  }

  @Path('/order')
  @POST
  public async sendOrder(order: any): Promise<any> {
    console.log('Order', order);
    i18n.setLang(order.lang || 'ua');
    const a = new Date();
    const generatedId =
      '' + (a.getMonth() + 1) + '-' + a.getDate() + '-' + Math.floor(Math.random() * 10000).toString();

    try {
      await orderService.addToExcel(order, generatedId);
    } catch (e) {
      console.log('Failed to add to excel', e);
    }

    try {
      await orderService.sendEmail(order, generatedId);
    } catch (e) {
      console.log('Failed to send email', e);
    }

    try {
      await orderService.sendSMS(order, generatedId);
    } catch (e) {
      console.log('Failed to add SMS', e);
    }

    return new SimpleResponseDto('ok');
  }
}
