using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SynchronizeWithCDM : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_orders_vouchers_voucher_id",
                schema: "public",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "FK_point_transactions_vouchers_voucher_id",
                schema: "public",
                table: "point_transactions");

            migrationBuilder.DropTable(
                name: "product_images",
                schema: "public");

            migrationBuilder.DropTable(
                name: "vouchers",
                schema: "public");

            migrationBuilder.DropIndex(
                name: "IX_products_sku",
                schema: "public",
                table: "products");

            migrationBuilder.DropIndex(
                name: "IX_point_transactions_order_id",
                schema: "public",
                table: "point_transactions");

            migrationBuilder.DropIndex(
                name: "IX_point_transactions_voucher_id",
                schema: "public",
                table: "point_transactions");

            migrationBuilder.DropIndex(
                name: "IX_orders_voucher_id",
                schema: "public",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "full_name",
                schema: "public",
                table: "users");

            migrationBuilder.DropColumn(
                name: "material_origin",
                schema: "public",
                table: "products");

            migrationBuilder.DropColumn(
                name: "sku",
                schema: "public",
                table: "products");

            migrationBuilder.DropColumn(
                name: "voucher_id",
                schema: "public",
                table: "point_transactions");

            migrationBuilder.DropColumn(
                name: "latitude",
                schema: "public",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "longitude",
                schema: "public",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "sub_total",
                schema: "public",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "total_co2_saved",
                schema: "public",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "voucher_id",
                schema: "public",
                table: "orders");

            migrationBuilder.RenameColumn(
                name: "total_amount",
                schema: "public",
                table: "orders",
                newName: "earned_points");

            migrationBuilder.RenameColumn(
                name: "azure_url",
                schema: "public",
                table: "documents",
                newName: "file_url");

            migrationBuilder.AddColumn<float>(
                name: "baseline_carbon_index",
                schema: "public",
                table: "products",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "image_url",
                schema: "public",
                table: "products",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "unit_co2_saved",
                schema: "public",
                table: "order_items",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "metadata",
                schema: "public",
                table: "chat_messages",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "materials",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    eco_rating = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_materials", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "product_materials",
                schema: "public",
                columns: table => new
                {
                    MaterialsId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_materials", x => new { x.MaterialsId, x.ProductsId });
                    table.ForeignKey(
                        name: "FK_product_materials_materials_MaterialsId",
                        column: x => x.MaterialsId,
                        principalSchema: "public",
                        principalTable: "materials",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_product_materials_products_ProductsId",
                        column: x => x.ProductsId,
                        principalSchema: "public",
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_point_transactions_order_id",
                schema: "public",
                table: "point_transactions",
                column: "order_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_product_materials_ProductsId",
                schema: "public",
                table: "product_materials",
                column: "ProductsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "product_materials",
                schema: "public");

            migrationBuilder.DropTable(
                name: "materials",
                schema: "public");

            migrationBuilder.DropIndex(
                name: "IX_point_transactions_order_id",
                schema: "public",
                table: "point_transactions");

            migrationBuilder.DropColumn(
                name: "baseline_carbon_index",
                schema: "public",
                table: "products");

            migrationBuilder.DropColumn(
                name: "image_url",
                schema: "public",
                table: "products");

            migrationBuilder.DropColumn(
                name: "unit_co2_saved",
                schema: "public",
                table: "order_items");

            migrationBuilder.DropColumn(
                name: "metadata",
                schema: "public",
                table: "chat_messages");

            migrationBuilder.RenameColumn(
                name: "earned_points",
                schema: "public",
                table: "orders",
                newName: "total_amount");

            migrationBuilder.RenameColumn(
                name: "file_url",
                schema: "public",
                table: "documents",
                newName: "azure_url");

            migrationBuilder.AddColumn<string>(
                name: "full_name",
                schema: "public",
                table: "users",
                type: "character varying(161)",
                maxLength: 161,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "material_origin",
                schema: "public",
                table: "products",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "sku",
                schema: "public",
                table: "products",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "voucher_id",
                schema: "public",
                table: "point_transactions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "latitude",
                schema: "public",
                table: "orders",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "longitude",
                schema: "public",
                table: "orders",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<decimal>(
                name: "sub_total",
                schema: "public",
                table: "orders",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<float>(
                name: "total_co2_saved",
                schema: "public",
                table: "orders",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<Guid>(
                name: "voucher_id",
                schema: "public",
                table: "orders",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "product_images",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    azure_url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    is_primary = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_images", x => x.id);
                    table.ForeignKey(
                        name: "FK_product_images_products_product_id",
                        column: x => x.product_id,
                        principalSchema: "public",
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "vouchers",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    discount_value = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    expires_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    is_used = table.Column<bool>(type: "boolean", nullable: false),
                    points_cost = table.Column<decimal>(type: "numeric(15,2)", precision: 15, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vouchers", x => x.id);
                    table.ForeignKey(
                        name: "FK_vouchers_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "public",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_products_sku",
                schema: "public",
                table: "products",
                column: "sku",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_point_transactions_order_id",
                schema: "public",
                table: "point_transactions",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_point_transactions_voucher_id",
                schema: "public",
                table: "point_transactions",
                column: "voucher_id");

            migrationBuilder.CreateIndex(
                name: "IX_orders_voucher_id",
                schema: "public",
                table: "orders",
                column: "voucher_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_product_images_product_id",
                schema: "public",
                table: "product_images",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_vouchers_code",
                schema: "public",
                table: "vouchers",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_vouchers_user_id",
                schema: "public",
                table: "vouchers",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_orders_vouchers_voucher_id",
                schema: "public",
                table: "orders",
                column: "voucher_id",
                principalSchema: "public",
                principalTable: "vouchers",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_point_transactions_vouchers_voucher_id",
                schema: "public",
                table: "point_transactions",
                column: "voucher_id",
                principalSchema: "public",
                principalTable: "vouchers",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
