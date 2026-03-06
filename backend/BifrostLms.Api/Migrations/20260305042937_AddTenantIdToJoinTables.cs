using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BifrostLms.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantIdToJoinTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TenantId",
                table: "RouteCourses",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenantId",
                table: "DepartmentRoutes",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "RouteCourses");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "DepartmentRoutes");
        }
    }
}
