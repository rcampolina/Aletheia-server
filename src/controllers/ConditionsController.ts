import { Request, Response } from 'express';
import db from '../database/connection';

export default class ConditionsController {
  async index(request: Request, response: Response) {
    const conditions = await db('conditions').select(['conditions.*']);
    response.json(conditions);
  }  
  
  async create(request: Request, response: Response) {
    const {
      value,
      label
    } = request.body;
  
    const trx = await db.transaction();
  
    try {
      await trx('conditions').insert({
        value,
        label
      });
    
      await trx.commit();  
      return response.status(201).send();
  
    } catch (err) {
      
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while creating new condition: ' + err
      })
    }
  }

  async verifiExists(idCondition: Number) {
    const condition = await db('conditions').where('id', '=', idCondition).select(['conditions.id']);
    return condition
  }  
}