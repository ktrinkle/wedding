using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace wedding.Migrations
{
    public partial class WeddingGifts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "admin_flag",
                table: "wedding_group",
                type: "boolean",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "wedding_gifts",
                columns: table => new
                {
                    group_id = table.Column<Guid>(type: "uuid", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    gift_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    gift_amount = table.Column<float>(type: "real", nullable: true),
                    gift_comment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wedding_gifts", x => x.group_id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wedding_gifts");

            migrationBuilder.DropColumn(
                name: "admin_flag",
                table: "wedding_group");
        }
    }
}
