namespace WellaLms.Api.Core.DTOs;

public record LessonDto(int Id, string Title, string? Content, int CourseId, DateTime CreatedAt, DateTime? UpdatedAt);
public record CreateLessonDto(string Title, string? Content, int CourseId);
public record UpdateLessonDto(string Title, string? Content);
