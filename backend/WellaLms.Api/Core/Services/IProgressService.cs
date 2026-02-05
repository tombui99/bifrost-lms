using WellaLms.Api.Core.Entities;

namespace WellaLms.Api.Core.Services;

public interface IProgressService
{
    Task UpdateStudentProgressAsync(string userId, int courseId);
    Task RecalculateAllStudentsProgressInCourseAsync(int courseId);
}
