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
          error: 'Campos obrigatórios devem ser preenchidos'
        })
      }

      const duplicated = await this.verifiExistsCPForEmail(cpf, email)

      if (!duplicated) {
        return response.status(400).json({
          error: 'Já existe um usário com esse email ou cpf'
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
        error: 'Erro inesperado ao criar usuário ' + err
      })
    }
  }

  async verifiExists(idUser: Number) {
    const user = await db('users').where('id', '=', idUser).select(['users.id']);
    return user
  }

  async verifiExistsCPForEmail(cpf: string, email: string) {
    const user = await db('users')
                      .where('cpf', '=', cpf)
                      .orWhere('email', '=', email)
                      .select(['users.id']);
    return user
  }

}