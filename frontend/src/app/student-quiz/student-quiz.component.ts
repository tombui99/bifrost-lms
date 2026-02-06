import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentProgressService } from '../api/api/studentProgress.service';
import { QuizDto, QuizSubmissionDto, QuizResultDto } from '../api/model/models';
import { NotificationService } from '../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../core/language/language.service';

@Component({
  selector: 'app-student-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex items-center space-x-4 mb-8">
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
          @if (quiz()) {
            <div>
              <h1 class="text-3xl font-extrabold text-gray-900">{{ quiz()?.title }}</h1>
              <p class="text-gray-500">
                {{ quiz()?.description || ('QUIZ.QUIZ_DESC' | translate) }}
              </p>
            </div>
          }
        </div>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        } @else if (result()) {
          <!-- Quiz Result State -->
          <div
            class="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center animate-fadeIn"
          >
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              [ngClass]="
                result()!.isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              "
            >
              @if (result()!.isPassed) {
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              } @else {
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              }
            </div>

            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              {{
                result()!.isPassed
                  ? ('QUIZ.CONGRATULATIONS' | translate)
                  : ('QUIZ.NOT_QUITE_THERE' | translate)
              }}
            </h2>
            <p class="text-lg text-gray-500 mb-8">
              {{ 'QUIZ.YOU_SCORED' | translate }}
              <span
                class="font-bold"
                [class.text-green-600]="result()!.isPassed"
                [class.text-red-600]="!result()!.isPassed"
                >{{ score() | number: '1.0-0' }}%</span
              >.
              @if (result()!.isPassed) {
                {{ 'QUIZ.PASSED_MSG' | translate }}
              } @else {
                {{ 'QUIZ.FAILED_MSG' | translate }}
              }
            </p>

            <div class="flex flex-col sm:flex-row justify-center gap-4">
              @if (!result()!.isPassed) {
                <button
                  (click)="resetQuiz()"
                  class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  {{ 'COURSE.TRY_AGAIN' | translate }}
                </button>
              }
              <button
                (click)="goBack()"
                class="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors"
              >
                {{ 'QUIZ.BACK_TO_COURSE' | translate }}
              </button>
            </div>
          </div>
        } @else if (quiz()) {
          <!-- Quiz Questions Style -->
          <div class="space-y-8 pb-20">
            @for (question of quiz()!.questions; track question.id; let i = $index) {
              <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn"
                [style.animation-delay]="i * 0.1 + 's'"
              >
                <div class="p-6 bg-gray-50/50 border-b border-gray-50">
                  <div class="flex items-start space-x-4">
                    <div
                      class="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm"
                    >
                      {{ i + 1 }}
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 pt-0.5">{{ question.text }}</h3>
                  </div>
                </div>
                <div class="p-6 space-y-3">
                  @for (choice of question.choices; track choice.id) {
                    <label
                      class="flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer group"
                      [ngClass]="
                        getAnswer(question.id) === choice.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      "
                    >
                      <input
                        type="radio"
                        [name]="'question-' + question.id"
                        [value]="choice.id"
                        [ngModel]="getAnswer(question.id)"
                        (ngModelChange)="setAnswer(question.id, $event)"
                        class="hidden"
                      />
                      <div
                        class="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors"
                        [ngClass]="
                          getAnswer(question.id) === choice.id
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300 group-hover:border-gray-400'
                        "
                      >
                        @if (getAnswer(question.id) === choice.id) {
                          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                        }
                      </div>
                      <span
                        class="text-gray-700 font-medium transition-colors"
                        [class.text-indigo-900]="getAnswer(question.id) === choice.id"
                      >
                        {{ choice.text }}
                      </span>
                    </label>
                  }
                </div>
              </div>
            }

            <!-- Submit Button Footer -->
            <div
              class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 z-40"
            >
              <div class="max-w-3xl mx-auto flex items-center justify-between">
                <p class="text-sm font-medium text-gray-500">
                  {{ answeredCount() }} {{ 'COMMON.OF' | translate }}
                  {{ quiz()!.questions?.length || 0 }} {{ 'QUIZ.QUESTIONS_ANSWERED' | translate }}
                </p>
                <button
                  (click)="submitQuiz()"
                  [disabled]="!allAnswered() || submitting()"
                  class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {{
                    submitting()
                      ? ('QUIZ.SUBMITTING' | translate)
                      : ('QUIZ.SUBMIT_QUIZ' | translate)
                  }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fadeIn {
        animation: fadeIn 0.4s ease-out backwards;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class StudentQuizComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private progressService = inject(StudentProgressService);
  private notificationService = inject(NotificationService);
  public languageService = inject(LanguageService);

  courseId!: number;
  quizId!: number;
  quiz = signal<QuizDto | null>(null);
  loading = signal(true);
  submitting = signal(false);
  result = signal<QuizResultDto | null>(null);

  answers = signal<{ [key: string]: any }>({});

  score = computed(() => {
    const res = this.result();
    return res ? (res.score as any as number) : (0 as number);
  });

  answeredCount = computed(() => {
    return Object.keys(this.answers()).filter((id) => this.answers()[id]).length;
  });

  allAnswered = computed(() => {
    const questions = this.quiz()?.questions;
    const currentAnswers = this.answers();
    if (!questions) return false;
    return questions.every((q) => currentAnswers[q.id as any] !== undefined);
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.courseId = +params['courseId'];
      this.quizId = +params['quizId'];
      this.loadQuiz();
    });
  }

  loadQuiz() {
    this.loading.set(true);
    this.progressService.apiStudentProgressQuizQuizIdGet(this.quizId).subscribe({
      next: (data) => {
        this.quiz.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading quiz', err);
        this.notificationService.error('Failed to load quiz. Please try again later.');
        this.goBack();
      },
    });
  }

  getAnswer(questionId: any): any {
    return this.answers()[questionId];
  }

  setAnswer(questionId: any, choiceId: any) {
    this.answers.update((prev) => ({ ...prev, [questionId]: choiceId }));
  }

  submitQuiz() {
    if (this.submitting()) return;

    const submission: QuizSubmissionDto = {
      quizId: this.quizId,
      answers: Object.entries(this.answers()).map(([qId, cId]) => ({
        questionId: +qId as any,
        selectedChoiceId: cId as any,
      })),
    };

    this.submitting.set(true);
    this.progressService.apiStudentProgressQuizQuizIdSubmitPost(this.quizId, submission).subscribe({
      next: (res) => {
        this.result.set(res);
        this.submitting.set(false);
        if (res.isPassed) {
          this.notificationService.success('You passed the quiz! Course progress updated.');
        } else {
          this.notificationService.info('You did not pass. Feel free to try again.');
        }
      },
      error: (err: any) => {
        console.error('Error submitting quiz', err);
        this.notificationService.error('Failed to submit quiz. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  resetQuiz() {
    this.result.set(null);
    this.answers.set({});
  }

  goBack() {
    this.router.navigate(['/student/courses', this.courseId]);
  }
}
