import { Context, GET, PUT, POST, DELETE, Path, PreProcessor, PathParam, ServiceContext } from 'typescript-rest';
import { ConfigDto } from '@pdeals/models/dto/ConfigDto';
import { RequestPreProcess, RequestWithLogin, IRequestWithUser } from '../utils/request-with-user';
import { getTypeormManager } from '@pdeals/db';
import { SimpleResponseDto } from '@pdeals/models/dto/SimpleResponseDto';
import { ListRequestDto, ListDto } from '@pdeals/models/dto/ListDto';
import { EntitySchema } from 'typeorm';
import { EntityNameToEntityMapping } from '../lib/entityHelper';
import generateUserFilter from '../utils/generateUserFilter';
import { verifyColumnTypes } from '../utils/verifyColumnTypes';
import { LogService, LOG_ACTIONS } from '@pdeals/db/services/log.service';
import { getNewSortId } from '../utils/getNewSortId';

@Path('/v1/general')
@PreProcessor(RequestPreProcess)
@PreProcessor(RequestWithLogin)
export class GeneralController {
  @Context
  public context: ServiceContext;

  /**
   * Check live status
   */
  @Path('/live-status-check')
  @GET
  public async getStatusCheck(): Promise<any> {
    return { status: 'ok' };
  }

  /**
   * Returns current session ID
   * @return <SessionDto> session
   */
  @Path('/config')
  @GET
  public async getConfig(): Promise<any> {
    // const req: IRequestWithUser = this.context.request as IRequestWithUser;
    const data = new ConfigDto();
    return data;
  }

  @Path('/crud/:entity')
  @GET
  public async genericCrudGetList(@PathParam('entity') entity: string): Promise<any> {
    const repo = await getTypeormManager().getRepository(entity);
    return repo.find();
  }

  @Path('/crud/:entity/list')
  @POST
  public async genericCrudGetFullList(
    @PathParam('entity') entity: string,
    listParams: ListRequestDto
  ): Promise<ListDto<any> | null> {
    console.log('lp', entity, listParams);
    const mapping = EntityNameToEntityMapping;
    const schema: EntitySchema = mapping[entity];
    const queryBuilder = () => getTypeormManager().getRepository(schema).createQueryBuilder(entity);
    const count = await queryBuilder().select('id').getCount();
    console.log('l2', count);
    // const users = await getTypeormManager().getRepository(schema).createQueryBuilder('user').getMany();
    // console.log('U', users);
    if (listParams.isCsv) {
      const q = queryBuilder().orderBy('id', 'DESC');
      const rows = await q.getMany();
      const reply = new ListDto();
      reply.rows = rows;
      reply.count = count;

      return reply;
    }
    let wheres = '';
    if (listParams.filter && Object.keys(listParams.filter).length > 0) {
      for (const key in listParams.filter) {
        if (wheres) {
          wheres += ' AND ';
        }
        wheres += `"${key}" = :${key}`;
      }
    } else {
      wheres = '1=1';
    }
    wheres += generateUserFilter(listParams);
    const q = queryBuilder()
      .where(wheres, listParams.filter)
      .limit(listParams.limit || 10)
      .offset(listParams.offset || 0)
      .orderBy(`"${listParams.sort || 'id'}"`, listParams.sortDirectionIsAsc ? 'ASC' : 'DESC');
    console.log('sql', q.getSql());
    const rows = await q.getMany();
    console.log('rows?..', rows);
    const reply = new ListDto();
    reply.rows = rows;
    reply.count = count;
    return reply;
  }

  @Path('/crud/:entity/:id')
  @GET
  public async genericCrudGet(@PathParam('entity') entity: string, @PathParam('id') id: number): Promise<any> {
    const repo = await getTypeormManager().getRepository(entity);
    return repo.findOne(id);
  }

  @Path('/crud/:entity/:id')
  @DELETE
  public async genericCrudDelete(@PathParam('entity') entity: string, @PathParam('id') id: number): Promise<any> {
    const repo = await getTypeormManager().getRepository(entity);
    const record = await repo.findOne(id);
    if (!record) throw new Error('Not found');
    LogService.systemLog({
      user_id: (this.context.request as IRequestWithUser).user!.id,
      area: LOG_ACTIONS.FORM_CHANGE,
      action: 'DELETE',
      model: entity,
      id: id,
      readable: `Deleted ${entity} # ${id}`,
    });
    await repo.remove(record);
    return new SimpleResponseDto('ok');
  }

  @Path('/crud/:entity/:id')
  @PUT
  public async genericCrudUpdate(
    @PathParam('entity') entity: string,
    @PathParam('id') id: number,
    payload: any
  ): Promise<any> {
    const repo = await getTypeormManager().getRepository(entity);
    const record: any = await repo.findOne(id);
    if (!record) throw new Error('Not found');
    //    if (!(payload as any).sorter) (payload as any).sorter = await getNewSortId(entity);
    // console.log('UPD', payload.sorter);
    payload = verifyColumnTypes(payload, repo);
    Object.keys(payload).forEach((key) => {
      if (key === 'data') {
        if (!record.data) record.data = {};
        Object.keys(payload.data).forEach((keyData) => {
          record.data[keyData] = payload.data[keyData];
        });
      } else {
        record[key] = payload[key];
      }
    });
    LogService.systemLog({
      user_id: (this.context.request as IRequestWithUser).user!.id,
      area: LOG_ACTIONS.FORM_CHANGE,
      action: 'UPDATE',
      model: entity,
      id: id,
      readable: `Updated ${entity} # ${id}`,
      changes: payload,
    });
    await repo.save(record);
    return new SimpleResponseDto('ok');
  }

  @Path('/crud/:entity')
  @POST
  public async genericCrudCreate(@PathParam('entity') entity: string, payload: any): Promise<any> {
    const repo = await getTypeormManager().getRepository(entity);
    if (!(payload as any).sorter) (payload as any).sorter = await getNewSortId(entity);
    payload = verifyColumnTypes(payload, repo);
    const record = repo.create(payload);
    // suppose there should be 'data' field
    if (!(record as any).data) (record as any).data = {};
    const e: any = await repo.save(record);
    LogService.systemLog({
      user_id: (this.context.request as IRequestWithUser).user!.id,
      area: LOG_ACTIONS.FORM_CHANGE,
      action: 'CREATE',
      model: entity,
      id: e.id,
      readable: `Created ${entity} # ${e.id}`,
      changes: payload,
    });
    return e;
  }
}
