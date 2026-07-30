using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;

#nullable disable

namespace GreenEcoCommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVectorDataToEmbedding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "vector_id",
                schema: "public",
                table: "embeddings");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:vector", ",,");

            migrationBuilder.AddColumn<Vector>(
                name: "vector_data",
                schema: "public",
                table: "embeddings",
                type: "vector(1536)",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "vector_data",
                schema: "public",
                table: "embeddings");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:vector", ",,");

            migrationBuilder.AddColumn<string>(
                name: "vector_id",
                schema: "public",
                table: "embeddings",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");
        }
    }
}
