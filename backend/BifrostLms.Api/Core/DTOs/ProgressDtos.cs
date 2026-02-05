namespace BifrostLms.Api.Core.DTOs;

public class LessonProgressDto
{
    public int LessonId { get; set; }
    public string LessonTitle { get; set; } = default!;
    public string? Content { get; set; }
    public string? VideoUrl { get; set; }
    public string? PdfUrl { get; set; }
    public string? ExternalVideoUrl { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class CourseProgressDto
{
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = default!;
    public int ProgressPercentage { get; set; }
    public bool IsStarted { get; set; }
    public int? QuizId { get; set; }
    public bool HasQuiz { get; set; }
    public bool IsQuizPassed { get; set; }
    public List<LessonProgressDto> Lessons { get; set; } = new();
}

public class MarkLessonCompletedDto
{
    public int LessonId { get; set; }
}

public class TeacherStudentProgressDto
{
    public string StudentId { get; set; } = default!;
    public string StudentName { get; set; } = default!;
    public string StudentEmail { get; set; } = default!;
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = default!;
    public int ProgressPercentage { get; set; }
    public DateTime JoinedAt { get; set; }
}

public class TeacherQuizAttemptDto
{
    public int Id { get; set; }
    public string StudentName { get; set; } = default!;
    public int QuizId { get; set; }
    public string QuizTitle { get; set; } = default!;
    public double Score { get; set; }
    public bool IsPassed { get; set; }
    public DateTime CompletedAt { get; set; }
}
