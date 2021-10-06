import { Attendances } from './../models/AttendancesModel';
import { Request, Response } from 'express';
import db from '../database/connection';
import AttendancesUsersRepository from '../repositories/AttendancesUsersRepository';
import AttendancesRepository from '../repositories/AttendancesRepository';

export default class AttendanceController {
  async index(request: Request, response: Response) {
    const attendancesRepository = new AttendancesRepository();
    const attendances = await attendancesRepository.findAll();
    response.json(attendances);
  }

  async attendanceForDay(request: Request, response: Response) {
    const attendance = await db('attendances').select(['attendances.*']);
    response.json(attendance);
  }

  async create(request: Request, response: Response) {
    let attendances: Attendances = request.body;
    try {
      const attendancesRepository = new AttendancesRepository();
      const lastId: Attendances = await attendancesRepository.LastAttendanceUserID();

      if (!lastId)
        attendances.attendance_users_id = 1;
      else
        attendances.attendance_users_id = lastId.attendance_users_id + 1;

      const created = await attendancesRepository.create(attendances);

      return response.status(201).json(created);
    } catch (err) {
      return response.status(400).json({
        error: 'Erro inesperado ao criar usuário: ' + err,
      });
    }
  }
}
