import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizzesService } from '../api/api/quizzes.service';
import {
  QuizDto,
  QuestionDto,
  ChoiceDto,
  CreateQuizDto,
  BatchUpdateQuizDto,
  BatchUpdateQuestionDto,
  BatchUpdateChoiceDto,
} from '../api/model/models';

@Component({
  selector: 'app-quiz-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center space-x-4">
            <button (click)="goBack()" class="text-gray-600 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 class="text-3xl font-extrabold text-gray-900">Manage Course Quiz</h1>
          </div>
          <div class="flex items-center space-x-3">
            @if (hasChanges()) {
              <button
                (click)="discardChanges()"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                [disabled]="saving()"
              >
                Discard
              </button>
              <button
                (click)="saveChanges()"
                class="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                [disabled]="saving()"
              >
                @if (saving()) {
                  <div
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  ></div>
                }
                <span>{{ saving() ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            }
            @if (quiz()) {
              <button
                (click)="deleteQuiz()"
                class="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete Quiz
              </button>
            }
          </div>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        } @else if (!editingQuiz()) {
          <!-- Quiz Creation State -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div
              class="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-indigo-600"
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
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">No Quiz Found</h2>
            <p class="text-gray-500 mb-6">
              Create a final quiz to assess student learning at the end of this course.
            </p>

            <div class="max-w-md mx-auto space-y-4">
              <input
                type="text"
                [(ngModel)]="newQuizTitle"
                placeholder="Quiz Title (e.g., Final Exam)"
                class="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border"
              />
              <button
                (click)="createQuiz()"
                [disabled]="!newQuizTitle || saving()"
                class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                Create Quiz
              </button>
            </div>
          </div>
        } @else {
          <!-- Quiz Management State -->
          <div class="space-y-6">
            <!-- Quiz Info -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ editingQuiz()?.title }}</h2>
                  <p class="text-gray-500">
                    {{ editingQuiz()?.description || 'No description provided.' }}
                  </p>
                </div>
                <button
                  (click)="editingInfo.set(true)"
                  class="text-indigo-600 hover:text-indigo-800 text-sm font-bold"
                >
                  Edit Info
                </button>
              </div>

              @if (editingInfo()) {
                <div class="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
                  <input
                    type="text"
                    [ngModel]="editingQuiz()?.title"
                    (ngModelChange)="updateLocalQuizInfo({ title: $event })"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                  />
                  <textarea
                    [ngModel]="editingQuiz()?.description"
                    (ngModelChange)="updateLocalQuizInfo({ description: $event })"
                    placeholder="Description"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                  ></textarea>
                  <div class="flex justify-end">
                    <button
                      (click)="editingInfo.set(false)"
                      class="px-4 py-2 text-sm text-indigo-600 font-bold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Questions List -->
            <div class="space-y-4">
              <div class="flex items-center justify-between px-2">
                <h3 class="text-lg font-bold text-gray-800">
                  Questions ({{ editingQuiz()?.questions?.length || 0 }})
                </h3>
                <button
                  (click)="showAddQuestion.set(true)"
                  class="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add Question</span>
                </button>
              </div>

              @if (showAddQuestion()) {
                <div
                  class="bg-white rounded-2xl shadow-md border-2 border-indigo-100 p-6 animate-fadeIn"
                >
                  <h4 class="font-bold text-gray-900 mb-4">New Question</h4>
                  <input
                    type="text"
                    [(ngModel)]="newQuestionText"
                    placeholder="Question Text"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border mb-4"
                  />
                  <div class="flex justify-end space-x-2">
                    <button
                      (click)="showAddQuestion.set(false)"
                      class="px-3 py-1.5 text-sm text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      (click)="addQuestionLocally()"
                      [disabled]="!newQuestionText"
                      class="px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50"
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              }

              @for (question of editingQuiz()?.questions; track $index; let i = $index) {
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div class="p-6 border-b border-gray-50 flex justify-between items-start">
                    <div class="flex space-x-4 flex-1">
                      <div
                        class="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm"
                      >
                        {{ i + 1 }}
                      </div>
                      <input
                        type="text"
                        [ngModel]="question.text"
                        (ngModelChange)="updateQuestionText(i, $event)"
                        class="font-bold text-gray-900 w-full border-none focus:ring-0 p-0 bg-transparent"
                        placeholder="Type question here..."
                      />
                    </div>
                    <button
                      (click)="deleteQuestionLocally(i)"
                      class="text-red-400 hover:text-red-600"
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

                  <div class="p-6 bg-gray-50/30">
                    <div class="space-y-3 mb-4">
                      @for (choice of question.choices; track $index; let j = $index) {
                        <div
                          class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                        >
                          <div class="flex items-center space-x-3 flex-1">
                            <button
                              (click)="toggleCorrectChoice(i, j)"
                              class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                              [ngClass]="
                                choice.isCorrect
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-200 hover:border-green-300'
                              "
                            >
                              @if (choice.isCorrect) {
                                <svg
                                  class="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              }
                            </button>
                            <input
                              type="text"
                              [ngModel]="choice.text"
                              (ngModelChange)="updateChoiceText(i, j, $event)"
                              class="text-sm font-medium w-full border-none focus:ring-0 p-0 bg-transparent"
                              [class.text-green-700]="choice.isCorrect"
                            />
                            @if (choice.isCorrect) {
                              <span
                                class="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded shrink-0"
                                >CORRECT</span
                              >
                            }
                          </div>
                          <button
                            (click)="deleteChoiceLocally(i, j)"
                            class="text-gray-400 hover:text-red-500 ml-2"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      }
                    </div>

                    <div class="flex items-center space-x-2">
                      <input
                        type="text"
                        [ngModel]="getNewChoice(i)"
                        (ngModelChange)="setNewChoice(i, $event)"
                        placeholder="New Choice..."
                        class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-1.5 border text-sm"
                      />
                      <label class="flex items-center space-x-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          [ngModel]="getIsCorrect(i)"
                          (ngModelChange)="setIsCorrect(i, $event)"
                          class="rounded text-indigo-600"
                        />
                        <span class="text-xs text-gray-500">Correct?</span>
                      </label>
                      <button
                        (click)="addChoiceLocally(i)"
                        [disabled]="!getNewChoice(i)"
                        class="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class QuizEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizzesService = inject(QuizzesService);

  courseId!: number;
  quiz = signal<QuizDto | null>(null);
  editingQuiz = signal<QuizDto | null>(null);
  loading = signal(true);
  saving = signal(false);

  // Create Quiz Form
  newQuizTitle = '';

  // Edit Info Form
  editingInfo = signal(false);

  // Add Question Form
  showAddQuestion = signal(false);
  newQuestionText = '';

  // Add Choice Forms (mapped by internal question index)
  newChoices: { [key: number]: string } = {};
  isCorrectFlags: { [key: number]: boolean } = {};

  hasChanges = computed(() => {
    return JSON.stringify(this.quiz()) !== JSON.stringify(this.editingQuiz());
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.courseId = +params['courseId'];
      this.loadQuiz();
    });
  }

  loadQuiz() {
    this.loading.set(true);
    this.quizzesService.apiQuizzesCourseCourseIdGet(this.courseId).subscribe({
      next: (data: QuizDto) => {
        const quizData = JSON.parse(JSON.stringify(data));
        this.quiz.set(quizData);
        this.editingQuiz.set(JSON.parse(JSON.stringify(quizData)));
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading quiz', err);
        this.quiz.set(null);
        this.editingQuiz.set(null);
        this.loading.set(false);
      },
    });
  }

  updateLocalQuizInfo(updates: { title?: string; description?: string }) {
    this.editingQuiz.update((q) => {
      if (!q) return q;
      return { ...q, ...updates };
    });
  }

  updateQuestionText(index: number, text: string) {
    this.editingQuiz.update((q) => {
      if (!q || !q.questions) return q;
      const questions = [...q.questions];
      questions[index] = { ...questions[index], text };
      return { ...q, questions };
    });
  }

  addQuestionLocally() {
    if (!this.newQuestionText) return;
    this.editingQuiz.update((q) => {
      if (!q) return q;
      const questions = q.questions || [];
      return {
        ...q,
        questions: [...questions, { id: 0, text: this.newQuestionText, choices: [] }],
      };
    });
    this.newQuestionText = '';
    this.showAddQuestion.set(false);
  }

  deleteQuestionLocally(index: number) {
    this.editingQuiz.update((q) => {
      if (!q || !q.questions) return q;
      const questions = [...q.questions];
      questions.splice(index, 1);
      return { ...q, questions };
    });
  }

  updateChoiceText(qIndex: number, cIndex: number, text: string) {
    this.editingQuiz.update((q) => {
      if (!q || !q.questions) return q;
      const questions = [...q.questions];
      const choices = [...(questions[qIndex].choices || [])];
      choices[cIndex] = { ...choices[cIndex], text };
      questions[qIndex] = { ...questions[qIndex], choices };
      return { ...q, questions };
    });
  }

  toggleCorrectChoice(qIndex: number, cIndex: number) {
    this.editingQuiz.update((q) => {
      if (!q || !q.questions) return q;
      const questions = [...q.questions];
      const choices = questions[qIndex].choices?.map((c, i) => ({
        ...c,
        isCorrect: i === cIndex,
      }));
      questions[qIndex] = { ...questions[qIndex], choices };
      return { ...q, questions };
    });
  }

  addChoiceLocally(qIndex: number) {
    const text = this.newChoices[qIndex];
    if (!text) return;
    const isCorrect = this.isCorrectFlags[qIndex] || false;

    this.editingQuiz.update((q) => {
      if (!q || !q.questions) return q;
      const questions = [...q.questions];
      const choices = [...(questions[qIndex].choices || [])];

      // If this new choice is correct, unmark others
      if (isCorrect) {
        choices.forEach((c) => (c.isCorrect = false));
      }

      choices.push({ id: 0, text, isCorrect });
      questions[qIndex] = { ...questions[qIndex], choices };
      return { ...q, questions };
    });

    this.newChoices[qIndex] = '';
    this.isCorrectFlags[qIndex] = false;
  }

  deleteChoiceLocally(qIndex: number, cIndex: number) {
    this.editingQuiz.update((q) => {
      if (!q || !q.questions) return q;
      const questions = [...q.questions];
      const choices = [...(questions[qIndex].choices || [])];
      choices.splice(cIndex, 1);
      questions[qIndex] = { ...questions[qIndex], choices };
      return { ...q, questions };
    });
  }

  saveChanges() {
    const current = this.editingQuiz();
    if (!current || this.saving()) return;

    this.saving.set(true);
    const dto: BatchUpdateQuizDto = {
      title: current.title!,
      description: current.description,
      questions: (current.questions || []).map((q) => ({
        id: q.id as any,
        text: q.text!,
        choices: (q.choices || []).map((c) => ({
          id: c.id as any,
          text: c.text!,
          isCorrect: c.isCorrect!,
        })),
      })),
    };

    this.quizzesService.apiQuizzesIdBatchPut(current.id as any, dto).subscribe({
      next: () => {
        this.saving.set(false);
        this.loadQuiz();
      },
      error: (err: any) => {
        console.error('Error saving quiz', err);
        this.saving.set(false);
        alert('Failed to save changes. Please try again.');
      },
    });
  }

  discardChanges() {
    if (confirm('Discard all unsaved changes?')) {
      this.editingQuiz.set(JSON.parse(JSON.stringify(this.quiz())));
      this.editingInfo.set(false);
    }
  }

  getNewChoice(index: number): string {
    return this.newChoices[index] || '';
  }

  setNewChoice(index: number, value: string) {
    this.newChoices[index] = value;
  }

  getIsCorrect(index: number): boolean {
    return this.isCorrectFlags[index] || false;
  }

  setIsCorrect(index: number, value: boolean) {
    this.isCorrectFlags[index] = value;
  }

  createQuiz() {
    const dto: CreateQuizDto = {
      title: this.newQuizTitle,
      description: '',
    };
    this.saving.set(true);
    this.quizzesService.apiQuizzesCourseCourseIdPost(this.courseId, dto).subscribe({
      next: () => {
        this.newQuizTitle = '';
        this.saving.set(false);
        this.loadQuiz();
      },
      error: (err: any) => {
        console.error('Error creating quiz', err);
        this.saving.set(false);
      },
    });
  }

  deleteQuiz() {
    if (
      !confirm('Are you sure you want to delete this quiz? All questions and choices will be lost.')
    )
      return;

    this.quizzesService.apiQuizzesIdDelete(this.quiz()!.id as any).subscribe({
      next: () => this.loadQuiz(),
      error: (err: any) => console.error('Error deleting quiz', err),
    });
  }

  goBack() {
    if (this.hasChanges()) {
      if (!confirm('You have unsaved changes. Are you sure you want to go back?')) {
        return;
      }
    }
    this.router.navigate(['/courses/manage'], {
      queryParams: { expanded: this.courseId },
    });
  }
}
