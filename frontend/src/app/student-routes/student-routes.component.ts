import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoutesService } from '../api/api/routes.service';
import { RouteDto } from '../api/model/routeDto';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-student-routes',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight italic">
              {{ selectedRoute() ? selectedRoute()!.name : ('ROUTE.MY_ROUTES' | translate) }}
            </h1>
            <p class="text-gray-500 font-medium mt-1">
              {{ selectedRoute() ? selectedRoute()!.description : ('ROUTE.DESC' | translate) }}
            </p>
          </div>
          <button
            (click)="goBack()"
            class="inline-flex items-center px-6 py-3 border border-gray-100 rounded-2xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-95"
          >
            <svg
              class="mr-2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {{ (selectedRoute() ? 'COMMON.BACK' : 'COMMON.BACK') | translate }}
          </button>
        </div>

        @if (loading()) {
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        } @else if (!selectedRoute() && routes().length === 0) {
          <div class="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
            <div
              class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="h-10 w-10 text-gray-300"
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
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ 'ROUTE.NO_ROUTES' | translate }}
            </h3>
            <p class="text-gray-500 max-w-xs mx-auto font-medium">
              {{ 'ROUTE.NO_ROUTES_DESC' | translate }}
            </p>
          </div>
        } @else if (selectedRoute()) {
          <!-- Detailed Route Progression View -->
          <div class="max-w-3xl mx-auto animate-fade-in">
            <div class="relative">
              <!-- Progression Line -->
              <div class="absolute left-8 top-10 bottom-10 w-1 bg-indigo-100 rounded-full"></div>

              <div class="space-y-12">
                @for (
                  rc of selectedRoute()!.courses;
                  track rc.courseId;
                  let first = $first;
                  let last = $last
                ) {
                  <div class="relative flex items-start gap-12 group">
                    <!-- Progress Node -->
                    <div
                      class="shrink-0 w-16 h-16 bg-white border-4 border-indigo-50 rounded-[2rem] flex items-center justify-center text-xl font-black text-indigo-600 shadow-sm z-10 transition-transform group-hover:scale-110"
                    >
                      {{ rc.order }}
                    </div>

                    <!-- Course Card -->
                    <div
                      class="grow bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div class="flex items-center justify-between gap-4">
                        <div>
                          <h3 class="text-xl font-black text-gray-900 mb-1 tracking-tight italic">
                            {{ rc.courseTitle }}
                          </h3>
                          <p class="text-sm font-medium text-gray-400 uppercase tracking-widest">
                            Stage {{ rc.order }} of {{ selectedRoute()!.courses?.length }}
                          </p>
                        </div>
                        <button
                          (click)="startCourse(rc.courseId)"
                          class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all active:scale-95 whitespace-nowrap"
                        >
                          {{ 'COURSE.START_COURSE' | translate }}
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <!-- Routes Grid Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            @for (route of routes(); track route.id) {
              <div
                class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div class="p-8">
                  <div
                    class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform"
                  >
                    <svg
                      class="w-6 h-6 text-white"
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
                  <h3 class="text-2xl font-black text-gray-900 mb-3 tracking-tight italic">
                    {{ route.name }}
                  </h3>
                  <p class="text-gray-500 font-medium mb-6 line-clamp-2">{{ route.description }}</p>

                  <div class="space-y-3">
                    <p
                      class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4"
                    >
                      {{ 'COURSE.TITLE_PLURAL' | translate }} ({{ route.courses?.length || 0 }})
                    </p>
                    @for (rc of route.courses?.slice(0, 3); track rc.courseId) {
                      <div
                        class="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-colors"
                      >
                        <div
                          class="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-[10px] font-black text-indigo-600"
                        >
                          {{ rc.order }}
                        </div>
                        <span class="text-sm font-bold text-gray-700 truncate">{{
                          rc.courseTitle
                        }}</span>
                      </div>
                    }
                    @if ((route.courses?.length || 0) > 3) {
                      <p class="text-xs text-center text-gray-400 font-bold italic pt-2">
                        + {{ (route.courses?.length || 0) - 3 }}
                        {{ 'COMMON.MORE' | translate }}
                      </p>
                    }
                  </div>
                </div>
                <div class="px-8 pb-8 pt-2">
                  <button
                    (click)="selectRoute(route)"
                    class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    {{ 'ROUTE.START_ROUTE' | translate }}
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class StudentRoutesComponent implements OnInit {
  private routesService = inject(RoutesService);
  private router = inject(Router);

  routes = signal<RouteDto[]>([]);
  selectedRoute = signal<RouteDto | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.routesService.apiRoutesMyGet().subscribe({
      next: (data) => {
        this.routes.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  selectRoute(route: RouteDto) {
    this.selectedRoute.set(route);
  }

  deselectRoute() {
    this.selectedRoute.set(null);
  }

  startCourse(courseId: any) {
    if (courseId) {
      this.router.navigate(['/student/courses', courseId as any as number]);
    }
  }

  viewFirstCourse(route: RouteDto) {
    if (route.courses && route.courses.length > 0) {
      const firstCourseId = route.courses[0].courseId;
      this.router.navigate(['/student/courses', firstCourseId as any as number]);
    }
  }

  goBack() {
    if (this.selectedRoute()) {
      this.deselectRoute();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
