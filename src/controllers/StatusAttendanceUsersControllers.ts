import { Request, Response } from 'express';
import db from '../database/connection';

export default class StatusAttendanceUsersControllers {
  async index(request: Request, response: Response) {
    const status = await db('status_attendance_users').select(['status_attendance_users.*']);
    response.json(status);
  }

  async verifiExists(idStatus: number) {
    const status = await db('status_attendance_users').where('id', '=', idStatus).select(['status_attendance_users.id']);
    return status;
  }

  async verifiExistsValue(value: string) {
    const status = await db('status_attendance_users').where('value', '=', value).select(['status_attendance_users.value']);
    return status;
  }
}