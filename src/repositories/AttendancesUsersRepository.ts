import { raw } from "express";
import db from "../database/connection";
import { AttendancesUsers } from "../models/AttendancesUsersModel";
import { Users } from "../models/UsersModel";

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
      
      await db('attendanceUsers').where('id', '=', idUser).update({status_id: status_id});
      await trx.commit();

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
    // const table = await db('attendanceUsers')
    //                     .select([
    //                       'users.*',
    //                       'attendanceUsers.*',
    //                       'attendances.date_hour',
    //                       'status_attendance_users.label as status',
    //                       db.raw('extract(Years from age(users."birthDate") ) as age'),
    //                       db.raw("case when first_attendance = true then 'Sim' else 'Não' end first_attendance"),
    //                       db.raw('substring(adress, 1, 10) as adress')
    //                     ])
    //                     .rightJoin('users', 'users.id', 'attendanceUsers.user_id')
    //                     .leftJoin('attendances', 'attendances.id', 'attendanceUsers.attendance_id')
    //                     .leftJoin('status_attendance_users', 'status_attendance_users.id', 'attendanceUsers.status_id')
    //                     .where('attendances.id', '=', 3)
    //                     .orWhereNull('attendances.id');

    const status = await db('status_attendance_users').select(['status_attendance_users.label']);
    const users: Users[] = await db('users').select([
                            'users.*',
                            db.raw('extract(Years from age(users."birthDate") ) as age'),
                            db.raw("case when first_attendance = true then 'Sim' else 'Não' end first_attendance"),
                            db.raw('substring(adress, 1, 10) as adress')
                          ]);
                          
    const Firststatus = await db('status_attendance_users').first(['status_attendance_users.label']);
    const table = await Promise.all(users.map( async(user: Users) => {
      let status;
      
      status = await db('status_attendance_users')
                          .select(['status_attendance_users.label'])
                          .innerJoin('attendanceUsers', 'attendanceUsers.status_id', 'status_attendance_users.id')
                          .where('attendanceUsers.user_id', '=', user.id);
      
      if (status.length == 0)
        status.push(Firststatus);

      
      return {...user, status};
    }));
    return table;
  }
}