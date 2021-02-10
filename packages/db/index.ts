import { UserService } from './services/users.service';
import { createConnection, getManager, getConnection } from 'typeorm';

export const services = {
  UserService,
};

export const createTypeormConnection = createConnection;
export const getTypeormManager = getManager;
export const getTypeormConnection = getConnection;
