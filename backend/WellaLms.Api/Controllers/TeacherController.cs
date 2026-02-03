using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WellaLms.Api.Core.Entities;
using WellaLms.Api.Data;

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
        // In a real app, you might handle file upload here and save to disk/cloud
        // For now, we assume the resource contains the URL/Link
        if (string.IsNullOrEmpty(resource.TenantId))
        {
            // Simple tenant logic - simulate getting from user claim or default
            resource.TenantId = "default-tenant"; 
        }

        _context.Resources.Add(resource);
        await _context.SaveChangesAsync();

        return Ok(resource);
    }

    // GET: api/Teacher/student-progress
    [HttpGet("student-progress")]
    public async Task<ActionResult<IEnumerable<StudentProgress>>> GetStudentProgress()
    {
        var progress = await _context.StudentProgresses
            .Include(sp => sp.Student)
            .Include(sp => sp.Course)
            .ToListAsync();

        return Ok(progress);
    }
}
