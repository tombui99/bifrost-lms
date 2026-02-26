import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthenticationService } from '../core/auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdminService } from '../api/api/admin.service';
import { Tenant } from '../api/model/models';
import { BASE_PATH } from '../api/variables';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-72 bg-indigo-900 text-white flex flex-col shadow-2xl z-20">
        <div class="p-8 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="p-2 ">
              @if (tenant()?.logoUrl) {
                <img [src]="basePath + tenant()?.logoUrl" class="w-8 h-8 object-contain" />
              } @else {
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.333 5.477 19 7.5 19s3.332.333 4.168.618m4.332 0c.835-.285 1.668-.618 4.168-.618 1.667 0 3.253.477 3.253.618v-13C19.832 5.477 18.246 5 16.5 5c-1.668 0-3.253.477-4.168.618"
                  />
                </svg>
              }
            </div>
            <div>
              <h1 class="text-2xl font-black italic tracking-tight truncate max-w-[140px]">
                {{ tenant()?.name || 'Bifrost LMS' }}
              </h1>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
                {{ 'ADMIN.PANEL' | translate }}
              </p>
            </div>
          </div>
        </div>

        <nav class="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <a
            routerLink="/admin/users"
            routerLinkActive="bg-white/10 text-white shadow-lg"
            class="flex items-center gap-4 px-5 py-4 rounded-2xl text-indigo-100 hover:bg-white/5 transition-all group font-bold"
          >
            <svg
              class="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {{ 'ADMIN.USER_ACCOUNTS' | translate }}
          </a>
          @if (userRole() === 'Admin') {
            <a
              routerLink="/admin/tenants"
              routerLinkActive="bg-white/10 text-white shadow-lg"
              class="flex items-center gap-4 px-5 py-4 rounded-2xl text-indigo-100 hover:bg-white/5 transition-all group font-bold"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
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
              {{ 'ADMIN.TENANTS_COMPANIES' | translate }}
            </a>
            <a
              routerLink="/admin/content"
              routerLinkActive="bg-white/10 text-white shadow-lg"
              class="flex items-center gap-4 px-5 py-4 rounded-2xl text-indigo-100 hover:bg-white/5 transition-all group font-bold"
            >
              <svg
                class="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012-2v2M7 7h10"
                />
              </svg>
              {{ 'ADMIN.SYSTEM_CONTENT' | translate }}
            </a>
          }
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 bg-gray-50/50">
        <header
          class="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0"
        >
          <h2 class="text-xl font-black text-gray-900 tracking-tight italic">
            {{ 'ADMIN.MANAGEMENT_CONSOLE' | translate }}
          </h2>
          <div class="flex items-center gap-6">
            <!-- Language Toggle -->
            <div
              class="flex items-center gap-1 p-1 bg-gray-50 rounded-full border border-gray-200 shadow-inner"
            >
              <button
                (click)="switchLanguage('en')"
                class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                [class.bg-white]="currentLang() === 'en'"
                [class.shadow-md]="currentLang() === 'en'"
                [class.text-indigo-600]="currentLang() === 'en'"
                [class.text-gray-400]="currentLang() !== 'en'"
              >
                EN
              </button>
              <button
                (click)="switchLanguage('vi')"
                class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                [class.bg-white]="currentLang() === 'vi'"
                [class.shadow-md]="currentLang() === 'vi'"
                [class.text-indigo-600]="currentLang() === 'vi'"
                [class.text-gray-400]="currentLang() !== 'vi'"
              >
                VI
              </button>
            </div>

            <!-- Profile Info -->
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-sm font-black text-gray-900 leading-none">
                  {{
                    (userRole() === 'Admin' ? 'ADMIN.GLOBAL_ADMIN' : 'ADMIN.TENANT_ADMIN')
                      | translate
                  }}
                </p>
                <p class="text-xs font-bold text-gray-500 mt-1 lowercase">
                  {{ username() }}
                </p>
                <button
                  (click)="logout()"
                  class="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest mt-1 transition-colors"
                >
                  {{ 'ADMIN.SIGN_OUT' | translate }}
                </button>
              </div>
              <div
                class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-white shadow-md ring-1 ring-gray-100 overflow-hidden"
              >
                <span class="text-sm font-black text-indigo-600">
                  {{ (username() || 'AD').substring(0, 2).toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto p-10">
          <router-outlet></router-outlet>
        </div>
      </main>
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
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    `,
  ],
})
export class AdminLayoutComponent implements OnInit {
  basePath = inject(BASE_PATH);
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private adminService = inject(AdminService);

  userRole = this.authService.userRole;
  username = this.authService.username;
  tenant = signal<Tenant | null>(null);
  currentLang = signal<string>(localStorage.getItem('preferredLang') || 'vi');

  ngOnInit() {
    // Apply persisted language immediately
    this.translate.use(this.currentLang());

    // Fetch tenant data if user belongs to one
    const tenantId = this.authService.getTenantId();
    if (tenantId) {
      this.adminService.apiAdminTenantsGet().subscribe((tenants) => {
        const t = tenants.find((x: any) => x.id === tenantId);
        if (t) this.tenant.set(t);
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('preferredLang', lang);
  }
}
