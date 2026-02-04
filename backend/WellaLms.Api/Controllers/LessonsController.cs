using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellaLms.Api.Core.DTOs;
using WellaLms.Api.Core.Entities;
using WellaLms.Api.Data;

namespace WellaLms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Teacher,Admin")]
public class LessonsController : ControllerBase
{
    private readonly AppDbContext _context;

    public LessonsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Lessons/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Lesson>> GetLesson(int id)
    {
        var lesson = await _context.Lessons.FindAsync(id);

        if (lesson == null)
        {
            return NotFound();
        }

        return lesson;
    }

    // POST: api/Lessons
    [HttpPost]
    public async Task<ActionResult<Lesson>> PostLesson(CreateLessonDto dto)
    {
        // Verify course exists
        var course = await _context.Courses.FindAsync(dto.CourseId);
        if (course == null)
        {
            return BadRequest("Course not found");
        }

        var lesson = new Lesson
        {
            Title = dto.Title,
            Content = dto.Content,
            CourseId = dto.CourseId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLesson), new { id = lesson.Id }, lesson);
    }

    // PUT: api/Lessons/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutLesson(int id, UpdateLessonDto dto)
    {
        var lesson = await _context.Lessons.FindAsync(id);

        if (lesson == null)
        {
            return NotFound();
        }

        lesson.Title = dto.Title;
        lesson.Content = dto.Content;
        lesson.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Lessons/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLesson(int id)
    {
        var lesson = await _context.Lessons.FindAsync(id);

        if (lesson == null)
        {
            return NotFound();
        }

        _context.Lessons.Remove(lesson);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
