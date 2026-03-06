import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RoutesService } from '../api/api/routes.service';
import { CoursesService } from '../api/api/courses.service';
import {
  RouteDto,
  CreateRouteDto,
  Course,
  ApiCoursesIdGetIdParameter,
  AddCourseToRouteDto,
} from '../api/model/models';

@Component({
  selector: 'app-route-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight italic">
            {{ 'ROUTE.TITLE' | translate }}
          </h1>
          <p class="text-gray-500 font-medium mt-1">
            {{ 'ROUTE.DESC' | translate }}
          </p>
        </div>
        <button
          (click)="showCreateModal = true"
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ 'ROUTE.CREATE' | translate }}
        </button>
      </div>

      <!-- Routes List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (route of routes(); track $any(route.id)) {
          <div
            class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
          >
            <div class="flex justify-between items-start mb-4">
              <div
                class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div class="flex gap-2">
                <button
                  (click)="editRoute(route)"
                  class="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  (click)="deleteRoute($any(route.id))"
                  class="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-red-600 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-2 truncate">{{ route.name }}</h3>
            <p class="text-gray-500 text-sm line-clamp-2 mb-6 h-10">
              {{ route.description || ('COMMON.NO_DESCRIPTION' | translate) }}
            </p>

            <div class="pt-6 border-t border-gray-50">
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black uppercase tracking-widest text-gray-400">{{
                  'ROUTE.COURSES' | translate
                }}</span>
                <span
                  class="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg"
                  >{{ route.courses?.length || 0 }}</span
                >
              </div>
              <div class="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                @for (rc of route.courses; track rc.courseId) {
                  <div
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-xl group/item"
                  >
                    <span class="text-xs font-bold text-gray-700 truncate pr-2">{{
                      rc.courseTitle
                    }}</span>
                    <button
                      (click)="removeCourse($any(route.id), $any(rc.courseId))"
                      class="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-600 transition-all"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                }
              </div>
              <button
                (click)="openAddCourse(route)"
                class="w-full mt-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs font-black text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                + {{ 'ROUTE.ADD_COURSE' | translate }}
              </button>
            </div>
          </div>
        } @empty {
          <div
            class="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200"
          >
            <p class="text-gray-400 font-bold">{{ 'ROUTE.NO_ROUTES' | translate }}</p>
          </div>
        }
      </div>

      <!-- Create/Edit Modal -->
      @if (showCreateModal) {
        <div
          class="fixed inset-0 bg-indigo-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <div
            class="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300"
          >
            <div class="p-10">
              <h2 class="text-2xl font-black text-gray-900 mb-8 italic">
                {{ (editingRouteId ? 'ROUTE.EDIT' : 'ROUTE.CREATE') | translate }}
              </h2>
              <div class="space-y-6">
                <div>
                  <label
                    class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
                    >{{ 'ROUTE.NAME' | translate }}</label
                  >
                  <input
                    [(ngModel)]="routeForm.name"
                    type="text"
                    class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label
                    class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
                    >{{ 'COMMON.DESCRIPTION' | translate }}</label
                  >
                  <textarea
                    [(ngModel)]="routeForm.description"
                    rows="4"
                    class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 resize-none"
                  ></textarea>
                </div>
              </div>
              <div class="flex gap-4 mt-10">
                <button
                  (click)="closeModal()"
                  class="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black rounded-2xl transition-all"
                >
                  {{ 'COMMON.CANCEL' | translate }}
                </button>
                <button
                  (click)="saveRoute()"
                  class="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  {{ 'COMMON.SAVE' | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Add Course Modal -->
      @if (selectedRouteForCourse) {
        <div
          class="fixed inset-0 bg-indigo-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <div
            class="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
          >
            <div class="p-10">
              <h2 class="text-2xl font-black text-gray-900 mb-8 italic">
                {{ 'ROUTE.ADD_COURSE' | translate }}
              </h2>
              <div class="max-h-96 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                @for (course of availableCourses(); track course.id) {
                  <button
                    (click)="addCourseToRoute($any(course.id))"
                    class="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-indigo-50 rounded-2xl text-left transition-all group"
                  >
                    <span class="font-bold text-gray-700 group-hover:text-indigo-600">{{
                      course.title
                    }}</span>
                    <svg
                      class="w-5 h-5 text-gray-300 group-hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                }
              </div>
              <button
                (click)="selectedRouteForCourse = null"
                class="w-full mt-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black rounded-2xl transition-all"
              >
                {{ 'COMMON.CANCEL' | translate }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e5e7eb;
        border-radius: 2px;
      }
    `,
  ],
})
export class RouteManagementComponent implements OnInit {
  private routesService = inject(RoutesService);
  private coursesService = inject(CoursesService);

  routes = signal<RouteDto[]>([]);
  availableCourses = signal<Course[]>([]);
  showCreateModal = false;
  editingRouteId: number | null = null;
  selectedRouteForCourse: RouteDto | null = null;

  routeForm: CreateRouteDto = {
    name: '',
    description: '',
  };

  ngOnInit() {
    this.loadRoutes();
    this.loadCourses();
  }

  loadRoutes() {
    this.routesService.apiRoutesGet().subscribe((data) => this.routes.set(data));
  }

  loadCourses() {
    this.coursesService.apiCoursesGet().subscribe((data) => this.availableCourses.set(data));
  }

  saveRoute() {
    if (this.editingRouteId) {
      this.routesService
        .apiRoutesIdPut(this.editingRouteId as any, this.routeForm)
        .subscribe(() => {
          this.loadRoutes();
          this.closeModal();
        });
    } else {
      this.routesService.apiRoutesPost(this.routeForm).subscribe((data) => {
        this.loadRoutes();
        this.closeModal();
      });
    }
  }

  editRoute(route: RouteDto) {
    this.editingRouteId = route.id! as any;
    this.routeForm = {
      name: route.name,
      description: route.description,
    };
    this.showCreateModal = true;
  }

  deleteRoute(id: number) {
    if (confirm('Are you sure?')) {
      this.routesService.apiRoutesIdDelete(id as any).subscribe(() => this.loadRoutes());
    }
  }

  openAddCourse(route: RouteDto) {
    this.selectedRouteForCourse = route;
  }

  addCourseToRoute(courseId: ApiCoursesIdGetIdParameter) {
    if (!this.selectedRouteForCourse) return;
    const params: AddCourseToRouteDto = {
      courseId,
      order: (this.selectedRouteForCourse.courses?.length || 0) + 1,
    };
    this.routesService
      .apiRoutesIdCoursesPost(this.selectedRouteForCourse.id! as any, params)
      .subscribe(() => {
        this.loadRoutes();
        this.selectedRouteForCourse = null;
      });
  }

  removeCourse(routeId: number, courseId: number) {
    this.routesService
      .apiRoutesIdCoursesCourseIdDelete(routeId as any, courseId as any)
      .subscribe(() => this.loadRoutes());
  }

  closeModal() {
    this.showCreateModal = false;
    this.editingRouteId = null;
    this.routeForm = { name: '', description: '' };
  }
}
