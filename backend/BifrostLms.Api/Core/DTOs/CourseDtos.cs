namespace BifrostLms.Api.Core.DTOs;

public record CreateCourseDto(string Title, string? Description, string? ImageUrl);
public record UpdateCourseDto(string Title, string? Description, string? ImageUrl);
