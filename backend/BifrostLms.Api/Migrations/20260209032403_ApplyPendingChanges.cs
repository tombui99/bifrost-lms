using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BifrostLms.Api.Migrations
{
    /// <inheritdoc />
    public partial class ApplyPendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MeetingUrl",
                table: "Schedules",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MeetingUrl",
                table: "Schedules");
        }
    }
}
