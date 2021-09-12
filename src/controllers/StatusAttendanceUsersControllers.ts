import { Request, Response } from 'express';
import db from '../database/connection';

export default class StatusAttendanceUsersControllers {
  async index(request: Request, response: Response) {
    const status = await db('status_attendance_users').select(['status_attendance_users.*']);
    response.json(status);
  }

  async verifiExists(idStatus: Number) {
    const status = await db('status_attendance_users').where('id', '=', idStatus).select(['status_attendance_users.id']);
    return status;
  }
}