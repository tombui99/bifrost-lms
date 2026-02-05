namespace BifrostLms.Api.Core.DTOs;

public class QuizDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public List<QuestionDto> Questions { get; set; } = new();
}

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = default!;
    public List<ChoiceDto> Choices { get; set; } = new();
}

public class ChoiceDto
{
    public int Id { get; set; }
    public string Text { get; set; } = default!;
    public bool IsCorrect { get; set; }
}

public class CreateQuizDto
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
}

public class CreateQuestionDto
{
    public string Text { get; set; } = default!;
}

public class CreateChoiceDto
{
    public string Text { get; set; } = default!;
    public bool IsCorrect { get; set; }
}

public class QuizSubmissionDto
{
    public int QuizId { get; set; }
    public List<QuestionAnswerDto> Answers { get; set; } = new();
}

public class QuestionAnswerDto
{
    public int QuestionId { get; set; }
    public int SelectedChoiceId { get; set; }
}

public class QuizResultDto
{
    public double Score { get; set; }
    public bool IsPassed { get; set; }
}

public class BatchUpdateQuizDto
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public List<BatchUpdateQuestionDto> Questions { get; set; } = new();
}

public class BatchUpdateQuestionDto
{
    public int? Id { get; set; }
    public string Text { get; set; } = default!;
    public List<BatchUpdateChoiceDto> Choices { get; set; } = new();
}

public class BatchUpdateChoiceDto
{
    public int? Id { get; set; }
    public string Text { get; set; } = default!;
    public bool IsCorrect { get; set; }
}
