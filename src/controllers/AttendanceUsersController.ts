import { Request, Response } from 'express';
import { AttendancesUsers } from '../models/AttendancesUsersModel';
import AttendancesRepository from '../repositories/AttendancesRepository';
import AttendancesUsersRepository from '../repositories/AttendancesUsersRepository';
import UsersRepository from '../repositories/UsersRepository';
import StatusAttendanceUsersControllers from './StatusAttendanceUsersControllers';
export default class AttendanceUsersController {
  async index(request: Request, response: Response) {
    const attendancesUsersRepository = new AttendancesUsersRepository();
    const attendances = await attendancesUsersRepository.findAll();
    response.json(attendances);
  }

  async findByUser(request: Request, response: Response) {
    const { idUser: user_id } = request.params;
    const attendancesUsersRepository = new AttendancesUsersRepository();
    const attendancesUsers = await attendancesUsersRepository.findByUser(Number(user_id));

    if (!attendancesUsers) {
      return response.status(400).json({
        method: 'findByUser',
        error: 'Atendimento não encontrado para usuário solicitado',
      });
    }

    response.json(attendancesUsers);
  }

  async create(request: Request, response: Response) {
    const attendanceUser: AttendancesUsers = request.body;
    try {
      const usersRepository = new UsersRepository();
      const existUser = await usersRepository.findId(Number(attendanceUser.user_id));

        if (existUser == 0) {
          return response.status(400).json({
            method: 'create',
            error: 'Usuário não encontrado',
          });
        }

      const attendancesRepository = new AttendancesRepository();    
      const existAttendance = await attendancesRepository.findId(attendanceUser.attendance_id);

      if (existAttendance == 0) {
        return response.status(400).json({
          method: 'create',
          error: 'Atendimento não cadastrado',
        });
      }

      const attendancesUsersRepository = new AttendancesUsersRepository()
      const created = await attendancesUsersRepository.create(attendanceUser)
      
      return response.status(201).json("Atendimento criado para o usuário");
    } catch (err) {
      return response.status(400).json({
        error: 'Unexpected error while creating new attendanceUser: ',
      });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const attendancesUser: AttendancesUsers = request.body;

      const usersRepository = new UsersRepository();
      const existUser = await usersRepository.findId(attendancesUser.user_id);

        if (existUser == 0) {
          return response.status(400).json({
            method: 'create',
            error: 'User not found',
          });
        }

      const attendancesRepository = new AttendancesRepository();
      const existAttendance = await attendancesRepository.findId(attendancesUser.attendance_id);

      if (existAttendance != 0) {
        return response.status(400).json({
          method: 'create',
          error: 'This attendance not exists',
        });
      }

      const attendancesUsersRepository = new AttendancesUsersRepository();
      await attendancesUsersRepository.delete(attendancesUser);

      return response.status(201).send();
    } catch (err) {
      return response.status(400).json({
        error: 'Erro inesperado ao remover usuário do atendimento',
      });
    }
  }

  async updateStatusAttendanceUsers(request: Request, response: Response) {
    const { id: idUser } = request.params;
    const { idStatus } = request.body;
    try {
      if (!idUser) {
        response.status(400).json({
          method: 'updateStatusAttendanceUsers',
          error: 'Id expected in params',
        });
      }

      const usersRepository = new UsersRepository();
      const existUser = await usersRepository.findId(Number(idUser));

      if (existUser == 0) {
        response.status(400).json({
          method: 'updateStatusAttendanceUsers',
          error: 'User not found',
        });
      }

      if (!idStatus) {
        response.status(400).json({
          method: 'updateStatusAttendanceUsers',
          error: 'Status não informado',
        });
      }

      const statusController = new StatusAttendanceUsersControllers();
      const existStatus = await statusController.verifiExists(Number(idStatus));

      if (!existStatus) {
        response.status(400).json({
          method: 'updateStatusAttendanceUsers',
          error: 'Status to update not found',
        });
      }

      // if user exsts and valid status then update
      const attendancesUsersRepository = new AttendancesUsersRepository();
      const attendanceUser = await attendancesUsersRepository.updateStatus(Number(idUser), idStatus);

      response.status(200).json(attendanceUser);
    } catch (err) {
      response.status(400).json({
        method: 'updateStatusAttendanceUsers',
        error: 'Error in update status attendance user',
      });
    }
  }

  async table(request: Request, response: Response) {
    const attendancesUsersRepository = new AttendancesUsersRepository();
    const table = await attendancesUsersRepository.table();

    response.json(table);
  }
  
}
