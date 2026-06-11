using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeProductImageUrlToArray : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE public.products ALTER COLUMN image_url TYPE text[] USING array[image_url];");

            migrationBuilder.AlterColumn<string[]>(
                name: "image_url",
                schema: "public",
                table: "products",
                type: "text[]",
                maxLength: 10000,
                nullable: false,
                defaultValue: new string[0],
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "image_url",
                schema: "public",
                table: "products",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string[]),
                oldType: "text[]",
                oldMaxLength: 10000);
        }
    }
}
