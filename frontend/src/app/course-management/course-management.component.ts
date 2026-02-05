import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../api/api/courses.service';
import { LessonsService } from '../api/api/lessons.service';
import { Course, CreateCourseDto, UpdateCourseDto, Lesson } from '../api/model/models';

interface CourseFormData {
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <button (click)="goBack()" class="text-gray-600 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 class="text-2xl font-bold text-gray-900">Course Management</h1>
          </div>
          <button
            (click)="openCreateModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Course</span>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        @if (loading()) {
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        }

        <!-- Error State -->
        @if (error()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {{ error() }}
          </div>
        }

        <!-- Empty State -->
        @if (!loading() && courses().length === 0) {
          <div class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
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
            <h3 class="mt-2 text-lg font-medium text-gray-900">No courses yet</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
          </div>
        }

        <!-- Courses Table -->
        @if (!loading() && courses().length > 0) {
          <div class="bg-white shadow-sm rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Course
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (course of courses(); track course.id) {
                  <tr class="hover:bg-gray-50 group">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <button
                          (click)="toggleAccordion(course.id!)"
                          class="mr-3 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <svg
                            class="w-5 h-5 transform transition-transform"
                            [class.rotate-90]="isExpanded(course.id!)"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                        @if (course.imageUrl) {
                          <img
                            [src]="course.imageUrl"
                            alt=""
                            class="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        } @else {
                          <div
                            class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3"
                          >
                            <svg
                              class="h-6 w-6 text-indigo-600"
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
                        }
                        <div class="text-sm font-medium text-gray-900">{{ course.title }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-500 max-w-xs truncate">
                        {{ course.description || 'No description' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ course.createdAt | date: 'short' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        (click)="openEditModal(course)"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        (click)="openDeleteModal(course)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  <!-- Lessons Accordion -->
                  @if (isExpanded(course.id!)) {
                    <tr>
                      <td colspan="4" class="px-12 py-4 bg-gray-50/50">
                        <div class="flex justify-between items-center mb-4">
                          <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Lessons ({{ course.lessons?.length || 0 }})
                          </h4>
                          <button
                            (click)="addLesson(course.id!)"
                            class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                          >
                            <svg
                              class="w-4 h-4"
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
                            <span>Add Lesson</span>
                          </button>
                        </div>

                        @if (course.lessons && course.lessons.length > 0) {
                          <div class="space-y-2">
                            @for (lesson of course.lessons; track lesson.id) {
                              <div
                                class="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-indigo-200 transition-all"
                              >
                                <div class="flex items-center space-x-3">
                                  <div
                                    class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold"
                                  >
                                    {{ $index + 1 }}
                                  </div>
                                  <span class="text-sm font-medium text-gray-900">{{
                                    lesson.title
                                  }}</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                  <button
                                    (click)="editLesson(course.id!, lesson.id!)"
                                    class="text-sm text-indigo-600 hover:text-indigo-900"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    (click)="openDeleteLessonModal(lesson)"
                                    class="text-sm text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            }
                          </div>
                        } @else {
                          <p class="text-sm text-gray-500 italic">No lessons in this course yet.</p>
                        }

                        <div class="mt-6 pt-6 border-t border-gray-200">
                          <div class="flex justify-between items-center">
                            <div>
                              <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Course Quiz
                              </h4>
                              <p class="text-xs text-gray-500 mt-1">
                                Final assessment for the course
                              </p>
                            </div>
                            <button
                              (click)="manageQuiz(course.id!)"
                              class="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-100 transition-colors flex items-center space-x-2"
                            >
                              <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                              </svg>
                              <span>Manage Quiz</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        }
      </main>

      <!-- Create/Edit Modal -->
      @if (showModal()) {
        <div
          class="fixed inset-0 bg-gray-600/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-all duration-300"
          (click)="closeModal()"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-2xl rounded-xl bg-white scale-100"
            (click)="$event.stopPropagation()"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-900">
                {{ editingCourse() ? 'Edit Course' : 'Create Course' }}
              </h3>
              <button
                (click)="closeModal()"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveCourse()">
              <div class="space-y-4">
                <div>
                  <label for="title" class="block text-sm font-semibold text-gray-700"
                    >Title *</label
                  >
                  <input
                    type="text"
                    id="title"
                    [ngModel]="formData().title"
                    (ngModelChange)="updateFormField('title', $event)"
                    name="title"
                    required
                    class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border transition-all"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label for="description" class="block text-sm font-semibold text-gray-700"
                    >Description</label
                  >
                  <textarea
                    id="description"
                    [ngModel]="formData().description"
                    (ngModelChange)="updateFormField('description', $event)"
                    name="description"
                    rows="3"
                    class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border transition-all"
                    placeholder="Enter course description"
                  ></textarea>
                </div>

                <div>
                  <label for="imageUrl" class="block text-sm font-semibold text-gray-700"
                    >Image URL</label
                  >
                  <input
                    type="url"
                    id="imageUrl"
                    [ngModel]="formData().imageUrl"
                    (ngModelChange)="updateFormField('imageUrl', $event)"
                    name="imageUrl"
                    class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div class="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="saving() || !formData().title"
                  class="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  {{ saving() ? 'Saving...' : editingCourse() ? 'Update Course' : 'Create Course' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal()) {
        <div
          class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-all duration-300"
          (click)="closeDeleteModal()"
        >
          <div
            class="relative top-20 mx-auto p-6 border w-full max-w-sm shadow-2xl rounded-2xl bg-white"
            (click)="$event.stopPropagation()"
          >
            <div class="text-center">
              <div
                class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-5"
              >
                <svg
                  class="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Course?</h3>
              <p class="text-sm text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to delete
                <span class="font-semibold text-gray-700">"{{ courseToDelete()?.title }}"</span>?
                This action is permanent and cannot be undone.
              </p>
              <div class="flex flex-col space-y-3">
                <button
                  (click)="confirmDelete()"
                  [disabled]="deleting()"
                  class="w-full px-5 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-red-200 active:scale-95"
                >
                  {{ deleting() ? 'Deleting...' : 'Yes, Delete Course' }}
                </button>
                <button
                  (click)="closeDeleteModal()"
                  class="w-full px-5 py-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Delete Lesson Confirmation Modal -->
      @if (showDeleteLessonModal()) {
        <div
          class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-all duration-300"
          (click)="closeDeleteLessonModal()"
        >
          <div
            class="relative top-20 mx-auto p-6 border w-full max-w-sm shadow-2xl rounded-2xl bg-white"
            (click)="$event.stopPropagation()"
          >
            <div class="text-center">
              <div
                class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-5"
              >
                <svg
                  class="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Lesson?</h3>
              <p class="text-sm text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to delete
                <span class="font-semibold text-gray-700">"{{ lessonToDelete()?.title }}"</span>?
                This action is permanent.
              </p>
              <div class="flex flex-col space-y-3">
                <button
                  (click)="confirmDeleteLesson()"
                  [disabled]="deletingLesson()"
                  class="w-full px-5 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-red-200 active:scale-95"
                >
                  {{ deletingLesson() ? 'Deleting...' : 'Yes, Delete Lesson' }}
                </button>
                <button
                  (click)="closeDeleteLessonModal()"
                  class="w-full px-5 py-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CourseManagementComponent implements OnInit {
  private coursesService = inject(CoursesService);
  private lessonsService = inject(LessonsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  courses = signal<Course[]>([]);
  loading = signal(true);
  error = signal('');
  expandedCourses = signal<Set<number>>(new Set());

  // Modal state
  showModal = signal(false);
  showDeleteModal = signal(false);
  showDeleteLessonModal = signal(false);
  saving = signal(false);
  deleting = signal(false);
  deletingLesson = signal(false);
  editingCourse = signal<Course | null>(null);
  courseToDelete = signal<Course | null>(null);
  lessonToDelete = signal<Lesson | null>(null);

  formData = signal<CourseFormData>({
    title: '',
    description: '',
    imageUrl: '',
  });

  ngOnInit() {
    this.loadCourses();
    const expandedId = this.route.snapshot.queryParamMap.get('expanded');
    if (expandedId) {
      this.expandedCourses.update((set) => {
        const newSet = new Set(set);
        newSet.add(parseInt(expandedId, 10));
        return newSet;
      });
    }
  }

  loadCourses() {
    this.loading.set(true);
    this.error.set('');

    this.coursesService.apiCoursesGet().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load courses. Please try again.');
        this.loading.set(false);
        console.error('Error loading courses:', err);
      },
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  openCreateModal() {
    this.editingCourse.set(null);
    this.formData.set({ title: '', description: '', imageUrl: '' });
    this.showModal.set(true);
  }

  openEditModal(course: Course) {
    this.editingCourse.set(course);
    this.formData.set({
      title: course.title || '',
      description: course.description || '',
      imageUrl: course.imageUrl || '',
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingCourse.set(null);
  }

  openDeleteModal(course: Course) {
    this.courseToDelete.set(course);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.courseToDelete.set(null);
  }

  // Accordion Logic
  toggleAccordion(courseId: any) {
    this.expandedCourses.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  }

  isExpanded(courseId: any): boolean {
    return this.expandedCourses().has(courseId);
  }

  // Lesson Management
  addLesson(courseId: any) {
    this.router.navigate(['/courses', courseId, 'lessons', 'add']);
  }

  editLesson(courseId: any, lessonId: any) {
    this.router.navigate(['/courses', courseId, 'lessons', lessonId, 'edit']);
  }

  manageQuiz(courseId: any) {
    this.router.navigate(['/courses', courseId, 'quiz', 'manage']);
  }

  openDeleteLessonModal(lesson: Lesson) {
    this.lessonToDelete.set(lesson);
    this.showDeleteLessonModal.set(true);
  }

  closeDeleteLessonModal() {
    this.showDeleteLessonModal.set(false);
    this.lessonToDelete.set(null);
  }

  confirmDeleteLesson() {
    const lesson = this.lessonToDelete();
    if (!lesson) return;

    this.deletingLesson.set(true);
    this.lessonsService.apiLessonsIdDelete(lesson.id!).subscribe({
      next: () => {
        this.deletingLesson.set(false);
        this.closeDeleteLessonModal();
        this.loadCourses(); // Refresh to get updated lessons list in courses
      },
      error: (err) => {
        this.deletingLesson.set(false);
        this.error.set('Failed to delete lesson.');
        console.error('Error deleting lesson:', err);
      },
    });
  }

  updateFormField(field: keyof CourseFormData, value: string) {
    this.formData.update((prev) => ({ ...prev, [field]: value }));
  }

  saveCourse() {
    const currentData = this.formData();
    const editing = this.editingCourse();

    if (!currentData.title) return;

    this.saving.set(true);

    if (editing) {
      // Update existing course
      const updateData: UpdateCourseDto = {
        title: currentData.title,
        description: currentData.description || null,
        imageUrl: currentData.imageUrl || null,
      };

      this.coursesService.apiCoursesIdPut(editing.id!, updateData).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.loadCourses();
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set('Failed to update course. Please try again.');
          console.error('Error updating course:', err);
        },
      });
    } else {
      // Create new course
      const createData: CreateCourseDto = {
        title: currentData.title,
        description: currentData.description || null,
        imageUrl: currentData.imageUrl || null,
      };

      this.coursesService.apiCoursesPost(createData).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.loadCourses();
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set('Failed to create course. Please try again.');
          console.error('Error creating course:', err);
        },
      });
    }
  }

  confirmDelete() {
    const deletingCourse = this.courseToDelete();
    if (!deletingCourse) return;

    this.deleting.set(true);

    this.coursesService.apiCoursesIdDelete(deletingCourse.id!).subscribe({
      next: () => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.loadCourses();
      },
      error: (err) => {
        this.deleting.set(false);
        this.error.set('Failed to delete course. Please try again.');
        console.error('Error deleting course:', err);
      },
    });
  }
}
