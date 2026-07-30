using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAddressBookForUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "addresses",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    label = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    recipient_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    formatted_address = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: false),
                    commune = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    province = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    place_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    is_default = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_addresses", x => x.id);
                    table.ForeignKey(
                        name: "FK_addresses_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "public",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_addresses_user_id_is_default",
                schema: "public",
                table: "addresses",
                columns: new[] { "user_id", "is_default" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "addresses",
                schema: "public");
        }
    }
}
