using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicBackendApi.Migrations
{
    /// <inheritdoc />
    public partial class dbup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserNotification_NotificationId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_NotificationId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NotificationId",
                table: "AspNetUsers");

            migrationBuilder.CreateIndex(
                name: "IX_UserNotification_UserId",
                table: "UserNotification",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotification_AspNetUsers_UserId",
                table: "UserNotification",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserNotification_AspNetUsers_UserId",
                table: "UserNotification");

            migrationBuilder.DropIndex(
                name: "IX_UserNotification_UserId",
                table: "UserNotification");

            migrationBuilder.AddColumn<int>(
                name: "NotificationId",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_NotificationId",
                table: "AspNetUsers",
                column: "NotificationId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_UserNotification_NotificationId",
                table: "AspNetUsers",
                column: "NotificationId",
                principalTable: "UserNotification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
