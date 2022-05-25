import { Adress } from './../models/AdressModel';
import { Request, Response } from 'express';
import { Users } from '../models/UsersModel';
import UsersRepository from '../repositories/UsersRepository';
import AdressRepository from '../repositories/AdressRepository';
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
      cpf,
      adress,
    } = request.body;

    let user: Users = request.body
    let addAdress: Adress = adress
    delete user.adress

    try {
      if ( 
        name == undefined || name == '' ||
        phone == undefined || phone == ''
      )
      {
        return response.status(400).json({
          error: 'Campos obrigatórios devem ser preenchidos'
        })
      }

      const usersRepository = new UsersRepository();
      const duplicated = await usersRepository.findIdByCPForEmail(cpf, email)

      if (duplicated != undefined) {
        return response.status(400).json({
          error: 'Já existe um usário com esse email ou cpf'
        }) 
      }

      const created = await usersRepository.create(user);
      
      if (addAdress.street != undefined && addAdress.street != '') {
        addAdress.user_id = created.id
        const adressRepository = new AdressRepository();
        const createdAdress = await adressRepository.create(adress);

        created.adress = createdAdress
      }

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
