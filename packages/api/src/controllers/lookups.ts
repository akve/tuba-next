import { Context, POST, Path, PreProcessor, ServiceContext, GET, PathParam } from 'typescript-rest';
import { RequestPreProcess, RequestWithLogin } from '../utils/request-with-user';
import { getTypeormConnection, getTypeormManager } from '@pdeals/db';
import { ListRequestDto, ListDto } from '@pdeals/models/dto/ListDto';
import { filter } from 'lodash';

@Path('/v1/lookups')
@PreProcessor(RequestPreProcess)
@PreProcessor(RequestWithLogin)
export class LookupsController {
  @Context
  public context: ServiceContext;

  @Path('/users')
  @POST
  public async usersLookup(listParams: ListRequestDto): Promise<ListDto<any> | null> {
    const fields = `u.id, concat(u."firstName", ' ', u."lastName") as name`;
    const sort = 'lower(concat(u."firstName", u."lastName"))';
    let sql = `
    select [FIELDS] from "user" u
    WHERE [USERSEARCH]
    [ORDER]
    LIMIT ${listParams.limit || 10}
`;

    let where = '1=1';
    const search = listParams.userFilter.find((r) => r.field === 'search');
    if (search && search.value) {
      where = `lower(concat(u."firstName", ' ', u."lastName")) ilike '%${search.value.toLowerCase()}%'`;
      if (Number(search.value)) {
        where = `u."id" = ${search.value}`;
      }
    }

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

  @Path('/categories')
  @POST
  public async categoriesLookup(listParams: ListRequestDto | null): Promise<ListDto<any> | null> {
    const sql = `
    select * from category order by sorter
`;
    const rows = await getTypeormConnection().query(sql);
    const res: any = [];
    const findByParent = (parentId: number) => {
      return (
        filter(rows, (r: any) => {
          return parentId === 0 ? !r.parent : r.parent === parentId;
        }) || []
      );
    };
    const startBuild = (parent: number, level: number, parentcode: string, parentname: string) => {
      const children = findByParent(parent);
      children.forEach((child: any) => {
        const subcode = parentcode ? parentcode + '_' + child.code : child.code;
        const subname = parentname ? parentname + ' > ' + child.name : child.name;
        res.push({
          id: child.id,
          name: subname, //'--'.repeat(level) + ' ' + child.name
          originalName: child.name,
          parent: child.parent || 0,
          code: subcode,
          invisible: child.invisible,
          parent_not_clickable: child.parent_not_clickable,
          level: level,
          sorter: child.sorter,
        });
        startBuild(child.id, level + 1, subcode, subname);
      });
    };
    startBuild(0, 0, '', '');

    const reply = new ListDto();
    reply.rows = res;
    reply.count = 1000;
    return reply;
  }

  @Path('/colors')
  @POST
  public async colorsLookup(listParams: ListRequestDto | null): Promise<ListDto<any> | null> {
    const sql = `
    select color.id, concat(coalesce(fabric.name, '--'), ' > ', color.name) "name" from color left join fabric on color.fabric = fabric.id order by fabric.name, color.name
`;
    const rows = await getTypeormConnection().query(sql);
    const res: any = rows;

    const reply = new ListDto();
    reply.rows = res;
    reply.count = 1000;
    return reply;
  }

  @Path('/products')
  @POST
  public async productsLookup(listParams: ListRequestDto | null): Promise<ListDto<any> | null> {
    const sql = `select id, name from product order by name`;
    const rows = await getTypeormConnection().query(sql);
    const res: any = rows;

    const reply = new ListDto();
    reply.rows = res;
    reply.count = 1000;
    return reply;
  }

  @Path('/collections')
  @POST
  public async collectionsLookup(listParams: ListRequestDto | null): Promise<ListDto<any> | null> {
    const sql = `
    select * from collection order by name
`;
    const rows = await getTypeormConnection().query(sql);
    const res: any = rows;

    const reply = new ListDto();
    reply.rows = res;
    reply.count = 1000;
    return reply;
  }

  @Path('/fabrics')
  @POST
  public async fabricsLookup(listParams: ListRequestDto | null): Promise<ListDto<any> | null> {
    const sql = `
    select * from fabric order by name
`;
    const rows = await getTypeormConnection().query(sql);
    const res: any = rows;

    const reply = new ListDto();
    reply.rows = res;
    reply.count = 1000;
    return reply;
  }

  @Path('/resolver/:entity/:id')
  @GET
  public async genericCrudGet(@PathParam('entity') entity: string, @PathParam('id') id: number): Promise<any> {
    const repo = await getTypeormManager().getRepository(entity);
    const data: any = await repo.findOne(id);

    if (entity === 'user') {
      return {
        name: `${data.firstName} ${data.lastName}`,
        id: data.id,
      };
    }
    if (entity === 'room_user') {
      return {
        name: data.user_alias,
        id: data.id,
      };
    }

    if (
      entity === 'payment_request' ||
      entity === 'payment' ||
      entity === 'payment' ||
      entity === 'referral_requests'
    ) {
      return {
        name: data.id,
        id: data.id,
      };
    }

    if (entity === 'news' || entity === 'promotions') {
      return {
        name: data.title,
        id: data.id,
      };
    }

    return {
      name: data.name,
      id: data.id,
    };
  }
}
