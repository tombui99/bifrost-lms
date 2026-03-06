using BifrostLms.Api.Core.Entities;

namespace BifrostLms.Api.Core.DTOs;

public class RouteDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public List<RouteCourseDto> Courses { get; set; } = new();
}

public class CreateRouteDto
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
}

public class RouteCourseDto
{
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = default!;
    public int Order { get; set; }
}

public class AddCourseToRouteDto
{
    public int CourseId { get; set; }
    public int Order { get; set; }
}
