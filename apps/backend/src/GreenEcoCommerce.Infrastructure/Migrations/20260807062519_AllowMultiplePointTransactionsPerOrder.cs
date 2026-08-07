using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AllowMultiplePointTransactionsPerOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_point_transactions_order_id",
                schema: "public",
                table: "point_transactions");

            migrationBuilder.CreateIndex(
                name: "IX_point_transactions_order_id",
                schema: "public",
                table: "point_transactions",
                column: "order_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_point_transactions_order_id",
                schema: "public",
                table: "point_transactions");

            migrationBuilder.CreateIndex(
                name: "IX_point_transactions_order_id",
                schema: "public",
                table: "point_transactions",
                column: "order_id",
                unique: true);
        }
    }
}
