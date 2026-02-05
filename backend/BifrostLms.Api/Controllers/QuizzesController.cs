using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BifrostLms.Api.Core.DTOs;
using BifrostLms.Api.Core.Entities;
using BifrostLms.Api.Data;
using BifrostLms.Api.Core.Services;

namespace BifrostLms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Teacher")]
public class QuizzesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IProgressService _progressService;

    public QuizzesController(AppDbContext context, IProgressService progressService)
    {
        _context = context;
        _progressService = progressService;
    }

    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<QuizDto>> GetQuizByCourse(int courseId)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Choices)
            .FirstOrDefaultAsync(q => q.CourseId == courseId);

        if (quiz == null) return NotFound();

        return Ok(MapToDto(quiz));
    }

    [HttpPost("course/{courseId}")]
    public async Task<ActionResult<QuizDto>> CreateQuiz(int courseId, CreateQuizDto dto)
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null) return NotFound("Course not found");

        var quiz = new Quiz
        {
            CourseId = courseId,
            Title = dto.Title,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();

        await _progressService.RecalculateAllStudentsProgressInCourseAsync(courseId);

        return CreatedAtAction(nameof(GetQuizByCourse), new { courseId = courseId }, MapToDto(quiz));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuiz(int id, CreateQuizDto dto)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null) return NotFound();

        quiz.Title = dto.Title;
        quiz.Description = dto.Description;
        quiz.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(int id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null) return NotFound();

        var courseId = quiz.CourseId;
        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        await _progressService.RecalculateAllStudentsProgressInCourseAsync(courseId);

        return NoContent();
    }

    [HttpPost("{quizId}/questions")]
    public async Task<ActionResult<QuestionDto>> AddQuestion(int quizId, CreateQuestionDto dto)
    {
        var quiz = await _context.Quizzes.FindAsync(quizId);
        if (quiz == null) return NotFound("Quiz not found");

        var question = new Question
        {
            QuizId = quizId,
            Text = dto.Text,
            CreatedAt = DateTime.UtcNow
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return Ok(new QuestionDto { Id = question.Id, Text = question.Text });
    }

    [HttpDelete("questions/{questionId}")]
    public async Task<IActionResult> DeleteQuestion(int questionId)
    {
        var question = await _context.Questions.FindAsync(questionId);
        if (question == null) return NotFound();

        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("questions/{questionId}/choices")]
    public async Task<ActionResult<ChoiceDto>> AddChoice(int questionId, CreateChoiceDto dto)
    {
        var question = await _context.Questions.FindAsync(questionId);
        if (question == null) return NotFound("Question not found");

        var choice = new Choice
        {
            QuestionId = questionId,
            Text = dto.Text,
            IsCorrect = dto.IsCorrect,
            CreatedAt = DateTime.UtcNow
        };

        _context.Choices.Add(choice);
        await _context.SaveChangesAsync();

        return Ok(new ChoiceDto { Id = choice.Id, Text = choice.Text, IsCorrect = choice.IsCorrect });
    }

    [HttpDelete("choices/{choiceId}")]
    public async Task<IActionResult> DeleteChoice(int choiceId)
    {
        var choice = await _context.Choices.FindAsync(choiceId);
        if (choice == null) return NotFound();

        _context.Choices.Remove(choice);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}/batch")]
    public async Task<IActionResult> BatchUpdate(int id, BatchUpdateQuizDto dto)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Choices)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null) return NotFound();

        // 1. Update Quiz Info
        quiz.Title = dto.Title;
        quiz.Description = dto.Description;
        quiz.UpdatedAt = DateTime.UtcNow;

        // 2. Synchronize Questions
        var existingQuestions = quiz.Questions.ToList();
        var dtoQuestions = dto.Questions;

        // Delete questions not in DTO
        foreach (var existingQ in existingQuestions)
        {
            if (!dtoQuestions.Any(dq => dq.Id == existingQ.Id))
            {
                _context.Questions.Remove(existingQ);
            }
        }

        // Add or Update questions
        foreach (var dq in dtoQuestions)
        {
            Question question;
            if (dq.Id.HasValue && dq.Id.Value != 0)
            {
                question = existingQuestions.FirstOrDefault(eq => eq.Id == dq.Id.Value);
                if (question == null) continue; // Should not happen if data is consistent
                question.Text = dq.Text;
            }
            else
            {
                question = new Question
                {
                    QuizId = id,
                    Text = dq.Text,
                    CreatedAt = DateTime.UtcNow
                };
                quiz.Questions.Add(question);
                _context.Questions.Add(question);
            }

            // Synchronize Choices for this question
            var existingChoices = (question.Choices ?? new List<Choice>()).ToList();
            var dtoChoices = dq.Choices;

            // Delete choices not in DTO
            foreach (var existingC in existingChoices)
            {
                if (!dtoChoices.Any(dc => dc.Id == existingC.Id))
                {
                    _context.Choices.Remove(existingC);
                }
            }

            // Add or Update choices
            foreach (var dc in dtoChoices)
            {
                if (dc.Id.HasValue && dc.Id.Value != 0)
                {
                    var choice = existingChoices.FirstOrDefault(ec => ec.Id == dc.Id.Value);
                    if (choice != null)
                    {
                        choice.Text = dc.Text;
                        choice.IsCorrect = dc.IsCorrect;
                    }
                }
                else
                {
                    var choice = new Choice
                    {
                        Question = question,
                        Text = dc.Text,
                        IsCorrect = dc.IsCorrect,
                        CreatedAt = DateTime.UtcNow
                    };
                    question.Choices.Add(choice);
                    _context.Choices.Add(choice);
                }
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    private QuizDto MapToDto(Quiz quiz)
    {
        return new QuizDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            Questions = quiz.Questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                Text = q.Text,
                Choices = q.Choices.Select(c => new ChoiceDto
                {
                    Id = c.Id,
                    Text = c.Text,
                    IsCorrect = c.IsCorrect
                }).ToList()
            }).ToList()
        };
    }
}
