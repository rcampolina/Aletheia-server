import db from "../database/connection";
import { AttendancesUsers } from "../models/AttendancesUsersModel";

export default class AttendancesUsersRepository {
  async findAll(): Promise<AttendancesUsers[]> {
    return await db('attendanceUsers').select(['attendanceUsers.*']);
  }

  async findByUser(idUser: number): Promise<AttendancesUsers> {
    return await db('attendanceUsers')
      .where('user_id', '=', idUser)
      .select(['attendanceUsers.*']);
  }

  async updateStatus(idUser: number, status_id: number) {
    const trx = await db.transaction();
    try {
      const updated = await db('attendanceUsers').where('id', '=', idUser).update({status_id: status_id});
      await trx.commit();
      
      return updated;

    } catch (err) {
      await trx.rollback();
      throw err
    }
  }

  async create(attendanceUser: AttendancesUsers) {
    const trx = await db.transaction();
    try {
      
      const created = await trx('attendanceUsers').insert(attendanceUser);
      await trx.commit();

      return created;

    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async delete(attendanceUser: AttendancesUsers): Promise<void> {
    const trx = await db.transaction();
    try {
      await trx('attendanceUsers')
            .delete()
            .where('attendance_id', '=', attendanceUser.attendance_id)
            .andWhere('user_id', '=', attendanceUser.user_id);

      await trx.commit();
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async table() {
    const table = await db('attendanceUsers')
                        .select([
                          'users.*',
                          'attendanceUsers.*',
                          'attendances.*'
                        ])
                        .join('users', 'users.id', 'attendanceUsers.user_id')
                        .join('attendances', 'attendances.id', 'attendanceUsers.attendance_id');
    return table;
  }
}