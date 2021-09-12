import { Request, Response } from 'express';
import db from '../database/connection';

export default class AttendanceController {
  async index(request: Request, response: Response) {
    const attendance = await db('attendances').select(['attendances.*']);
    response.json(attendance);
  }

  async attendanceForDay(request: Request, response: Response) {
    const attendance = await db('attendances').select(['attendances.*']);
    response.json(attendance);
  }

  async create(request: Request, response: Response) {
    const { dateHour } = request.body;
    const trx = await db.transaction();

    const nextAttendanceUsers = await trx.raw(
      'select coalesce(max(attendance_users_id), 0) + 1 as attendanceUsers from attendances',
    );

    const { attendanceUsers } = nextAttendanceUsers[0];
    console.log(attendanceUsers);
    try {
      await trx('attendances').insert({
        date_hour: dateHour,
        attendance_users_id: attendanceUsers,
      });

      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while creating new attendance: ' + err,
      });
    }
  }

  async verifiExists(idAttendance: Number) {
    const attendance = await db('attendances')
      .where('id', '=', idAttendance)
      .select(['attendances.id']);

    return attendance;
  }
}
