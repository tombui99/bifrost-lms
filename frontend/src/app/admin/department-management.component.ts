import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DepartmentsService } from '../api/api/departments.service';
import { RoutesService } from '../api/api/routes.service';
import { AdminService } from '../api/api/admin.service';
import {
  DepartmentDto,
  CreateDepartmentDto,
  RouteDto,
  UserDisplayDto,
  AssignRouteToDepartmentDto,
  AssignStudentToDepartmentDto,
} from '../api/model/models';

@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="space-y-8 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight italic">
            {{ 'DEPARTMENT.TITLE' | translate }}
          </h1>
          <p class="text-gray-500 font-medium mt-1">
            {{ 'DEPARTMENT.DESC' | translate }}
          </p>
        </div>
        <button
          (click)="openCreateModal()"
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
          {{ 'DEPARTMENT.CREATE' | translate }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Department Tree View -->
        <div
          class="lg:col-span-1 bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 min-h-150 flex flex-col"
        >
          <div class="flex items-center justify-between mb-6 px-2">
            <h3 class="text-xs font-black text-indigo-400 uppercase tracking-widest">
              {{ 'DEPARTMENT.STRUCTURE' | translate }}
            </h3>
            <button
              (click)="openCreateModal()"
              class="text-indigo-600 hover:text-indigo-700 transition-colors p-1"
              [title]="'DEPARTMENT.ADD_ROOT' | translate"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
          <div class="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
            @for (dept of departments(); track $any(dept.id)) {
              <ng-container
                *ngTemplateOutlet="deptItem; context: { $implicit: dept, level: 0 }"
              ></ng-container>
            } @empty {
              <div class="py-20 text-center">
                <p class="text-gray-400 font-bold italic opacity-50">
                  {{ 'DEPARTMENT.NO_DEPARTMENTS' | translate }}
                </p>
              </div>
            }
          </div>
        </div>

        <!-- Department Details Panel -->
        <div class="lg:col-span-2 space-y-8">
          @if (selectedDept) {
            <!-- Header Section -->
            <div
              class="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100"
            >
              <div
                class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl opacity-50"
              ></div>
              <div class="relative z-10 flex justify-between items-start">
                <div>
                  <h2 class="text-3xl font-black italic tracking-tight mb-2">
                    {{ selectedDept.name }}
                  </h2>
                  <p class="text-indigo-200 font-medium italic opacity-80">
                    {{ selectedDept.description || ('DEPARTMENT.NO_DESCRIPTION' | translate) }}
                  </p>
                </div>
                <div class="flex gap-3">
                  <button
                    (click)="editDept(selectedDept)"
                    class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 backdrop-blur-sm"
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
                    (click)="deleteDept($any(selectedDept.id))"
                    class="p-3 bg-red-500/80 hover:bg-red-600 rounded-2xl transition-all border border-white/10 backdrop-blur-sm"
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
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Assigned Routes -->
              <div class="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {{ 'DEPARTMENT.ASSIGNED_ROUTES' | translate }}
                  </h3>
                  <button
                    (click)="openAddRoute(selectedDept)"
                    class="text-indigo-600 font-black text-xs hover:underline"
                  >
                    {{ 'DEPARTMENT.ASSIGN_BTN' | translate }}
                  </button>
                </div>
                <div class="space-y-4">
                  @for (route of selectedDept.assignedRoutes; track $any(route.id)) {
                    <div
                      class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs"
                        >
                          R
                        </div>
                        <span class="font-bold text-gray-700">{{ route.name }}</span>
                      </div>
                      <button
                        (click)="unassignRoute($any(route.id))"
                        class="opacity-0 group-hover:opacity-100 text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
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
                  } @empty {
                    <div class="py-8 text-center text-gray-400 text-xs font-bold italic opacity-50">
                      {{ 'DEPARTMENT.NO_ROUTES_ASSIGNED' | translate }}
                    </div>
                  }
                </div>
              </div>

              <!-- Assigned Students -->
              <div class="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {{ 'DEPARTMENT.ASSIGNED_STUDENTS' | translate }}
                  </h3>
                  <button
                    (click)="openAssignStudent(selectedDept)"
                    class="text-indigo-600 font-black text-xs hover:underline"
                  >
                    {{ 'DEPARTMENT.ASSIGN_BTN' | translate }}
                  </button>
                </div>
                <div class="space-y-4">
                  @for (student of assignedStudents(); track student.id) {
                    <div
                      class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700 font-black text-xs"
                        >
                          S
                        </div>
                        <div>
                          <p class="font-bold text-gray-700 leading-tight">
                            {{ student.fullName }}
                          </p>
                          <p class="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                            {{ student.username }}
                          </p>
                        </div>
                      </div>
                      <button
                        (click)="unassignStudent(student.id!)"
                        class="opacity-0 group-hover:opacity-100 text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
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
                  } @empty {
                    <div class="py-8 text-center text-gray-400 text-xs font-bold italic opacity-50">
                      {{ 'DEPARTMENT.NO_STUDENTS_ASSIGNED' | translate }}
                    </div>
                  }
                </div>
              </div>
            </div>
          } @else {
            <div
              class="h-full flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-gray-200 p-20 opacity-40"
            >
              <svg
                class="w-20 h-20 text-gray-200 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p class="text-xl font-black italic text-gray-400 tracking-tight">
                {{ 'DEPARTMENT.SELECT_DEPARTMENT' | translate }}
              </p>
            </div>
          }
        </div>
      </div>

      <!-- Recursive Template for Department Tree -->
      <ng-template #deptItem let-dept let-level="level">
        <div class="group">
          <div
            [style.padding-left.px]="level * 24 + 12"
            class="flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border border-transparent"
            [class.bg-indigo-50]="selectedDept?.id === dept.id"
            [class.border-indigo-100]="selectedDept?.id === dept.id"
            [class.hover:bg-gray-50]="selectedDept?.id !== dept.id"
            (click)="selectDept(dept)"
          >
            <div class="flex items-center gap-3">
              <!-- Expand/Collapse Toggle -->
              @if (dept.subDepartments && dept.subDepartments.length > 0) {
                <button
                  (click)="toggleExpand(dept.id!); $event.stopPropagation()"
                  class="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-transform"
                  [class.rotate-90]="isExpanded(dept.id!)"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              } @else {
                <div class="w-4"></div>
              }

              <div
                class="w-8 h-8 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0"
                [class.text-indigo-600]="selectedDept?.id === dept.id"
                [class.text-gray-400]="selectedDept?.id !== dept.id"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4
                class="font-bold text-sm tracking-tight truncate"
                [class.text-indigo-700]="selectedDept?.id === dept.id"
                [class.text-gray-700]="selectedDept?.id !== dept.id"
              >
                {{ dept.name }}
              </h4>
            </div>
            <button
              (click)="openAddSub(dept); $event.stopPropagation()"
              class="p-1.5 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
              [title]="'DEPARTMENT.ADD_SUB' | translate"
            >
              <svg
                class="w-4 h-4 text-gray-500"
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
          </div>

          @if (dept.subDepartments && dept.subDepartments.length > 0 && isExpanded(dept.id!)) {
            <div class="mt-1 animate-fade-in">
              @for (sub of dept.subDepartments; track sub.id) {
                <ng-container
                  *ngTemplateOutlet="deptItem; context: { $implicit: sub, level: level + 1 }"
                ></ng-container>
              }
            </div>
          }
        </div>
      </ng-template>

      <!-- Modals... (omitted for brevity but logic remains same, just better layout) -->
      @if (showModal) {
        <div
          class="fixed inset-0 bg-indigo-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in"
        >
          <div
            class="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in"
          >
            <div class="p-10">
              <h2 class="text-2xl font-black text-gray-900 mb-8 italic">{{ modalTitle }}</h2>

              @if (modalType === 'form') {
                <div class="space-y-6">
                  <div>
                    <label
                      class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
                      >{{ 'DEPARTMENT.NAME' | translate }}</label
                    >
                    <input
                      [(ngModel)]="deptForm.name"
                      type="text"
                      class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
                      >{{ 'COMMON.DESCRIPTION' | translate }}</label
                    >
                    <textarea
                      [(ngModel)]="deptForm.description"
                      rows="3"
                      class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                    ></textarea>
                  </div>
                </div>
              }

              @if (modalType === 'assignRoute') {
                <div class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar px-2">
                  @for (route of filteredRoutes(); track $any(route.id)) {
                    <button
                      (click)="assignRoute($any(route.id))"
                      class="w-full p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-2xl text-left transition-all group"
                    >
                      <span class="font-bold text-gray-700 group-hover:text-indigo-600">{{
                        route.name
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
                  } @empty {
                    <div class="py-12 text-center">
                      @if (allRoutes().length === 0) {
                        <p class="text-gray-400 font-bold italic opacity-50">
                          No routes created yet. Please go to Learning Routes to create one.
                        </p>
                      } @else {
                        <p class="text-gray-400 font-bold italic opacity-50">
                          All available routes are already assigned to this department.
                        </p>
                      }
                    </div>
                  }
                </div>
              }

              @if (modalType === 'assignStudent') {
                <div class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar px-2">
                  @for (student of filteredStudents(); track student.id) {
                    <button
                      (click)="assignStudent(student.id!)"
                      class="w-full p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-2xl text-left transition-all group"
                    >
                      <div>
                        <p class="font-black text-gray-900 group-hover:text-indigo-600">
                          {{ student.fullName }}
                        </p>
                        <p class="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                          {{ student.username }}
                        </p>
                      </div>
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
                  } @empty {
                    <div class="py-12 text-center text-gray-400 font-bold italic opacity-50">
                      No available students found
                    </div>
                  }
                </div>
              }

              <div class="flex gap-4 mt-10">
                <button
                  (click)="closeModal()"
                  class="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black rounded-2xl transition-all"
                >
                  {{ 'COMMON.CANCEL' | translate }}
                </button>
                @if (modalType === 'form') {
                  <button
                    (click)="saveDept()"
                    class="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                  >
                    {{ 'COMMON.SAVE' | translate }}
                  </button>
                }
              </div>
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
        border-radius: 20px;
      }
      @keyframes zoom-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-zoom-in {
        animation: zoom-in 0.3s ease-out;
      }
    `,
  ],
})
export class DepartmentManagementComponent implements OnInit {
  private departmentsService = inject(DepartmentsService);
  private routesService = inject(RoutesService);
  private adminService = inject(AdminService);
  private translate = inject(TranslateService);

  departments = signal<DepartmentDto[]>([]);
  allRoutes = signal<RouteDto[]>([]);
  allStudents = signal<UserDisplayDto[]>([]);
  assignedStudents = signal<UserDisplayDto[]>([]);
  expandedNodes = signal<Set<number>>(new Set());

  showModal = false;
  modalType: 'form' | 'assignRoute' | 'assignStudent' = 'form';
  modalTitle = '';
  editingId: number | null = null;
  selectedDept: DepartmentDto | null = null;

  deptForm: CreateDepartmentDto = {
    name: '',
    description: '',
    parentDepartmentId: undefined,
  };

  ngOnInit() {
    this.loadDepartments();
    this.routesService.apiRoutesGet().subscribe((data) => this.allRoutes.set(data));
    this.loadAllStudents();
  }

  loadDepartments() {
    this.departmentsService.apiDepartmentsGet().subscribe((data) => {
      this.departments.set(data);
      // Update selected dept if it exists to refresh its data
      if (this.selectedDept) {
        const updated = this.findDeptRecursive(data, this.selectedDept.id! as any);
        if (updated) this.selectDept(updated);
      }
    });
  }

  loadAllStudents() {
    this.departmentsService.apiDepartmentsStudentsAllGet().subscribe((users) => {
      this.allStudents.set(users);
    });
  }

  loadAssignedStudents(deptId: number) {
    this.departmentsService.apiDepartmentsIdStudentsGet(deptId as any).subscribe({
      next: (data) => this.assignedStudents.set(data),
      error: () => this.assignedStudents.set([]),
    });
  }

  findDeptRecursive(list: DepartmentDto[], id: number): DepartmentDto | null {
    for (const d of list) {
      if (d.id === id) return d;
      if (d.subDepartments) {
        const found = this.findDeptRecursive(d.subDepartments, id);
        if (found) return found;
      }
    }
    return null;
  }

  toggleExpand(id: number) {
    const set = new Set(this.expandedNodes());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.expandedNodes.set(set);
  }

  isExpanded(id: number): boolean {
    return this.expandedNodes().has(id);
  }

  selectDept(dept: DepartmentDto) {
    this.selectedDept = dept;
    this.loadAssignedStudents(dept.id! as any);
  }

  openCreateModal() {
    this.modalType = 'form';
    this.modalTitle = this.translate.instant('DEPARTMENT.MODAL_TITLE_CREATE');
    this.editingId = null;
    this.deptForm = { name: '', description: '', parentDepartmentId: undefined };
    this.showModal = true;
  }

  openAddSub(parent: DepartmentDto) {
    this.openCreateModal();
    this.deptForm.parentDepartmentId = parent.id;
    this.modalTitle = `${this.translate.instant('DEPARTMENT.MODAL_TITLE_ADD_SUB')} ${parent.name}`;
  }

  editDept(dept: DepartmentDto) {
    this.modalType = 'form';
    this.modalTitle = this.translate.instant('DEPARTMENT.MODAL_TITLE_EDIT');
    this.editingId = dept.id! as any;
    this.deptForm = {
      name: dept.name,
      description: dept.description,
      parentDepartmentId: dept.parentDepartmentId,
    };
    this.showModal = true;
  }

  saveDept() {
    if (this.editingId) {
      this.departmentsService
        .apiDepartmentsIdPut(this.editingId as any, this.deptForm)
        .subscribe(() => {
          this.loadDepartments();
          this.closeModal();
        });
    } else {
      this.departmentsService.apiDepartmentsPost(this.deptForm).subscribe(() => {
        this.loadDepartments();
        this.closeModal();
      });
    }
  }

  deleteDept(id: number) {
    if (confirm(this.translate.instant('DEPARTMENT.CONFIRM_DELETE'))) {
      this.departmentsService.apiDepartmentsIdDelete(id as any).subscribe({
        next: () => {
          this.selectedDept = null;
          this.loadDepartments();
        },
        error: (err) => {
          const message = err.error?.message || this.translate.instant('DEPARTMENT.DELETE_FAILED');
          alert(message);
        },
      });
    }
  }

  openAddRoute(dept: DepartmentDto) {
    this.selectedDept = dept;
    this.modalType = 'assignRoute';
    this.modalTitle = `${this.translate.instant('DEPARTMENT.MODAL_TITLE_ASSIGN_ROUTE')} ${dept.name}`;
    this.showModal = true;
  }

  assignRoute(routeId: number) {
    if (!this.selectedDept) return;
    const params: AssignRouteToDepartmentDto = { routeId };
    this.departmentsService
      .apiDepartmentsIdRoutesPost(this.selectedDept.id! as any, params)
      .subscribe(() => {
        this.loadDepartments();
        this.closeModal();
      });
  }

  unassignRoute(routeId: number) {
    if (!this.selectedDept || !confirm(this.translate.instant('DEPARTMENT.CONFIRM_UNASSIGN_ROUTE')))
      return;
    (this.departmentsService as any)
      .apiDepartmentsIdRoutesRouteIdDelete(this.selectedDept.id! as any, routeId as any)
      .subscribe(() => this.loadDepartments());
  }

  openAssignStudent(dept: DepartmentDto) {
    this.selectedDept = dept;
    this.modalType = 'assignStudent';
    this.modalTitle = `${this.translate.instant('DEPARTMENT.MODAL_TITLE_ASSIGN_STUDENT')} ${dept.name}`;
    this.showModal = true;
  }

  assignStudent(studentId: string) {
    if (!this.selectedDept) return;
    const params: AssignStudentToDepartmentDto = { studentId };
    this.departmentsService
      .apiDepartmentsIdStudentsPost(this.selectedDept.id! as any, params)
      .subscribe(() => {
        this.loadDepartments();
        this.closeModal();
      });
  }

  unassignStudent(studentId: string) {
    if (
      !this.selectedDept ||
      !confirm(this.translate.instant('DEPARTMENT.CONFIRM_UNASSIGN_STUDENT'))
    )
      return;
    (this.departmentsService as any)
      .apiDepartmentsIdStudentsStudentIdDelete(this.selectedDept.id! as any, studentId as any)
      .subscribe(() => {
        this.loadAssignedStudents(this.selectedDept!.id! as any);
      });
  }

  filteredRoutes() {
    if (!this.selectedDept) return this.allRoutes();
    const assignedIds = new Set(
      this.selectedDept.assignedRoutes?.map((r) => r.id?.toString()) || [],
    );
    return this.allRoutes().filter((r) => !assignedIds.has(r.id?.toString()));
  }

  filteredStudents() {
    if (!this.selectedDept) return this.allStudents();
    const assignedIds = this.assignedStudents().map((s) => s.id);
    return this.allStudents().filter((s) => !assignedIds.includes(s.id));
  }

  closeModal() {
    this.showModal = false;
  }
}
