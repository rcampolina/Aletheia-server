import { Request, Response } from 'express';
import db from '../database/connection';

export default class UsersController {
  async index(request: Request, response: Response) {
    const users = await db('users').select(['users.*']);

    response.json(users);
  }  
  
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      phone,
      whatsapp,
      cpf,
      birthDate,
      adress,
      condition,
      observations
    } = request.body;
  
    const trx = await db.transaction();
  
    try {
      if ( 
        name == undefined || name == '' ||
        email == undefined || email == '' ||
        whatsapp == undefined || whatsapp == '' ||
        cpf == undefined || cpf == '' ||
        birthDate == undefined || birthDate == ''
      ) {
        return response.status(400).json({
          error: 'Obrigatory filds must be value: '
        })
      }
      await trx('users').insert({
        name,
        email,
        phone,
        whatsapp,
        cpf,
        birthDate,
        adress,
        condition,
        observations
      });
    
      await trx.commit();  
      return response.status(201).send();
  
    } catch (err) {
      
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while creating new user: ' + err
      })
    }
  }

  async verifiExists(idUser: Number) {
    const user = await db('users').where('id', '=', idUser).select(['users.id']);

    return user
  }  
}