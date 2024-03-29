import { Request, Response } from 'express';
import db from '../database/connection';
import AttendanceController from './AttendanceController';
import StatusAttendanceUsersControllers from './StatusAttendanceUsersControllers';
import UsersController from './UsersController';

export default class AttendanceUsersController {
  async index(request: Request, response: Response) {
    const attendanceUsers = await db('attendanceUsers').select(['attendanceUsers.*']);

    response.json(attendanceUsers);
  }

  async findByUser(request: Request, response: Response) {
    const { idUser } = request.params;
    const attendanceUser = await db('attendanceUsers')
      .where('user_id', '=', idUser)
      .select(['attendanceUsers.*']);

    response.json(attendanceUser);
  }

  async create(request: Request, response: Response) {
    const { attendance_id, user_id } = request.body;

    const usersController = new UsersController();
    const existUser = await usersController.verifiExists(Number(user_id));

    console.log(existUser);
      if (existUser.length === 0) {
        return response.status(400).json({
          method: 'create',
          error: 'User not found',
        });
      }

    const attendanceController = new AttendanceController();
    const existAttendance = await attendanceController.verifiExists(Number(attendance_id));

    console.log(existAttendance);
    if (existAttendance.length === 0) {
      return response.status(400).json({
        method: 'create',
        error: 'This attendance not exists',
      });
    }

    const trx = await db.transaction();

    try {
      await trx('attendanceUsers').insert({
        attendance_id,
        user_id,
      });

      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while creating new attendanceUser: ',
      });
    }
  }

  async usersAttendance(request: Request, response: Response) {
    const attendanceUsers = await db('attendanceUsers').select(['attendanceUsers.*']);

    response.json(attendanceUsers);
  }

  async updateStatusAttendanceUsers(request: Request, response: Response) {
    const { id: idUser } = request.params;
    const { idStatus } = request.body;

    if (!idUser) {
      response.status(400).json({
        method: 'updateStatusAttendanceUsers',
        error: 'Id expected in params',
      });
    }

    const usersController = new UsersController();
    const existUser = usersController.verifiExists(Number(idUser));

    if (await existUser) {
      response.status(400).json({
        method: 'updateStatusAttendanceUsers',
        error: 'User not found',
      });
    }

    const statusController = new StatusAttendanceUsersControllers();
    const existStatus = statusController.verifiExists(Number(idStatus));

    if (!existStatus) {
      response.status(400).json({
        method: 'updateStatusAttendanceUsers',
        error: 'Status to update not found',
      });
    }

    // if user exsts and valid status then update

    try {
      const attendanceUser = await db('attendanceUsers').where('id', '=', idUser).update({
        status_id: idStatus,
      });

      response.status(200).json(attendanceUser);
    } catch (err) {
      response.status(400).json({
        method: 'updateStatusAttendanceUsers',
        error: 'Error in update status attendance user',
      });
    }
  }

  // async verifiExistsAttendanceId(idAttendanceId: Number) {
  //   const attendanceUser = await db('attendanceUsers').where('attendance_id', '=', idAttendanceId).select(['attendanceUsers.id']);

  //   return attendanceUser
  // }
}
