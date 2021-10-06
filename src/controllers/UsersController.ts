import { Request, Response } from 'express';
import { Users } from '../models/UsersModel';
import UsersRepository from '../repositories/UsersRepository';
export default class UsersController {
  async index(request: Request, response: Response) {
    const usersRepository = new UsersRepository();
    const users = await usersRepository.findAll();
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

    let user: Users = request.body

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

      const usersRepository = new UsersRepository();
      const duplicated = await usersRepository.findIdByCPForEmail(cpf, email)

      if (duplicated != 0) {
        return response.status(400).json({
          error: 'Já existe um usário com esse email ou cpf'
        }) 
      }

      const created = await usersRepository.create(user);

      if (created)
        return response.status(201).json({
          message: 'Usuário Criado com sucesso!'
        });
  
    } catch (err) {
      return response.status(400).json({
        error: 'Erro inesperado ao criar usuário ' + err
      })
    }
  }

  

}