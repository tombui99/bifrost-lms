using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BifrostLms.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddQuizTimeLimitAndRandomQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfQuestionsToServe",
                table: "Quizzes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TimeLimitMinutes",
                table: "Quizzes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfQuestionsToServe",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "TimeLimitMinutes",
                table: "Quizzes");
        }
    }
}
