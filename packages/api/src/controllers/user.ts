import { Context, Path, GET, POST, PreProcessor, ServiceContext } from 'typescript-rest'; // Errors,
// import { Response } from 'typescript-rest-swagger';
// import { SessionDto } from '../../../models/dto/SessionDto';
// import { SimpleResponseDto } from '@pdeals/models/dto/SimpleResponseDto';
// import { UserDto } from '../../../models/dto/UserDto';
// import { IErrorResponse } from '../utils/error-types';
import { RequestPreProcess, RequestWithLogin } from '../utils/request-with-user'; // IRequestWithUser,
// import validator from '../lib/validator';
import { UserService } from '@pdeals/db/services/users.service';
import { User } from '@pdeals/models/entities/User';
import { ListDto, ListRequestDto } from '@pdeals/models/dto/ListDto';
// import { RoomUser } from '@pdeals/models/entities/RoomUser';
import usersService from '../services/usersService';
// import { MessageResponseDto } from '../../../models/dto/MessageResponseDto';

/*class AuthenticationError extends Errors.HttpError {
    constructor(message?: string, statusCode: number = 403) {
        super('AuthenticationError', message);
        this.statusCode = statusCode;
    }
}*/

@Path('/v1/user')
@PreProcessor(RequestPreProcess)
@PreProcessor(RequestWithLogin)
export class UserController {
  @Context
  public context: ServiceContext;

  @Path('/')
  @GET
  public async getUsers(): Promise<ListDto<User> | null> {
    const userService = new UserService();
    const result = new ListDto<User>();
    result.count = 1;
    result.rows = await userService.getAll();
    return result;
  }

  /**
   * Returns current session ID
   * @return <SessionDto> session
   */
  @Path('/')
  @POST
  public async addUser(data: User): Promise<User> {
    //        const req: IRequestWithUser = this.context.request as IRequestWithUser;
    // validator.validate(data, 'UserDto');
    const userService = new UserService();
    await userService.instantiate(data);
    console.log('?', data);
    try {
      const response = await userService.insert(data);
      return response;
    } catch (err) {
      // DB exception or some other exception while inserting user
      console.log('err :(', err);
      throw err;
    }
  }

  @Path('/list')
  @POST
  public async getUsersList(params: ListRequestDto): Promise<ListDto<any> | null> {
    const result = new ListDto<any>();
    result.rows = await usersService.getUserListing(params, false);
    result.count = await usersService.getUserListing(params, true);
    return result;
  }
}
