using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicBackendApi.Migrations
{
    /// <inheritdoc />
    public partial class docspeclity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Specialty_Doc",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Specialty_Doc",
                table: "AspNetUsers");
        }
    }
}
