using BifrostLms.Api.Core.Entities;

namespace BifrostLms.Api.Core.Services;

public interface IProgressService
{
    Task UpdateStudentProgressAsync(string userId, int courseId);
    Task RecalculateAllStudentsProgressInCourseAsync(int courseId);
}
