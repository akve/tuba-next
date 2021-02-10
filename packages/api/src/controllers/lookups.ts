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
    let sql = `
    select * from category order by sorter
`;
    const rows = await getTypeormConnection().query(sql);
    const res: any = [];
    const findByParent = (parentId:number) => {
      return filter(rows, (r: any) => {
        return parentId === 0 ? !r.parent : r.parent === parentId;
      }) || [];
    }
    const startBuild = (parent: number, level: number, parentcode: string) => {
      const children = findByParent(parent);
      children.forEach((child: any) => {
        const subcode = parentcode? parentcode + '_' + child.code : child.code;
        res.push({
          id: child.id,
          name: "--".repeat(level) + ' ' + child.name,
          originalName: child.name,
          parent: child.parent || 0,
          code: subcode,
          level: level
        })
        startBuild(child.id, level + 1, subcode);
      })
    };
    startBuild(0, 0, '');


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

    if (entity === 'payment_request' || entity === 'payment' || entity === 'payment' || entity === 'referral_requests') {
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
