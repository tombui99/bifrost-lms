using BifrostLms.Api.Core.Entities;

namespace BifrostLms.Api.Core.DTOs;

public class DepartmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public int? ParentDepartmentId { get; set; }
    public List<DepartmentDto> SubDepartments { get; set; } = new();
    public List<RouteDto> AssignedRoutes { get; set; } = new();
}

public class CreateDepartmentDto
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public int? ParentDepartmentId { get; set; }
}

public class AssignRouteToDepartmentDto
{
    public int RouteId { get; set; }
}

public class AssignStudentToDepartmentDto
{
    public string StudentId { get; set; } = default!;
}
