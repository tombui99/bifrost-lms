import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../core/auth/auth.service';
import { LanguageService } from '../core/language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { TenantService } from '../core/tenant/tenant.service';
import { BASE_PATH } from '../api/variables';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 flex overflow-hidden">
      <!-- Left Sidebar -->
      <aside
        class="w-72 bg-white border-r border-gray-100 flex flex-col z-30 transition-all duration-300 transform"
        [class.fixed]="isMobileMenuOpen()"
        [class.inset-y-0]="isMobileMenuOpen()"
        [class.left-0]="isMobileMenuOpen()"
        [class.-translate-x-full]="!isMobileMenuOpen() && isMobileView()"
        [class.relative]="!isMobileView()"
      >
        <!-- Sidebar Header (Logo) -->
        <div
          class="p-6 border-b border-gray-50 flex items-center gap-3 cursor-pointer"
          routerLink="/dashboard"
        >
          @if (tenantService.currentTenant()?.logoUrl) {
            <div class="h-10 w-auto flex items-center justify-center">
              <img
                [src]="basePath + tenantService.currentTenant()?.logoUrl"
                class="h-full w-full object-contain"
              />
            </div>
          } @else {
            <div
              class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.333 5.477 19 7.5 19s3.332.333 4.168.618m4.332 0c.835-.285 1.668-.618 4.168-.618 1.667 0 3.253.477 3.253.618v-13C19.832 5.477 18.246 5 16.5 5c-1.668 0-3.253.477-4.168.618"
                />
              </svg>
            </div>
          }
          <h1 class="text-xl font-black text-gray-900 italic tracking-tight">
            {{ tenantService.currentTenant()?.name || 'Bifrost'
            }}<span class="text-indigo-600">LMS</span>
          </h1>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <!-- Common items -->
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
          >
            <svg
              class="w-5 h-5 opacity-70 group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {{ 'COMMON.DASHBOARD' | translate }}
          </a>

          <!-- Teacher Items -->
          @if (authService.userRole() === 'Teacher') {
            <div
              class="mt-6 mb-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
            >
              {{ 'COMMON.MANAGEMENT' | translate }}
            </div>
            <a
              routerLink="/courses/manage"
              routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'COMMON.COURSES' | translate }}
            </a>
            <a
              routerLink="/teacher/schedules"
              routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'DASHBOARD.SCHEDULE' | translate }}
            </a>
            <a
              routerLink="/routes/manage"
              routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'ROUTE.TITLE' | translate }}
            </a>
            <a
              routerLink="/departments/manage"
              routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'DEPARTMENT.TITLE' | translate }}
            </a>
            <a
              routerLink="/teacher/analytics"
              routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'COMMON.ANALYTICS' | translate }}
            </a>
          }

          <!-- Student Items -->
          @if (authService.userRole() === 'Student') {
            <div
              class="mt-6 mb-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
            >
              {{ 'COMMON.LEARNING' | translate }}
            </div>
            <a
              routerLink="/student/schedule"
              routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'DASHBOARD.SCHEDULE' | translate }}
            </a>
            <a
              routerLink="/student/courses"
              routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'COMMON.COURSES' | translate }}
            </a>
            <a
              routerLink="/student/routes"
              routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'ROUTE.TITLE' | translate }}
            </a>
            <a
              href="javascript:void(0)"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'DASHBOARD.FORUM' | translate }}
            </a>
            <a
              href="javascript:void(0)"
              class="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold group"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100"
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
              {{ 'DASHBOARD.LIBRARY' | translate }}
            </a>
          }
        </nav>

        <!-- Sidebar Footer (Logout) -->
        <div class="p-4 border-t border-gray-50 mt-auto">
          <button
            (click)="logout()"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-bold"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Container -->
      <div class="flex-1 flex flex-col min-w-0 bg-gray-50 h-screen">
        <!-- Top Header (Refactored) -->
        <header
          class="bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0 z-20 sticky top-0"
        >
          <div class="max-w-full mx-auto px-6 h-20 flex justify-between items-center">
            <div class="flex items-center gap-4">
              <!-- Mobile Toggle -->
              <button
                (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
                class="lg:hidden p-2 rounded-xl border border-gray-100 text-gray-500 hover:bg-gray-50"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
              <div class="flex flex-col">
                <span
                  class="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none mb-1"
                  >Welcome back,</span
                >
                <span class="text-lg font-black text-gray-900 tracking-tight italic">{{
                  authService.username()
                }}</span>
              </div>
            </div>

            <div class="flex items-center space-x-6">
              <!-- Language Toggle -->
              <div
                class="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100 shadow-inner"
              >
                <button
                  (click)="languageService.setLanguage('en')"
                  [class.bg-white]="languageService.currentLang() === 'en'"
                  [class.shadow-sm]="languageService.currentLang() === 'en'"
                  class="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all uppercase"
                  [class.text-indigo-600]="languageService.currentLang() === 'en'"
                  [class.text-gray-400]="languageService.currentLang() !== 'en'"
                >
                  EN
                </button>
                <button
                  (click)="languageService.setLanguage('vi')"
                  [class.bg-white]="languageService.currentLang() === 'vi'"
                  [class.shadow-sm]="languageService.currentLang() === 'vi'"
                  class="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all uppercase"
                  [class.text-indigo-600]="languageService.currentLang() === 'vi'"
                  [class.text-gray-400]="languageService.currentLang() !== 'vi'"
                >
                  VI
                </button>
              </div>

              <!-- Profile Avatar Section -->
              <div class="flex items-center gap-3 pl-6 border-l border-gray-100">
                <div class="text-right hidden sm:block">
                  <p
                    class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1"
                  >
                    {{
                      (authService.userRole() === 'Student'
                        ? 'AUTH.STUDENT'
                        : authService.userRole() === 'Teacher'
                          ? 'AUTH.TEACHER'
                          : 'AUTH.ADMIN'
                      ) | translate
                    }}
                  </p>
                  <p class="text-xs font-bold text-gray-400">Online</p>
                </div>
                <div
                  class="w-11 h-11 rounded-2xl bg-indigo-900 shadow-lg shadow-indigo-100 flex items-center justify-center ring-2 ring-white"
                >
                  <span class="text-white font-black text-sm">
                    {{ (authService.username() || 'U').charAt(0).toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <main class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="p-4 lg:p-10 max-w-screen-2xl mx-auto min-h-full">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>

    <!-- Mobile Backdrop -->
    @if (isMobileMenuOpen() && isMobileView()) {
      <div
        (click)="isMobileMenuOpen.set(false)"
        class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 lg:hidden animate-fade-in"
      ></div>
    }
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
        border-radius: 20px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #d1d5db;
      }
    `,
  ],
})
export class MainLayoutComponent {
  authService = inject(AuthenticationService);
  tenantService = inject(TenantService);
  languageService = inject(LanguageService);
  basePath = inject(BASE_PATH);
  router = inject(Router);

  isMobileMenuOpen = signal(false);

  isMobileView() {
    return window.innerWidth < 1024;
  }

  constructor() {
    // Listen to resize
    window.addEventListener('resize', () => {
      if (!this.isMobileView()) this.isMobileMenuOpen.set(false);
    });
    // Close on navigation
    this.router.events.subscribe(() => {
      this.isMobileMenuOpen.set(false);
    });
  }

  logout() {
    this.authService.logout();
  }
}
