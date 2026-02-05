import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { LessonEditComponent } from './lesson-edit/lesson-edit.component';
import { authGuard } from './core/auth/auth.guard';
import { teacherGuard } from './core/auth/teacher.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  {
    path: 'courses/manage',
    component: CourseManagementComponent,
    canActivate: [authGuard, teacherGuard],
  },
  {
    path: 'teacher/analytics',
    loadComponent: () =>
      import('./teacher-analytics/teacher-analytics.component').then(
        (m) => m.TeacherAnalyticsComponent,
      ),
    canActivate: [authGuard, teacherGuard],
  },
  {
    path: 'courses/:courseId/lessons/add',
    component: LessonEditComponent,
    canActivate: [authGuard, teacherGuard],
  },
  {
    path: 'courses/:courseId/lessons/:lessonId/edit',
    component: LessonEditComponent,
    canActivate: [authGuard, teacherGuard],
  },
  {
    path: 'courses/:courseId/quiz/manage',
    loadComponent: () => import('./quiz-edit/quiz-edit.component').then((m) => m.QuizEditComponent),
    canActivate: [authGuard, teacherGuard],
  },
  {
    path: 'student/courses',
    loadComponent: () =>
      import('./student-courses/student-courses.component').then((m) => m.StudentCoursesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'student/courses/:courseId',
    loadComponent: () =>
      import('./student-course-detail/student-course-detail.component').then(
        (m) => m.StudentCourseDetailComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'student/courses/:courseId/quiz/:quizId',
    loadComponent: () =>
      import('./student-quiz/student-quiz.component').then((m) => m.StudentQuizComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: '**', redirectTo: 'dashboard' },
];
