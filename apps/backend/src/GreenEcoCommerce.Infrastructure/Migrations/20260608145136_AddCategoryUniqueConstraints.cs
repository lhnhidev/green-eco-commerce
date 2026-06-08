using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryUniqueConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_categories_parent_id",
                schema: "public",
                table: "categories");

            migrationBuilder.CreateIndex(
                name: "IX_categories_parent_id_name",
                schema: "public",
                table: "categories",
                columns: new[] { "parent_id", "name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_categories_parent_id_name",
                schema: "public",
                table: "categories");

            migrationBuilder.CreateIndex(
                name: "IX_categories_parent_id",
                schema: "public",
                table: "categories",
                column: "parent_id");
        }
    }
}
