import { getManager, Repository } from 'typeorm';
import { Log } from '../../models/entities/Log';

export interface IAddLogParameters {
    area: string;
    action: string;
    readable: string;
    user_id?: number;
    model?: string;
    id?: number;
    changes?: any;
}

export const LOG_ACTIONS = {
    CRAWLER: 'CRAWLER',
    FORM_CHANGE: 'FORM_CHANGE',
    EMAIL: 'EMAIL',
    SECURITY: 'SECURITY'
}

export class LogService {
    constructor() {
    }


    /**
     * Inserts a new User into the database.
     */
    static async systemLog(params: IAddLogParameters): Promise<any> {
        const repo:Repository<Log> = getManager().getRepository(Log);
        const data = {
            to_id: params.id,
            to_model: params.model,
            area: params.area,
            action: params.action,
            readable: params.readable,
            from_user_id: params.user_id || 0,
            data: {changes: params.changes},
        };
        const newData = repo.create(data);
        return await repo.save(newData);
    }

}
