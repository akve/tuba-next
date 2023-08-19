import { Context, GET, POST, PUT, Path, PreProcessor, PathParam, ServiceContext } from 'typescript-rest';
import { attachmentsService } from '../services/attachmentsService';
import { RequestPreProcess } from '../utils/request-with-user';
import { LookupsController } from './lookups';
import { getTypeormConnection, getTypeormManager } from '../../../db';
import { SimpleResponseDto } from '@pdeals/models/dto/SimpleResponseDto';
import * as i18n from '../utils/i18n';
import * as orderService from '../services/orderService';
import { ListDto, ListRequestDto } from '@pdeals/models/dto/ListDto';
import generateUserFilter from '../utils/generateUserFilter';
import { find } from 'lodash';
import { Order } from '../../../models/entities/Order';
import axios from 'axios';

const COURSE = 40;

const transformProduct = (p:any) => {
  if (!p.price_en) p.price_en = Math.ceil(p.price / COURSE);
  if (!p.pricediscount_en && p.pricediscount) p.pricediscount_en = Math.ceil(p.pricediscount / COURSE);
}

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
        transformProduct(r);
      } catch (e) {
        console.log('bad image');
      }
    });
    data.products = rows;

    data.snippets = await getTypeormConnection().query('select * from snippet');
    data.colors = await getTypeormConnection().query('select * from color');
    data.fabrics = await getTypeormConnection().query('select * from fabric');
    data.sorting = await getTypeormConnection().query('select * from product_sort');
    return data;
  }

  @Path('/product/:code')
  @GET
  public async getProdData(@PathParam('code') code: string): Promise<any> {
    const data: any = {};
    const rows = await getTypeormConnection().query(`select * from product where code='${code}'`);
    if (rows.length === 0) return null;
    transformProduct(rows[0]);
    data.product = rows[0];
    data.colors = await getTypeormConnection().query('select id, name, image, invisible from color');
    const disabledColorIds = data.colors.filter((r:any)=>r.invisible).map((r: any) =>r.id);
    if (data.product.data.colors) {
      data.product.data.colors = data.product.data.colors.filter((r: any) => {
        return disabledColorIds.indexOf(r.color) < 0
      });
      const foundColorIds = data.product.data.colors.map((r: any)=>r.color);
      data.colors = data.colors.filter((r: any) => foundColorIds.indexOf(r.id) >=0);
    }
    data.fabrics = await getTypeormConnection().query(`select * from fabric where id=${rows[0].fabric || 0}`);
    return data;
  }

  @Path('/products/:category_or_collection/:id')
  @GET
  public async getCollData(
    @PathParam('category_or_collection') type: string,
    @PathParam('id') id: string
  ): Promise<any> {
    const data: any = {};
    let _id: any = id.split('_');
    _id = _id[_id.length - 1];
    console.log(`select * from ${type} where code='${_id}'`);
    const catOrCol = await getTypeormConnection().query(`select * from ${type} where code='${_id}'`);
    if (catOrCol.length === 0) return null;
    const catId = '' + catOrCol[0].id;
    const rows = await getTypeormConnection().query('select * from product where not(coalesce(invisible, false))');
    const res: any = [];
    rows.forEach((r: any) => {
      try {
        transformProduct(r);
        r.image = r.data.images[0].image;
        r.data.images = [r.data.images[0]]; // optimize - only 1st image is fine
      } catch (e) {
        console.log('bad image');
      }
      r.description = '';
      if (type === 'category') {
        if (find(r.data.categories, (c) => `${c.category}` === catId)) {
          res.push(r);
        }
      }
      if (type === 'collection') {
        if (find(r.data.collections, (c) => `${c.collection}` === catId)) {
          res.push(r);
        }
      }
    });
    data.products = res;
    const ids = res.map((r: any) => r.id).join(',') || '0';
    // data.colors = await getTypeormConnection().query('select * from color');
    // data.fabrics = await getTypeormConnection().query('select * from fabric');
    data.sorting = await getTypeormConnection().query(`select * from product_sort where product in (${ids})`);
    return data;
  }

  @Path('/structure/:type')
  @GET
  public async getStructureData(@PathParam('type') type: string): Promise<any> {
    const data: any = {};
    if (type === 'structure') {
      const lookupsController = new LookupsController();
      lookupsController.context = this.context;
      data.categories = await lookupsController.categoriesLookup(null);
      data.collections = await getTypeormConnection().query('select * from collection');
    }
    if (type === 'snippets') {
      data.snippets = await getTypeormConnection().query('select * from snippet');
    }
    if (type === 'reviews') {
      data.snippets = await getTypeormConnection().query('select * from snippet');
    }
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

    const repo = getTypeormManager().getRepository(Order);
    const record: any = await repo.create({
      code: generatedId,
      payment_status: 'requested',
      data: order,
      total: order.total
    });
    const newRecord = await repo.save(record);
    console.log('?', newRecord);



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

    return {id: generatedId, sum: order.total};
  }

  @Path('/order-ci')
  @POST
  public async sendOrderCI(order: any): Promise<any> {
    console.log('Order', order);

    const a = new Date();
    const generatedId =
      '' + (a.getMonth() + 1) + '-' + a.getDate() + '-' + Math.floor(Math.random() * 10000).toString();

    /*try {
      await orderService.addToExcel(order, generatedId);
    } catch (e) {
      console.log('Failed to add to excel', e);
    }*/

    try {
      await orderService.sendEmailCI(order, generatedId);
    } catch (e) {
      console.log('Failed to send email', e);
    }

    /*try {
      await orderService.sendSMS(order, generatedId);
    } catch (e) {
      console.log('Failed to add SMS', e);
    }*/

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
      sql.replace('[FIELDS]', fields).replace('[ORDER]', `ORDER BY ${sort}`) + `    OFFSET ${listParams.offset || 0}`
    );

    const reply = new ListDto();
    reply.rows = rows;
    reply.count = count;
    return reply;
  }

  @Path('/colors')
  @POST
  public async colorsList(listParams: ListRequestDto): Promise<ListDto<any> | null> {
    const fields = `color.*, fabric.name fabricname`;
    let sort = 'fabric.name, color.name';
    if (listParams.sort) {
      if (listParams.sort === 'fabricname') {
        listParams.sort = 'fabric.name';
      }
      if (['id', 'createdDate', 'name', 'code'].indexOf(listParams.sort) >= 0) {
        sort = `"color"."${listParams.sort}"`;
      } else {
        sort = listParams.sort;
      }
      sort += listParams.sortDirectionIsAsc ? ' asc' : ' desc';
    }

    let sql = `
    select [FIELDS] from color
    left join fabric on fabric.id =color.fabric
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
      sql.replace('[FIELDS]', fields).replace('[ORDER]', `ORDER BY ${sort}`) + `    OFFSET ${listParams.offset || 0}`
    );

    const reply = new ListDto();
    reply.rows = rows;
    reply.count = count;
    return reply;
  }

  @Path('/reviews')
  @POST
  public async reviewsList(listParams: ListRequestDto): Promise<ListDto<any> | null> {
    const sql = `
    select review.*, product.name from review 
    left join product on product.id = review.product
    ORDER BY coalesce(review.score_date, review."createdDate")
    LIMIT ${listParams.limit || 10} 
    OFFSET ${listParams.offset || 0}
`;

    const rows = await getTypeormConnection().query(sql);

    const reply = new ListDto();
    reply.rows = rows;
    reply.count = rows.length;
    return reply;
  }

  @Path('/reviews-frontend/:offset')
  @GET
  public async reviewsListFront(@PathParam('offset') offset: number): Promise<ListDto<any> | null> {
    const sql = (isCount: boolean) => {
      return `
    select ${isCount ? 'count(*)' : 'review.*, product.name'} 
    from review
    left join product on product.id = review.product
    ${
      isCount ? '' : 'ORDER BY coalesce(review.score_date, review."createdDate") desc LIMIT 100 OFFSET ' + (offset || 0)
    }`;
    };

    const rows = await getTypeormConnection().query(sql(false));
    const count = await getTypeormConnection().query(sql(true));

    const reply = new ListDto();
    reply.rows = rows;
    reply.count = count;
    return reply;
  }

  @Path('/reorder/:coll_or_cat/:id')
  @PUT
  public async reorder(
    @PathParam('coll_or_cat') collectionOrCategory: string,
    @PathParam('id') id: number,
    sortData: number[]
  ): Promise<any> {
    console.log('SD', sortData);
    await getTypeormConnection().query(`delete from product_sort where ${collectionOrCategory} = ${id}`);
    for (let i = 0; i < sortData.length; i++) {
      await getTypeormConnection().query(
        `insert into product_sort (${collectionOrCategory}, product, sort) values (${id}, ${sortData[i]}, ${i})`
      );
    }
    return new SimpleResponseDto('ok');
  }

  @Path('/checkout-fondy-url/:id/:lang')
  @GET
  public async checkoutUrl(
    @PathParam('id') id: string,
    @PathParam('lang') lang: string,
  ): Promise<any> {
    const crypto = require('crypto')
    const shasum = crypto.createHash('sha1');
    const resUrl = `${process.env.FONDY_REDIRECT}?id=${id}`;

    const rawOrder = await getTypeormConnection().query(`select * from "order" where code = '${id}'`);
    if (!rawOrder.length) throw new Error('order not found');


    const data: any = {
      "amount": rawOrder[0].total * 100,
      "currency": lang === 'en' ? 'EUR' : "UAH",
      "merchant_id": process.env.FONDY_MERCHANT,
      "order_desc": "Tuba-Duba order",
      "order_id": id,
      "response_url": resUrl,
    };

    const v = [];
    Object.keys(data).forEach(k => {
      v.push(data[k]);
    })
    v.unshift(process.env.FONDY_KEY);
    const str = v.join('|');
    shasum.update(str);
    const signature = shasum.digest('hex');
    data.signature = signature;

    const response = await axios.post('https://pay.fondy.eu/api/checkout/url/', {request:data}, {
    });

    return response.data;
  }

  @Path('/checkout-paid/:id')
  @GET
  public async checkoutPaid(
    @PathParam('id') id: string,
  ): Promise<any> {

    await getTypeormConnection().query(`update "order" set payment_status='paid' where code = '${id}'`);
    await orderService.sendEmailPayment(id);


    return new SimpleResponseDto('ok');
  }
}
