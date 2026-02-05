using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellaLms.Api.Core.Entities;
using WellaLms.Api.Data;
using WellaLms.Api.Core.DTOs;

namespace WellaLms.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Teacher,Admin")]
public class TeacherController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeacherController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/Teacher/upload-doc
    [HttpPost("upload-doc")]
    public async Task<ActionResult<Resource>> UploadDocument([FromBody] Resource resource)
    {
        if (string.IsNullOrEmpty(resource.TenantId))
        {
            resource.TenantId = "default-tenant"; 
        }

        _context.Resources.Add(resource);
        await _context.SaveChangesAsync();

        return Ok(resource);
    }

    // GET: api/Teacher/student-progress
    [HttpGet("student-progress")]
    public async Task<ActionResult<IEnumerable<TeacherStudentProgressDto>>> GetStudentProgress()
    {
        var progress = await _context.StudentProgresses
            .Include(sp => sp.Student)
            .Include(sp => sp.Course)
            .Select(sp => new TeacherStudentProgressDto
            {
                StudentId = sp.StudentId,
                StudentName = sp.Student.FullName ?? sp.Student.UserName ?? "Unknown",
                StudentEmail = sp.Student.Email ?? "No Email",
                CourseId = sp.CourseId,
                CourseTitle = sp.Course.Title,
                ProgressPercentage = sp.ProgressPercentage,
                JoinedAt = sp.CreatedAt
            })
            .ToListAsync();

        return Ok(progress);
    }

    // GET: api/Teacher/quiz-attempts
    [HttpGet("quiz-attempts")]
    public async Task<ActionResult<IEnumerable<TeacherQuizAttemptDto>>> GetQuizAttempts()
    {
        var attempts = await _context.QuizAttempts
            .Include(qa => qa.Student)
            .Include(qa => qa.Quiz)
            .Select(qa => new TeacherQuizAttemptDto
            {
                Id = qa.Id,
                StudentName = qa.Student.FullName ?? qa.Student.UserName ?? "Unknown",
                QuizId = qa.QuizId,
                QuizTitle = qa.Quiz.Title,
                Score = qa.Score,
                IsPassed = qa.IsPassed,
                CompletedAt = qa.CompletedAt
            })
            .OrderByDescending(qa => qa.CompletedAt)
            .ToListAsync();

        return Ok(attempts);
    }
}
