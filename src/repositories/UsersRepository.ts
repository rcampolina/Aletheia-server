import db from '../database/connection';
import { Users } from '../models/UsersModel';

export default class UsersRepository {
  async findAll(): Promise<Users[]> {
    return await db('users').select(['users.*']);
  }

  async create(user: Users): Promise<Users> {
    const trx = await db.transaction();

    try {
      console.log(this)
      await trx('users').insert(user);    
      await trx.commit();

      return user;
  
    } catch (err) {
      
      await trx.rollback();
      throw err
    }
  }

  async findId(idUser: Number): Promise<number> {
    return await db('users').where('id', '=', idUser).select(['users.id']);
  }

  async findIdByCPForEmail(cpf: string, email: string): Promise<number> {
    return await db('users').where('cpf', '=', cpf).orWhere('email', '=', email).select(['users.id']);
  }
}
