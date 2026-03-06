using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BifrostLms.Api.Core.DTOs;
using BifrostLms.Api.Core.Entities;
using BifrostLms.Api.Data;
using Microsoft.AspNetCore.Identity;
using BifrostLms.Api.Core.Services;

namespace BifrostLms.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin,TenantAdmin,Teacher,Student")]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITenantProvider _tenantProvider;

    public DepartmentsController(AppDbContext context, UserManager<ApplicationUser> userManager, ITenantProvider tenantProvider)
    {
        _context = context;
        _userManager = userManager;
        _tenantProvider = tenantProvider;
    }

    private string? GetUserId()
    {
        return User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;
    }

    [HttpGet("my")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<DepartmentDto>> GetMyDepartment()
    {
        var userId = GetUserId();
        var user = await _context.Users
            .IgnoreQueryFilters()
            .Include(u => u.Department)
            .ThenInclude(d => d!.DepartmentRoutes)
            .ThenInclude(dr => dr.Route)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null || user.DepartmentId == null) return NotFound("Student has no department assigned.");
        if (user.Department == null) return NotFound("Student's assigned department could not be loaded.");

        var all = await _context.Departments.ToListAsync();
        return MapToDto(user.Department, all);
    }

    [HttpGet]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetDepartments()
    {
        var allDepartments = await _context.Departments
            .Include(d => d.DepartmentRoutes)
            .ThenInclude(dr => dr.Route)
            .ToListAsync();

        // Build tree manually or use a helper
        var rootDepartments = allDepartments
            .Where(d => d.ParentDepartmentId == null)
            .Select(d => MapToDto(d, allDepartments))
            .ToList();

        return rootDepartments;
    }

    private DepartmentDto MapToDto(Department d, List<Department> all)
    {
        return new DepartmentDto
        {
            Id = d.Id,
            Name = d.Name,
            Description = d.Description,
            ParentDepartmentId = d.ParentDepartmentId,
            SubDepartments = all.Where(sd => sd.ParentDepartmentId == d.Id).Select(sd => MapToDto(sd, all)).ToList(),
            AssignedRoutes = d.DepartmentRoutes
                .Where(dr => dr.Route != null)
                .Select(dr => new RouteDto
            {
                Id = dr.RouteId,
                Name = dr.Route!.Name,
                Description = dr.Route.Description
            }).ToList()
        };
    }

    private DepartmentDto MapToDto(Department d, List<Department> all, List<RouteDto> assignedRoutes)
    {
        return new DepartmentDto
        {
            Id = d.Id,
            Name = d.Name,
            Description = d.Description,
            ParentDepartmentId = d.ParentDepartmentId,
            SubDepartments = all.Where(sd => sd.ParentDepartmentId == d.Id).Select(sd => MapToDto(sd, all)).ToList(),
            AssignedRoutes = assignedRoutes
        };
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(int id)
    {
        var department = await _context.Departments
            .Include(d => d.DepartmentRoutes)
            .ThenInclude(dr => dr.Route)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null) return NotFound();

        var all = await _context.Departments.ToListAsync();

        return MapToDto(department, all);
    }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<Department>> PostDepartment(CreateDepartmentDto dto)
    {
        var department = new Department
        {
            Name = dto.Name,
            Description = dto.Description,
            ParentDepartmentId = dto.ParentDepartmentId
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, department);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> PutDepartment(int id, CreateDepartmentDto dto)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return NotFound();

        department.Name = dto.Name;
        department.Description = dto.Description;
        department.ParentDepartmentId = dto.ParentDepartmentId;
        department.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        var department = await _context.Departments
            .Include(d => d.SubDepartments)
            .Include(d => d.DepartmentRoutes)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null) return NotFound();

        // 1. Restriction: Only allow deleting departments with no sub-departments
        if (department.SubDepartments.Any())
        {
            return BadRequest(new { Message = "Cannot delete a department that has sub-departments. Please delete or re-parent the sub-departments first." });
        }

        // 2. Remove Route assignments
        if (department.DepartmentRoutes.Any())
        {
            _context.DepartmentRoutes.RemoveRange(department.DepartmentRoutes);
        }

        // 3. Remove Department
        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/routes")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> AssignRouteToDepartment(int id, AssignRouteToDepartmentDto dto)
    {
        var deptRoute = new DepartmentRoute
        {
            DepartmentId = id,
            RouteId = dto.RouteId
        };

        _context.DepartmentRoutes.Add(deptRoute);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}/routes/{routeId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> UnassignRouteFromDepartment(int id, int routeId)
    {
        var deptRoute = await _context.DepartmentRoutes.FindAsync(id, routeId);
        if (deptRoute == null) return NotFound();

        _context.DepartmentRoutes.Remove(deptRoute);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/students")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> AssignStudentToDepartment(int id, AssignStudentToDepartmentDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.StudentId);
        if (user == null) return NotFound("User not found");

        if (user.TenantId != _tenantProvider.TenantId) return Forbid();

        user.DepartmentId = id;
        await _userManager.UpdateAsync(user);
        return Ok();
    }

    [HttpGet("students/all")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<IEnumerable<UserDisplayDto>>> GetStudentsAll()
    {
        var students = await _userManager.Users
            .Where(u => u.TenantId == _tenantProvider.TenantId)
            .ToListAsync();

        var studentDisplays = new List<UserDisplayDto>();
        foreach (var user in students)
        {
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Student"))
            {
                studentDisplays.Add(new UserDisplayDto
                {
                    Id = user.Id,
                    Username = user.UserName!,
                    FullName = user.FullName ?? "",
                    Role = "Student",
                    TenantId = user.TenantId ?? ""
                });
            }
        }

        return Ok(studentDisplays);
    }

    [HttpGet("{id}/students")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<IEnumerable<UserDisplayDto>>> GetDepartmentStudents(int id)
    {
        var students = await _userManager.Users
            .Where(u => u.DepartmentId == id)
            .ToListAsync();

        var studentDisplays = new List<UserDisplayDto>();
        foreach (var user in students)
        {
            var roles = await _userManager.GetRolesAsync(user);
            studentDisplays.Add(new UserDisplayDto
            {
                Id = user.Id,
                Username = user.UserName!,
                FullName = user.FullName ?? "",
                Role = roles.FirstOrDefault() ?? "Student",
                TenantId = user.TenantId ?? ""
            });
        }


        return Ok(studentDisplays);
    }

    [HttpDelete("{id}/students/{studentId}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> UnassignStudentFromDepartment(int id, string studentId)
    {
        var user = await _userManager.FindByIdAsync(studentId);
        if (user == null) return NotFound("User not found");

        if (user.TenantId != _tenantProvider.TenantId) return Forbid();

        if (user.DepartmentId == id)
        {
            user.DepartmentId = null;
            await _userManager.UpdateAsync(user);
        }
        return Ok();
    }
}
