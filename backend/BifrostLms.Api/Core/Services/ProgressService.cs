using Microsoft.EntityFrameworkCore;
using BifrostLms.Api.Data;
using BifrostLms.Api.Core.Entities;

namespace BifrostLms.Api.Core.Services;

public class ProgressService : IProgressService
{
    private readonly AppDbContext _context;

    public ProgressService(AppDbContext context)
    {
        _context = context;
    }

    public async Task UpdateStudentProgressAsync(string userId, int courseId)
    {
        var course = await _context.Courses
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(c => c.Id == courseId);

        if (course == null) return;

        var totalLessons = course.Lessons.Count;
        var completedLessons = await _context.LessonProgresses
            .CountAsync(lp => lp.StudentId == userId && course.Lessons.Select(l => l.Id).Contains(lp.LessonId) && lp.IsCompleted);

        var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.CourseId == courseId);
        var isQuizPassed = quiz != null && await _context.QuizAttempts
            .AnyAsync(qa => qa.StudentId == userId && qa.QuizId == quiz.Id && qa.IsPassed);

        var studentProgress = await _context.StudentProgresses
            .FirstOrDefaultAsync(p => p.StudentId == userId && p.CourseId == courseId);

        if (studentProgress != null)
        {
            double lessonProgress = totalLessons > 0 ? (double)completedLessons / totalLessons : 1.0;
            double quizProgress = isQuizPassed ? 1.0 : 0.0;

            double progressValue;
            if (quiz == null)
            {
                progressValue = lessonProgress * 100;
            }
            else
            {
                // Lesson Progress * 90 + Quiz Progress * 10
                // Max 100% only if everything is done.
                progressValue = (lessonProgress * 90) + (quizProgress * 10);
            }

            studentProgress.ProgressPercentage = (int)progressValue;
            studentProgress.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RecalculateAllStudentsProgressInCourseAsync(int courseId)
    {
        var studentIds = await _context.StudentProgresses
            .Where(p => p.CourseId == courseId)
            .Select(p => p.StudentId)
            .ToListAsync();

        foreach (var userId in studentIds)
        {
            await UpdateStudentProgressAsync(userId, courseId);
        }
    }
}
