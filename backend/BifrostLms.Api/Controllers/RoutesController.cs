using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BifrostLms.Api.Core.DTOs;
using BifrostLms.Api.Core.Entities;
using BifrostLms.Api.Data;

using Microsoft.AspNetCore.Identity;

namespace BifrostLms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public RoutesController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    private string? GetUserId()
    {
        return User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;
    }

    [HttpGet("my")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<IEnumerable<RouteDto>>> GetMyRoutes()
    {
        var userId = GetUserId();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null || user.DepartmentId == null) return Enumerable.Empty<RouteDto>().ToList();

        var routes = await _context.Routes
            .Include(r => r.RouteCourses)
            .ThenInclude(rc => rc.Course)
            .Where(r => r.DepartmentRoutes.Any(dr => dr.DepartmentId == user.DepartmentId))
            .Select(r => new RouteDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                Courses = r.RouteCourses.OrderBy(rc => rc.Order).Select(rc => new RouteCourseDto
                {
                    CourseId = rc.CourseId,
                    CourseTitle = rc.Course != null ? rc.Course.Title : "Unknown Course",
                    Order = rc.Order
                }).ToList()
            })
            .ToListAsync();

        return routes;
    }

    [HttpGet]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<IEnumerable<RouteDto>>> GetRoutes()
    {
        return await _context.Routes
            .Include(r => r.RouteCourses)
            .ThenInclude(rc => rc.Course)
            .Select(r => new RouteDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                Courses = r.RouteCourses.OrderBy(rc => rc.Order).Select(rc => new RouteCourseDto
                {
                    CourseId = rc.CourseId,
                    CourseTitle = rc.Course.Title,
                    Order = rc.Order
                }).ToList()
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<RouteDto>> GetRoute(int id)
    {
        var route = await _context.Routes
            .Include(r => r.RouteCourses)
            .ThenInclude(rc => rc.Course)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (route == null) return NotFound();

        return new RouteDto
        {
            Id = route.Id,
            Name = route.Name,
            Description = route.Description,
            Courses = route.RouteCourses.OrderBy(rc => rc.Order).Select(rc => new RouteCourseDto
            {
                CourseId = rc.CourseId,
                CourseTitle = rc.Course != null ? rc.Course.Title : "Unknown",
                Order = rc.Order
            }).ToList()
        };
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<BifrostLms.Api.Core.Entities.Route>> PostRoute(CreateRouteDto dto)
    {
        var route = new BifrostLms.Api.Core.Entities.Route
        {
            Name = dto.Name,
            Description = dto.Description
        };

        _context.Routes.Add(route);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoute), new { id = route.Id }, route);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> PutRoute(int id, CreateRouteDto dto)
    {
        var route = await _context.Routes.FindAsync(id);
        if (route == null) return NotFound();

        route.Name = dto.Name;
        route.Description = dto.Description;
        route.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> DeleteRoute(int id)
    {
        var route = await _context.Routes.FindAsync(id);
        if (route == null) return NotFound();

        _context.Routes.Remove(route);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/courses")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> AddCourseToRoute(int id, AddCourseToRouteDto dto)
    {
        var route = await _context.Routes.FindAsync(id);
        if (route == null) return NotFound();

        var course = await _context.Courses.FindAsync(dto.CourseId);
        if (course == null) return BadRequest("Course not found");

        var routeCourse = new RouteCourse
        {
            RouteId = id,
            CourseId = dto.CourseId,
            Order = dto.Order
        };

        _context.RouteCourses.Add(routeCourse);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}/courses/{courseId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> RemoveCourseFromRoute(int id, int courseId)
    {
        var routeCourse = await _context.RouteCourses.FindAsync(id, courseId);
        if (routeCourse == null) return NotFound();

        _context.RouteCourses.Remove(routeCourse);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
