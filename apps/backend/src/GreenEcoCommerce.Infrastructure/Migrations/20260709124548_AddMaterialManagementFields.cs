using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMaterialManagementFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "image_url",
                schema: "public",
                table: "materials",
                type: "character varying(10000)",
                maxLength: 10000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "origin",
                schema: "public",
                table: "materials",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "sku",
                schema: "public",
                table: "materials",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "stock_qty",
                schema: "public",
                table: "materials",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "unit",
                schema: "public",
                table: "materials",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "unit_price",
                schema: "public",
                table: "materials",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "image_url",
                schema: "public",
                table: "materials");

            migrationBuilder.DropColumn(
                name: "origin",
                schema: "public",
                table: "materials");

            migrationBuilder.DropColumn(
                name: "sku",
                schema: "public",
                table: "materials");

            migrationBuilder.DropColumn(
                name: "stock_qty",
                schema: "public",
                table: "materials");

            migrationBuilder.DropColumn(
                name: "unit",
                schema: "public",
                table: "materials");

            migrationBuilder.DropColumn(
                name: "unit_price",
                schema: "public",
                table: "materials");
        }
    }
}
