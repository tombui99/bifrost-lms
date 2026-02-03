export * from './auth.service';
import { AuthService } from './auth.service';
export * from './courses.service';
import { CoursesService } from './courses.service';
export * from './teacher.service';
import { TeacherService } from './teacher.service';
export const APIS = [AuthService, CoursesService, TeacherService];
