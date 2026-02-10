import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { LessonEditComponent } from './lesson-edit/lesson-edit.component';
import { authGuard } from './core/auth/auth.guard';
import { teacherGuard } from './core/auth/teacher.guard';
import { adminGuard } from './core/auth/admin.guard';

import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'courses/manage',
        component: CourseManagementComponent,
        canActivate: [teacherGuard],
      },
      {
        path: 'teacher/analytics',
        loadComponent: () =>
          import('./teacher-analytics/teacher-analytics.component').then(
            (m) => m.TeacherAnalyticsComponent,
          ),
        canActivate: [teacherGuard],
      },
      {
        path: 'courses/:courseId/lessons/add',
        component: LessonEditComponent,
        canActivate: [teacherGuard],
      },
      {
        path: 'courses/:courseId/lessons/:lessonId/edit',
        component: LessonEditComponent,
        canActivate: [teacherGuard],
      },
      {
        path: 'courses/:courseId/quiz/manage',
        loadComponent: () =>
          import('./quiz-edit/quiz-edit.component').then((m) => m.QuizEditComponent),
        canActivate: [teacherGuard],
      },
      {
        path: 'student/courses',
        loadComponent: () =>
          import('./student-courses/student-courses.component').then(
            (m) => m.StudentCoursesComponent,
          ),
      },
      {
        path: 'student/courses/:courseId',
        loadComponent: () =>
          import('./student-course-detail/student-course-detail.component').then(
            (m) => m.StudentCourseDetailComponent,
          ),
      },
      {
        path: 'student/courses/:courseId/quiz/:quizId',
        loadComponent: () =>
          import('./student-quiz/student-quiz.component').then((m) => m.StudentQuizComponent),
      },
      {
        path: 'student/schedule',
        loadComponent: () =>
          import('./student-schedule/student-schedule.component').then(
            (m) => m.StudentScheduleComponent,
          ),
      },
      {
        path: 'teacher/schedules',
        loadComponent: () =>
          import('./teacher-schedule-management/teacher-schedule-management.component').then(
            (m) => m.TeacherScheduleManagementComponent,
          ),
        canActivate: [teacherGuard],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/user-management.component').then((m) => m.UserManagementComponent),
      },
      {
        path: 'tenants',
        loadComponent: () =>
          import('./admin/tenant-management.component').then((m) => m.TenantManagementComponent),
      },
      {
        path: 'content',
        loadComponent: () =>
          import('./admin/content-management.component').then((m) => m.ContentManagementComponent),
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
