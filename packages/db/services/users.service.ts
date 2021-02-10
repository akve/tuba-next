import { getManager, Repository } from 'typeorm';
import { User } from '../../models/entities/User';

export class UserService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = getManager().getRepository(User);
  }

  /**
   * Creates an instance of User.
   */
  instantiate(data: Object): User | undefined {
    return this.userRepository.create(data);
  }

  /**
   * Inserts a new User into the database.
   */
  async insert(data: User): Promise<User> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  /**
   * Returns array of all users from db
   */
  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Returns a user by given id
   */
  async getById(id: string | number): Promise<User> {
    if (id) {
      return await this.userRepository.findOne(id);
    }
    return Promise.reject(false);
  }

  /**
   * Returns a user by email
   */
  async getByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :email OR user.email = :email', { email })
      .getOne();
  }

  /**
   * Updates a user
   */
  async update(user: User): Promise<User | undefined> {
    try {
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
