import { Context, GET, Path, POST, Errors, PreProcessor, ServiceContext, PathParam } from 'typescript-rest'; // Errors,
import { Response } from 'typescript-rest-swagger';
import { SessionDto } from '@pdeals/models/dto/SessionDto';
import { SimpleResponseDto } from '@pdeals/models/dto/SimpleResponseDto';
import { LoginRequestDto } from '@pdeals/models/dto/UserDto';
import { IErrorResponse } from '../utils/error-types';
import { RequestPreProcess, RequestWithLogin, IRequestWithUser } from '../utils/request-with-user'; // IRequestWithUser,
import validator from '../lib/validator';
// import { MessageResponseDto } from '../../../models/dto/MessageResponseDto';
import { generateToken } from '../lib/authHandler';
import * as bcrypt from 'bcryptjs';
import { UserService } from '@pdeals/db/services/users.service';
import { User } from '@pdeals/models/entities/User';
import {LogService, LOG_ACTIONS} from "@pdeals/db/services/log.service";

class AuthenticationError extends Errors.HttpError {
  constructor(message?: string, statusCode: number = 403) {
    super('AuthenticationError', message);
    this.statusCode = statusCode;
  }
}

@Path('/v1/auth')
@PreProcessor(RequestPreProcess)
export class AuthController {
  @Context
  public context: ServiceContext;

  /**
   * Returns current session ID
   * @return <SessionDto> session
   */
  @Path('/me')
  @GET
  public async getSession(): Promise<SessionDto> {
    await RequestWithLogin(this.context.request, this.context.response);
    const req: IRequestWithUser = this.context.request as IRequestWithUser;
    // req;
    //        validator.validate(data, 'SessionDto');
    const user: User = await new UserService().getByEmail(req.user.email);
    // user.lastLogin = new Date(); // update last login because o
    // await user.save();
    const session = new SessionDto();
    session.session = req.sessionId;
    session.user = user;
    return session;
  }

  /**
   * Logs in the user
   * @return <UserDto> user data
   */
  @Path('/login')
  @Response<IErrorResponse>(403, 'The user is unauthorized.', {
    error: {
      name: 'AuthenticationError',
      message: 'Wrong username/password',
    },
  })
  @POST
  public async doLogin(loginData: LoginRequestDto): Promise<SessionDto> {
    validator.validate(loginData, 'LoginRequestDto');
    const userService = new UserService();
    const user: User = await userService.getByEmail(loginData.username);
    if (!user) {
      throw new AuthenticationError('Wrong username/password');
    }
    const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password);
    if (isPasswordCorrect) {
      user.lastLogin = new Date();
      await user.save();
      const token = generateToken(user);
      LogService.systemLog({user_id: user.id, area: LOG_ACTIONS.SECURITY, action: 'LOGIN', readable:'Logged in' })
      return {
        session: token,
        user: user,
      };
    } else {
      throw new AuthenticationError('Wrong username/password');
    }
  }

  @Path('/logout')
  @POST
  public async doLogout(): Promise<SimpleResponseDto> {
    // const req: IRequestWithUser = this.context.request as IRequestWithUser;
    return new SimpleResponseDto('ok');
  }

  @Path('/loginas/:id')
  @GET
  public async loginAs(@PathParam('id') id: number): Promise<SessionDto> {
    const userService = new UserService();
    const user: User = await userService.getById(id);
    if (!user) {
      throw new AuthenticationError('Wrong username/password');
    }
    const token = generateToken(user);
    return {
      session: token,
      user: user,
    };
  }
}
