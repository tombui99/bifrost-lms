import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../api/api/admin.service';
import { UserDisplayDto, Tenant } from '../api/model/models';
import { AuthenticationService } from '../core/auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="space-y-8 animate-fade-in">
      <div class="flex justify-between items-end">
        <div>
          <h3 class="text-3xl font-black text-gray-900 tracking-tight italic">
            {{ 'ADMIN.USER_ACCOUNTS_TITLE' | translate }}
          </h3>
          <p class="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">
            {{ 'ADMIN.USER_ACCOUNTS_DESC' | translate }}
          </p>
        </div>
        <button
          (click)="prepareCreate()"
          class="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {{ 'ADMIN.CREATE_NEW_USER' | translate }}
        </button>
      </div>

      <!-- Users Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (user of users(); track user.id) {
          <div
            class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"
            ></div>

            <div class="relative flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20"
              >
                <span class="text-xl font-black italic">{{
                  (user.fullName || 'U').charAt(0)
                }}</span>
              </div>
              <div class="flex-1">
                <p class="font-black text-gray-900 italic tracking-tight capitalize truncate">
                  {{ user.fullName }}
                </p>
                <p class="text-xs font-bold text-gray-400 truncate">{{ user.username }}</p>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-between">
              <div class="flex flex-wrap gap-2">
                <span
                  class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm"
                  [ngClass]="{
                    'bg-purple-100 text-purple-700': user.role === 'Admin',
                    'bg-emerald-100 text-emerald-700': user.role === 'Teacher',
                    'bg-blue-100 text-blue-700': user.role === 'Student',
                  }"
                >
                  {{
                    (user.role === 'Admin'
                      ? 'AUTH.ADMIN'
                      : user.role === 'Teacher'
                        ? 'AUTH.TEACHER'
                        : user.role === 'Student'
                          ? 'AUTH.STUDENT'
                          : 'ADMIN.TENANT_ADMIN'
                    ) | translate
                  }}
                </span>
                <span
                  class="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest shadow-sm"
                >
                  {{ user.tenantId || ('ADMIN.GLOBAL_ADMIN' | translate) }}
                </span>
              </div>

              <div class="flex gap-2">
                @if (user.id !== currentUserId()) {
                  <button
                    (click)="onEditUser(user)"
                    class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
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
                    (click)="onDeleteUser(user.id!)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Create Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            class="absolute inset-0 bg-indigo-950/40 backdrop-blur-md"
            (click)="showCreateModal.set(false)"
          ></div>

          <div
            class="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-white/20 animate-slide-up"
          >
            <div class="bg-indigo-900 p-8 text-white relative">
              <div
                class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"
              ></div>
              <h4 class="text-3xl font-black italic tracking-tight relative">
                {{ (isEditMode() ? 'ADMIN.EDIT_ACCOUNT' : 'ADMIN.NEW_ACCOUNT') | translate }}
              </h4>
              <p class="text-sm font-bold text-indigo-300 uppercase tracking-widest mt-1 relative">
                {{
                  (isEditMode() ? 'ADMIN.UPDATE_CREDENTIALS' : 'ADMIN.IDENTITY_REGISTRATION')
                    | translate
                }}
              </p>
            </div>

            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="p-10 space-y-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1"
                    >{{ 'ADMIN.FULL_NAME' | translate }}</label
                  >
                  <input
                    formControlName="fullName"
                    type="text"
                    class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-100 text-gray-900 placeholder-gray-300 font-bold transition-all"
                    placeholder="John Doe"
                  />
                </div>
                @if (!isEditMode() || selectedUserId() !== currentUserId()) {
                  <div>
                    <label
                      class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1"
                      >{{ 'ADMIN.ACCOUNT_ROLE' | translate }}</label
                    >
                    <select
                      formControlName="role"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-100 text-gray-900 font-bold transition-all appearance-none cursor-pointer"
                    >
                      <option value="Student">{{ 'AUTH.STUDENT' | translate }}</option>
                      <option value="Teacher">{{ 'AUTH.TEACHER' | translate }}</option>
                      @if (userRole() === 'Admin') {
                        <option value="Admin">{{ 'AUTH.ADMIN' | translate }}</option>
                        <option value="TenantAdmin">{{ 'ADMIN.TENANT_ADMIN' | translate }}</option>
                      }
                    </select>
                  </div>
                }
              </div>

              <div>
                <label
                  class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1"
                  >{{ 'ADMIN.USERNAME' | translate }}</label
                >
                <input
                  formControlName="username"
                  type="text"
                  class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-100 text-gray-900 placeholder-gray-300 font-bold transition-all disabled:opacity-50"
                  [readonly]="isEditMode()"
                  placeholder="john_doe"
                />
              </div>

              @if (!isEditMode()) {
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1"
                      >{{ 'ADMIN.SECURE_PASSWORD' | translate }}</label
                    >
                    <input
                      formControlName="password"
                      type="password"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-100 text-gray-900 placeholder-gray-300 font-bold transition-all"
                      placeholder="********"
                    />
                  </div>
                  @if (userRole() === 'Admin') {
                    <div>
                      <label
                        class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1"
                        >{{ 'ADMIN.TENANT_ID' | translate }}</label
                      >
                      <select
                        formControlName="tenantId"
                        [attr.disabled]="userRole() !== 'Admin' ? true : null"
                        class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-100 text-gray-900 font-bold transition-all appearance-none cursor-pointer disabled:opacity-50"
                      >
                        @for (tenant of tenants(); track tenant.id) {
                          <option [value]="tenant.id">{{ tenant.name }}</option>
                        }
                      </select>
                    </div>
                  }
                </div>
              } @else {
                @if (userRole() === 'Admin') {
                  <div>
                    <label
                      class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1"
                      >{{ 'ADMIN.TENANT_ASSIGNMENT' | translate }}</label
                    >
                    <select
                      formControlName="tenantId"
                      [attr.disabled]="userRole() !== 'Admin' ? true : null"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-100 text-gray-900 font-bold transition-all appearance-none cursor-pointer disabled:opacity-50"
                    >
                      @for (tenant of tenants(); track tenant.id) {
                        <option [value]="tenant.id">{{ tenant.name }}</option>
                      }
                    </select>
                  </div>
                }
              }

              <div class="flex gap-4 pt-6">
                <button
                  type="button"
                  (click)="showCreateModal.set(false)"
                  class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                  {{ 'COMMON.CANCEL' | translate }}
                </button>
                <button
                  type="submit"
                  [disabled]="userForm.invalid"
                  class="flex-2 px-10 py-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {{ (isEditMode() ? 'QUIZ.SAVE_CHANGES' : 'ADMIN.CONFIRM_CREATE') | translate }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class UserManagementComponent implements OnInit {
  users = signal<UserDisplayDto[]>([]);
  tenants = signal<Tenant[]>([]);
  showCreateModal = signal(false);
  isEditMode = signal(false);
  selectedUserId = signal<string | null>(null);
  userForm: FormGroup;

  private adminService = inject(AdminService);
  private authService = inject(AuthenticationService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  userRole = this.authService.userRole;
  currentUserId = signal<string | null>(null);

  constructor() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', Validators.required],
      role: ['Student', Validators.required],
      tenantId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.currentUserId.set(this.authService.getUserId());
    this.loadData();
  }

  loadData() {
    this.adminService.apiAdminUsersGet().subscribe((users) => this.users.set(users));
    this.adminService.apiAdminTenantsGet().subscribe((tenants) => {
      this.tenants.set(tenants);
      if (this.userRole() !== 'Admin') {
        this.userForm.patchValue({ tenantId: this.authService.getTenantId() });
      } else if (tenants.length > 0 && !this.userForm.get('tenantId')?.value) {
        this.userForm.patchValue({ tenantId: tenants[0].id });
      }
    });
  }

  prepareCreate() {
    this.isEditMode.set(false);
    this.selectedUserId.set(null);
    this.userForm.reset({
      role: 'Student',
      tenantId:
        this.userRole() === 'Admin' ? this.tenants()[0]?.id : this.authService.getTenantId(),
    });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showCreateModal.set(true);
  }

  onEditUser(user: UserDisplayDto) {
    this.isEditMode.set(true);
    this.selectedUserId.set(user.id!);
    this.userForm.patchValue({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      tenantId: user.tenantId,
      password: 'dummy-password', // Not used for edit but bypasses validator if any
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showCreateModal.set(true);
  }

  onDeleteUser(id: string) {
    const confirmMsg = this.translate.instant('COMMON.ARE_YOU_SURE_DELETE');
    if (confirm(confirmMsg + '?')) {
      this.adminService.apiAdminUsersIdDelete(id).subscribe(() => this.loadData());
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = { ...this.userForm.getRawValue() };
      const request = this.isEditMode()
        ? this.adminService.apiAdminUsersIdPut(this.selectedUserId()!, formValue)
        : this.adminService.apiAdminUsersPost(formValue);

      request.subscribe(() => {
        this.showCreateModal.set(false);
        this.loadData();
      });
    }
  }
}
