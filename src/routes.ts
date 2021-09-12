import express from 'express';
import AttendanceController from './controllers/AttendanceController';
import AttendanceUsersController from './controllers/AttendanceUsersController';
import ConditionsController from './controllers/ConditionsController';
import StatusAttendanceUsersControllers from './controllers/StatusAttendanceUsersControllers';
import UsersController from './controllers/UsersController';
import VersionController from './controllers/VersionController';

const routes = express.Router();
const usersControllers = new UsersController();
const attendanceControllers = new AttendanceController();
const attendanceUsersControllers = new AttendanceUsersController();
const conditionsControllers = new ConditionsController();
const statusControllers = new StatusAttendanceUsersControllers();
const version = new VersionController()

routes.get('/users', usersControllers.index);
routes.post('/users', usersControllers.create);

routes.get('/attendance', attendanceControllers.index);
routes.post('/attendance', attendanceControllers.create);

routes.get('/attendanceUsers', attendanceUsersControllers.index);
routes.get('/attendanceUsers/:idUser', attendanceUsersControllers.findByUser);
routes.post('/attendanceUsers', attendanceUsersControllers.create);
routes.patch('/attendanceUsers/:id', attendanceUsersControllers.updateStatusAttendanceUsers);

routes.get('/conditions', conditionsControllers.index);
routes.post('/conditions', conditionsControllers.create);

routes.get('/statusAttendanceUsers', statusControllers.index);

routes.get('/version', version.index);

export default routes;