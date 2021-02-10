import * as express from 'express';
import { getUserIdFromToken } from '../lib/authHandler';
import { User } from '@pdeals/models/entities/User';
import { UserService } from '../../../db/services/users.service';
import { Errors } from 'typescript-rest';

class AuthError extends Errors.HttpError {
  constructor(message?: string, statusCode: number = 401) {
    super('AuthError', message);
    this.statusCode = statusCode;
  }
}

const SESSION_COOKIE_NAME = 'pp_session';
interface IRequestWithUser extends express.Request {
  user?: User | null;
  sessionId?: string;
}

function RequestPreProcess(_req: express.Request): IRequestWithUser {
  const req: IRequestWithUser = _req as IRequestWithUser;
  req.user = null; // this is tbd with JWT
  if (req.cookies && req.cookies[SESSION_COOKIE_NAME]) {
    req.sessionId = req.cookies[SESSION_COOKIE_NAME];
  }
  if (req.headers && req.headers['authorization']) {
    req.sessionId = `${req.headers['authorization']}`;
  }
  // console.log('Cookies', req.sessionId);
  return req;
}

async function RequestWithLogin(_req: express.Request, _res: express.Response): Promise<IRequestWithUser> {
  const req: IRequestWithUser = _req as IRequestWithUser;
  if (req.sessionId) {
    try {
      const userId = getUserIdFromToken(req.sessionId);
      req.user = await new UserService().getById(userId);
    } catch (e) {
      console.log('error happens');
    }
  } else {
    req.user = null;
  }
  if (!req.user) {
    throw new AuthError('Unauthorized');
    // _res.status(401).send({ error: 'Unauthorized' });
  }
  // console.log('Cookies', req.sessionId);
  return req;
}

export { SESSION_COOKIE_NAME, IRequestWithUser, RequestPreProcess, RequestWithLogin };
