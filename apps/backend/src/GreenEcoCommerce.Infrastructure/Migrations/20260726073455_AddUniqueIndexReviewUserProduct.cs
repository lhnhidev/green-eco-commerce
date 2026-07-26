using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexReviewUserProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_reviews_user_id",
                schema: "public",
                table: "reviews");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_user_id_product_id",
                schema: "public",
                table: "reviews",
                columns: new[] { "user_id", "product_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_reviews_user_id_product_id",
                schema: "public",
                table: "reviews");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_user_id",
                schema: "public",
                table: "reviews",
                column: "user_id");
        }
    }
}
