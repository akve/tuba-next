// import { UserDto } from './UserDto';
import { User } from '../entities/User';

class SessionDto {
    /** Total number of items fitting your search criteria */
    session: string;
    user?: User;
}

export { SessionDto };
