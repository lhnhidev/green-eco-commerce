using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSocialLoginIdsToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "facebook_id",
                schema: "public",
                table: "users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "google_id",
                schema: "public",
                table: "users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_facebook_id",
                schema: "public",
                table: "users",
                column: "facebook_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_google_id",
                schema: "public",
                table: "users",
                column: "google_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_users_facebook_id",
                schema: "public",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_google_id",
                schema: "public",
                table: "users");

            migrationBuilder.DropColumn(
                name: "facebook_id",
                schema: "public",
                table: "users");

            migrationBuilder.DropColumn(
                name: "google_id",
                schema: "public",
                table: "users");
        }
    }
}
