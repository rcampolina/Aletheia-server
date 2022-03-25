import db from '../database/connection';
import { Adress } from '../models/AdressModel';

export default class AdressRepository {
  async findAll(): Promise<Adress[]> {
    return await db('adress').select(['users.*']);
  }

  async create(adress: Adress): Promise<Adress> {
    const trx = await db.transaction();

    try {
      console.log(this)
      await trx('adress').insert(adress);    
      await trx.commit();

      return adress;
  
    } catch (err) {
      
      await trx.rollback();
      throw err
    }
  }

  async findId(idAdress: Number): Promise<number> {
    return await db('adress').where('id', '=', idAdress).select(['adress.id']);
  }

  async findIdByUser(userId: Number): Promise<number> {
    return await db('adress').where('user_id', '=', userId).select(['adress.id']);
  }
}
