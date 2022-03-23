import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({user_id,}: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where:{
        id: user_id
      },
      relations: ["games"]
    });
    
    if(user) {
      return user
    }
    
    return undefined

  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query('SELECT * FROM Users AS u WHERE lower(u.first_name) = lower($1) And lower(u.last_name) = lower($2)', [first_name, last_name]);
  }
}
