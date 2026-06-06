using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameUserAddressColumnName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "address_default",
                schema: "public",
                table: "users",
                newName: "address");

            migrationBuilder.AlterColumn<string>(
                name: "full_name",
                schema: "public",
                table: "users",
                type: "character varying(161)",
                maxLength: 161,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(160)",
                oldMaxLength: 160);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "address",
                schema: "public",
                table: "users",
                newName: "address_default");

            migrationBuilder.AlterColumn<string>(
                name: "full_name",
                schema: "public",
                table: "users",
                type: "character varying(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(161)",
                oldMaxLength: 161);
        }
    }
}
