import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../core/auth/auth.service';
import { Router } from '@angular/router';
import { StudentProgressService } from '../api/api/studentProgress.service';
import { LanguageService } from '../core/language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RoutesService } from '../api/api/routes.service';
import { DepartmentsService } from '../api/api/departments.service';
import { RouteDto, DepartmentDto } from '../api/model/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="grow animate-fade-in">
      <!-- Teacher Section -->
      @if (authService.userRole() === 'Teacher') {
        <div class="mb-8">
          <h2
            class="text-xl font-bold text-gray-800 mb-4 flex items-center uppercase tracking-wide"
          >
            <span
              class="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-3 px-3 py-1 rounded-full shadow-sm"
              >{{ 'COMMON.MANAGEMENT' | translate }}</span
            >
            {{ 'COMMON.COURSES' | translate }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Course Management Widget -->
            <div
              (click)="navigateToCourseManagement()"
              class="bg-white overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-yellow-400 group active:scale-95"
            >
              <div class="p-6">
                <div class="flex items-center">
                  <div
                    class="shrink-0 bg-yellow-50 rounded-2xl p-4 group-hover:bg-yellow-100 transition-colors"
                  >
                    <svg
                      class="h-6 w-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.333 5.477 19 7.5 19s3.332.333 4.168.618m4.332 0c.835-.285 1.668-.618 4.168-.618 1.667 0 3.253.477 3.253.618v-13C19.832 5.477 18.246 5 16.5 5c-1.668 0-3.253.477-4.168.618"
                      />
                    </svg>
                  </div>
                  <div class="ml-5">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {{ 'COMMON.COURSES' | translate }}
                    </p>
                    <p class="text-lg font-black text-gray-900 leading-tight">
                      {{ 'COMMON.MANAGEMENT' | translate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Schedule Management Widget -->
            <div
              (click)="navigateToSchedule()"
              class="bg-white overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-yellow-400 group active:scale-95"
            >
              <div class="p-6">
                <div class="flex items-center">
                  <div
                    class="shrink-0 bg-yellow-50 rounded-2xl p-4 group-hover:bg-yellow-100 transition-colors"
                  >
                    <svg
                      class="h-6 w-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-5">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {{ 'DASHBOARD.SCHEDULE' | translate }}
                    </p>
                    <p class="text-lg font-black text-gray-900 leading-tight">
                      {{ 'COMMON.MANAGEMENT' | translate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Route Management Widget -->
            <div
              (click)="navigateToRouteManagement()"
              class="bg-white overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-indigo-400 group active:scale-95"
            >
              <div class="p-6">
                <div class="flex items-center">
                  <div
                    class="shrink-0 bg-indigo-50 rounded-2xl p-4 group-hover:bg-indigo-100 transition-colors"
                  >
                    <svg
                      class="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <div class="ml-5">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {{ 'ROUTE.TITLE' | translate }}
                    </p>
                    <p class="text-lg font-black text-gray-900 leading-tight">
                      {{ 'COMMON.MANAGEMENT' | translate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Department Management Widget -->
            <div
              (click)="navigateToDepartmentManagement()"
              class="bg-white overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-indigo-400 group active:scale-95"
            >
              <div class="p-6">
                <div class="flex items-center">
                  <div
                    class="shrink-0 bg-indigo-50 rounded-2xl p-4 group-hover:bg-indigo-100 transition-colors"
                  >
                    <svg
                      class="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div class="ml-5">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {{ 'DEPARTMENT.TITLE' | translate }}
                    </p>
                    <p class="text-lg font-black text-gray-900 leading-tight">
                      {{ 'COMMON.MANAGEMENT' | translate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Student Analytics Widget -->
            <div
              (click)="navigateToAnalytics()"
              class="bg-white overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-yellow-400 group active:scale-95"
            >
              <div class="p-6">
                <div class="flex items-center">
                  <div
                    class="shrink-0 bg-yellow-50 rounded-2xl p-4 group-hover:bg-yellow-100 transition-colors"
                  >
                    <svg
                      class="h-6 w-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-5">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {{ 'COMMON.ANALYTICS' | translate }}
                    </p>
                    <p class="text-lg font-black text-gray-900 leading-tight">
                      {{ 'DASHBOARD.STUDENT_PROGRESS' | translate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Admin Panel Widget -->
      @if (authService.userRole() === 'Admin' || authService.userRole() === 'TenantAdmin') {
        <div
          (click)="navigateToAdmin()"
          class="max-w-sm bg-indigo-900 overflow-hidden shadow-2xl shadow-indigo-200 rounded-3xl hover:shadow-indigo-300 transition-all duration-300 cursor-pointer border-t-4 border-indigo-400 group active:scale-95 translate-y-0 hover:-translate-y-2 mb-8"
        >
          <div class="p-6 relative">
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors"
            ></div>
            <div class="flex items-center relative z-10">
              <div class="shrink-0 bg-indigo-600 rounded-2xl p-4 shadow-lg ring-1 ring-white/20">
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">
                  Control Panel
                </p>
                <p class="text-lg font-black text-white leading-tight italic tracking-tight">
                  System Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Student Section -->
      @if (authService.userRole() === 'Student') {
        <!-- My Department Info -->
        <div
          class="flex items-center justify-between mb-8 bg-indigo-900/5 p-8 rounded-[40px] border border-indigo-100"
        >
          <div>
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">
              Your Department
            </h3>
            <p class="text-2xl font-black text-gray-900 italic">
              {{ myDepartment()?.name || 'No Department Assigned' }}
            </p>
          </div>
          <div
            class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>

        <!-- My Routes -->
        <div class="mb-10 animate-fade-in">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            @for (route of routes(); track $any(route.id)) {
              <div
                (click)="navigateToRoutes()"
                class="bg-white rounded-3xl p-8 shadow-xl border border-indigo-50/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-95"
              >
                <div class="relative z-10">
                  <div class="flex items-center gap-6 mb-6">
                    <div
                      class="shrink-0 bg-indigo-600 rounded-2xl p-4 shadow-lg ring-1 ring-white/20"
                    >
                      <svg
                        class="h-8 w-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-2xl font-black text-gray-900 leading-tight">
                        {{ route.name }}
                      </h3>
                      <p class="text-gray-500 line-clamp-1 italic">{{ route.description }}</p>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {{ 'DASHBOARD.PROGRESS' | translate }}
                      </span>
                      <span class="text-lg font-black text-indigo-600"
                        >{{ getRouteProgress(route) }}%</span
                      >
                    </div>
                    <div
                      class="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner p-1"
                    >
                      <div
                        class="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                        [style.width.%]="getRouteProgress(route)"
                      ></div>
                    </div>
                  </div>

                  <div class="mt-8 flex flex-wrap gap-3">
                    @for (rc of route.courses?.slice(0, 3); track rc.courseId) {
                      <div
                        class="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 text-xs font-bold border border-indigo-100"
                      >
                        {{ rc.courseTitle }}
                      </div>
                    }
                    @if ((route.courses?.length || 0) > 3) {
                      <div
                        class="bg-gray-50 px-4 py-2 rounded-xl text-gray-400 text-xs font-bold border border-gray-100"
                      >
                        +{{ (route.courses?.length || 0) - 3 }} {{ 'COMMON.MORE' | translate }}
                      </div>
                    }
                  </div>
                </div>

                <!-- Decorative Background Element -->
                <div
                  class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform"
                ></div>
              </div>
            }
          </div>
        </div>

        <!-- Overall Progress Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Widget: Schedule -->
          <div
            (click)="navigateToSchedule()"
            class="bg-white group overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 active:scale-95"
          >
            <div class="p-6">
              <div
                class="flex items-center justify-center mb-4 bg-indigo-50 w-16 h-16 rounded-2xl mx-auto group-hover:bg-indigo-100 transition-colors"
              >
                <svg
                  class="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div class="text-center">
                <h3 class="text-lg font-bold text-gray-900">
                  {{ 'DASHBOARD.SCHEDULE' | translate }}
                </h3>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {{ 'DASHBOARD.VIEW_CLASSES' | translate }}
                </p>
              </div>
            </div>
          </div>

          <!-- Widget: Courses -->
          <div
            (click)="navigateToStudentCourses()"
            class="bg-white group overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 active:scale-95"
          >
            <div class="p-6">
              <div
                class="flex items-center justify-center mb-4 bg-indigo-50 w-16 h-16 rounded-2xl mx-auto group-hover:bg-indigo-100 transition-colors"
              >
                <svg
                  class="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.333 5.477 19 7.5 19s3.332.333 4.168.618m4.332 0c.835-.285 1.668-.618 4.168-.618 1.667 0 3.253.477 3.253.618v-13C19.832 5.477 18.246 5 16.5 5c-1.668 0-3.253.477-4.168.618"
                  />
                </svg>
              </div>
              <div class="text-center">
                <h3 class="text-lg font-bold text-gray-900">
                  {{ 'COMMON.COURSES' | translate }}
                </h3>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {{ 'DASHBOARD.ACTIVE_COURSES' | translate }}
                </p>
              </div>
            </div>
          </div>

          <!-- Widget: Forum -->
          <div
            class="bg-white group overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 active:scale-95"
          >
            <div class="p-6">
              <div
                class="flex items-center justify-center mb-4 bg-indigo-50 w-16 h-16 rounded-2xl mx-auto group-hover:bg-indigo-100 transition-colors"
              >
                <svg
                  class="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <div class="text-center">
                <h3 class="text-lg font-bold text-gray-900">
                  {{ 'DASHBOARD.FORUM' | translate }}
                </h3>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {{ 'DASHBOARD.DISCUSSION' | translate }}
                </p>
              </div>
            </div>
          </div>

          <!-- Widget: Resources -->
          <div
            class="bg-white group overflow-hidden shadow-lg shadow-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 active:scale-95"
          >
            <div class="p-6">
              <div
                class="flex items-center justify-center mb-4 bg-indigo-50 w-16 h-16 rounded-2xl mx-auto group-hover:bg-indigo-100 transition-colors"
              >
                <svg
                  class="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <div class="text-center">
                <h3 class="text-lg font-bold text-gray-900">
                  {{ 'DASHBOARD.LIBRARY' | translate }}
                </h3>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {{ 'DASHBOARD.RESOURCES' | translate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthenticationService);
  studentProgressService = inject(StudentProgressService);
  routesService = inject(RoutesService);
  departmentsService = inject(DepartmentsService);
  public languageService = inject(LanguageService);
  private router = inject(Router);

  overallProgress = signal<number | null>(null);
  routes = signal<RouteDto[]>([]);
  myDepartment = signal<DepartmentDto | null>(null);
  courseProgressMap = new Map<number, number>();

  ngOnInit() {
    if (this.authService.userRole() === 'Student') {
      this.loadOverallProgress();
      this.loadMyRoutes();
      this.loadMyDepartment();
    }
  }

  loadOverallProgress() {
    this.studentProgressService.apiStudentProgressCoursesGet().subscribe({
      next: (courses) => {
        courses.forEach((c) => {
          if (c.courseId !== undefined) {
            this.courseProgressMap.set(
              c.courseId as any as number,
              (c.progressPercentage as any) || 0,
            );
          }
        });

        if (courses.length > 0) {
          const total = courses.reduce((acc, course) => {
            const progress = course.progressPercentage as any as number;
            return acc + (progress || 0);
          }, 0);
          this.overallProgress.set(Math.round(total / courses.length));
        } else {
          this.overallProgress.set(0);
        }
      },
      error: (err) => {
        console.error('Error loading overall progress:', err);
      },
    });
  }

  loadMyRoutes() {
    this.routesService.apiRoutesMyGet().subscribe({
      next: (data) => {
        this.routes.set(data);
      },
      error: (err) => {
        console.error('Error loading routes:', err);
      },
    });
  }

  loadMyDepartment() {
    this.departmentsService.apiDepartmentsMyGet().subscribe({
      next: (data) => {
        this.myDepartment.set(data);
      },
      error: (err) => {
        console.error('Error loading department:', err);
      },
    });
  }

  getRouteProgress(route: RouteDto): number {
    if (!route.courses || route.courses.length === 0) return 0;
    const totalProgress = route.courses.reduce((acc, rc) => {
      return acc + (this.courseProgressMap.get(rc.courseId as any as number) || 0);
    }, 0);
    return Math.round(totalProgress / route.courses.length);
  }

  navigateToCourseManagement() {
    this.router.navigate(['/courses/manage']);
  }

  navigateToAnalytics() {
    this.router.navigate(['/teacher/analytics']);
  }

  navigateToStudentCourses() {
    this.router.navigate(['/student/courses']);
  }

  navigateToRouteManagement() {
    this.router.navigate(['/routes/manage']);
  }

  navigateToRoutes() {
    this.router.navigate(['/student/routes']);
  }

  navigateToDepartmentManagement() {
    this.router.navigate(['/departments/manage']);
  }

  navigateToSchedule() {
    if (this.authService.userRole() === 'Teacher' || this.authService.userRole() === 'Admin') {
      this.router.navigate(['/teacher/schedules']);
    } else {
      this.router.navigate(['/student/schedule']);
    }
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }
}
