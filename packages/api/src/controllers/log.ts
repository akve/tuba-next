import { Context, Path, POST, PreProcessor, ServiceContext } from 'typescript-rest'; // Errors,
// import { Response } from 'typescript-rest-swagger';
// import { SessionDto } from '../../../models/dto/SessionDto';
// import { SimpleResponseDto } from '@pdeals/models/dto/SimpleResponseDto';
// import { UserDto } from '../../../models/dto/UserDto';
// import { IErrorResponse } from '../utils/error-types';
import { RequestPreProcess, RequestWithLogin } from '../utils/request-with-user'; // IRequestWithUser,
// import validator from '../lib/validator';
import { ListDto, ListRequestDto } from '@pdeals/models/dto/ListDto';
import { userNameSqlFragment } from '@pdeals/db/utils/userNameSqlFragment';
import generateUserFilter from '../utils/generateUserFilter';
import { getTypeormConnection } from '@pdeals/db';
import { LOG_ACTIONS } from '@pdeals/db/services/log.service';


@Path('/v1/log')
@PreProcessor(RequestPreProcess)
@PreProcessor(RequestWithLogin)
export class LogController {
    @Context
    public context: ServiceContext;

    public async getLogsList(listParams: ListRequestDto, isCount: boolean): Promise<any> {
        const fields = `
        log.*, 
        ${userNameSqlFragment()}
        `;
        let sort = 'id desc';
        if (listParams.sort) {
            sort = listParams.sort;
            sort += listParams.sortDirectionIsAsc ? ' asc' : ' desc';
        }
        let sql = `
        select [FIELDS] from log  
        LEFT JOIN "user" u on log.from_user_id = u.id
        where [WHERE]
        [ORDER]
        LIMIT ${listParams.limit || 10}
        OFFSET ${isCount ? 0 : listParams.offset || 0}
      `;
        let where = '1=1';
        where += generateUserFilter(listParams);
        sql = sql.replace('[WHERE]', where);
        console.log(sql);
        if (isCount) {
            const count = await getTypeormConnection().query(sql.replace('[FIELDS]', 'count(*) count').replace('[ORDER]', ``));
            return parseInt(count[0].count || '0');
        }
        const rows = await getTypeormConnection().query(
            sql.replace('[FIELDS]', fields).replace('[ORDER]', `ORDER BY ${sort}`)
        );
        return rows;
    };

    @Path('/')
    @POST
    public async getLogs(listParams: ListRequestDto): Promise<ListDto<any> | null> {
        const result = new ListDto<any>();
        result.rows = await this.getLogsList(listParams, false);
        result.count = await this.getLogsList(listParams, true);
        return result;
    }

    @Path('/areas_lookup')
    @POST
    public async getAreas(): Promise<any> {
        const lookups = [
            {
                id: LOG_ACTIONS.SECURITY,
                name: 'Security'
            },
            {
                id: LOG_ACTIONS.CRAWLER,
                name: 'Crawler'
            },
            {
                id: LOG_ACTIONS.FORM_CHANGE,
                name: 'Data changes'
            },
            {
                id: LOG_ACTIONS.EMAIL,
                name: 'Emails'
            }
        ];
        const result = new ListDto<any>();
        result.rows = lookups;
        result.count = lookups.length;
        return result;
    }
}
