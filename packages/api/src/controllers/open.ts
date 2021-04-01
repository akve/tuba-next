import { Context, GET, POST, Path, PreProcessor, PathParam, ServiceContext } from 'typescript-rest';
import { attachmentsService } from '../services/attachmentsService';
import { RequestPreProcess } from '../utils/request-with-user';
import { LookupsController } from './lookups';
import { getTypeormConnection } from '../../../db';
import { SimpleResponseDto } from '@pdeals/models/dto/SimpleResponseDto';
import * as i18n from '../utils/i18n';
import * as orderService from '../services/orderService';
import { ListDto, ListRequestDto } from '@pdeals/models/dto/ListDto';
import generateUserFilter from '../utils/generateUserFilter';

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
    data.collections = await getTypeormConnection().query('select * from collection');

    rows.forEach((r: any) => {
      try {
        r.image = r.data.images[0].image;
      } catch (e) {
        console.log('bad image');
      }
    });
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

  @Path('/categories')
  @POST
  public async categoriesList(listParams: ListRequestDto): Promise<ListDto<any> | null> {
    const fields = `category.*, parentcat.name parentname`;
    let sort = 'category.sorter';
    if (listParams.sort) {
      if (listParams.sort === 'parentname') {
        listParams.sort = 'parentcat.name';
      }
      if (['id', 'createdDate', 'name', 'code'].indexOf(listParams.sort) >= 0) {
        sort = `"category"."${listParams.sort}"`;
      } else {
        sort = listParams.sort;
      }
      sort += listParams.sortDirectionIsAsc ? ' asc' : ' desc';
    }

    let sql = `
    select [FIELDS] from category
    left join category parentcat on parentcat.id =category.parent
    WHERE [USERSEARCH]
    [ORDER]
    LIMIT ${listParams.limit || 10}
`;

    let where = '1=1';
    where += generateUserFilter(listParams);

    sql = sql.replace('[USERSEARCH]', where);
    let count = await getTypeormConnection().query(sql.replace('[FIELDS]', 'count(*)').replace('[ORDER]', ``));
    count = parseInt(count[0].count || '0');

    const rows = await getTypeormConnection().query(
      sql.replace('[FIELDS]', fields).replace('[ORDER]', `ORDER BY ${sort}`)
    );

    const reply = new ListDto();
    reply.rows = rows;
    reply.count = count;
    return reply;
  }
}
