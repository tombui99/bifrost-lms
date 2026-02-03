import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="bg-indigo-600 rounded-lg p-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.333 5.477 19 7.5 19s3.332.333 4.168.618m4.332 0c.835-.285 1.668-.618 4.168-.618 1.667 0 3.253.477 3.253.618v-13C19.832 5.477 18.246 5 16.5 5c-1.668 0-3.253.477-4.168.618"
                />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Wella LMS</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600"
              >Welcome,
              <span class="font-semibold text-indigo-600">{{
                authService.userRole$ | async
              }}</span></span
            >
            <button (click)="logout()" class="text-sm text-red-600 hover:text-red-800 font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <!-- Teacher/Admin Section -->
        <div
          *ngIf="
            (authService.userRole$ | async) === 'Teacher' ||
            (authService.userRole$ | async) === 'Admin'
          "
          class="mb-8"
        >
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span
              class="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              >TEACHER AREA</span
            >
            Instructional Tools
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Upload Document Widget -->
            <div
              class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition cursor-pointer border-l-4 border-yellow-400"
            >
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dt class="text-sm font-medium text-gray-500 truncate">Upload Resources</dt>
                    <dd class="mt-1 text-lg font-semibold text-gray-900">Manage Documents</dd>
                  </div>
                </div>
              </div>
            </div>

            <!-- Student Progress Widget -->
            <div
              class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition cursor-pointer border-l-4 border-yellow-400"
            >
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
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
                  <div class="ml-5 w-0 flex-1">
                    <dt class="text-sm font-medium text-gray-500 truncate">Student Progress</dt>
                    <dd class="mt-1 text-lg font-semibold text-gray-900">View Analytics</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- General / Student Section -->
        <h2 class="text-xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Widget: Schedule -->
          <div
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition cursor-pointer"
          >
            <div class="p-5">
              <div class="flex items-center justify-center mb-4">
                <svg
                  class="h-10 w-10 text-indigo-500"
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
                <h3 class="text-lg font-medium text-gray-900">Schedule</h3>
                <p class="text-sm text-gray-500">View your classes</p>
              </div>
            </div>
          </div>

          <!-- Widget: Courses -->
          <div
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition cursor-pointer"
          >
            <div class="p-5">
              <div class="flex items-center justify-center mb-4">
                <svg
                  class="h-10 w-10 text-indigo-500"
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
                <h3 class="text-lg font-medium text-gray-900">Courses</h3>
                <p class="text-sm text-gray-500">Access materials</p>
              </div>
            </div>
          </div>

          <!-- Widget: Forum -->
          <div
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition cursor-pointer"
          >
            <div class="p-5">
              <div class="flex items-center justify-center mb-4">
                <svg
                  class="h-10 w-10 text-indigo-500"
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
                <h3 class="text-lg font-medium text-gray-900">Forum</h3>
                <p class="text-sm text-gray-500">Discuss topics</p>
              </div>
            </div>
          </div>

          <!-- Widget: Resources -->
          <div
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition cursor-pointer"
          >
            <div class="p-5">
              <div class="flex items-center justify-center mb-4">
                <svg
                  class="h-10 w-10 text-indigo-500"
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
                <h3 class="text-lg font-medium text-gray-900">Reference</h3>
                <p class="text-sm text-gray-500">External links</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent {
  authService = inject(AuthenticationService);
  router = inject(Router);

  logout() {
    this.authService.logout();
  }
}
