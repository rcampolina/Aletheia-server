import db from "../database/connection";
import { Attendances } from "../models/AttendancesModel";

export default class AttendancesRepository {
  async findAll(): Promise<Attendances[]> {
    return await db('attendances').select(['attendances.*']);
  }

  async LastAttendanceUserID(): Promise<Attendances> {
    return await db('attendances').first(['attendances.attendance_users_id']).orderBy('attendance_users_id', 'desc').limit(1);
  }

  async create(attendances: Attendances) {
    const trx = await db.transaction();
    try {
      await trx('attendances').insert(attendances);
      await trx.commit();
      return attendances;
    } catch (err) {
      await trx.rollback();
      throw err
    }
  }

  async findId(idAttendance: Number): Promise<number> {
    return await db('attendances')
      .where('id', '=', idAttendance)
      .select(['attendances.id']);
  }

  async findById(idAttendance: Number): Promise<Attendances> {
    return await db('attendances')
      .where('id', '=', idAttendance)
      .select(['attendances.*']);
  }
  
}