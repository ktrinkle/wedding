using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace wedding.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wedding_group",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    group_id = table.Column<Guid>(type: "uuid", nullable: false),
                    email_address = table.Column<string>(type: "text", nullable: false),
                    last_login_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wedding_group", x => x.id);
                    table.UniqueConstraint("AK_wedding_group_group_id", x => x.group_id);
                });

            migrationBuilder.CreateTable(
                name: "wedding_group_name",
                columns: table => new
                {
                    group_id = table.Column<Guid>(type: "uuid", nullable: false),
                    group_member_id = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false),
                    group_member_name = table.Column<string>(type: "text", nullable: false),
                    rsvp_yes = table.Column<bool>(type: "boolean", nullable: true),
                    rsvp_comment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wedding_group_name", x => new { x.group_id, x.group_member_id });
                    table.ForeignKey(
                        name: "FK_wedding_group_name_wedding_group_group_id",
                        column: x => x.group_id,
                        principalTable: "wedding_group",
                        principalColumn: "group_id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wedding_group_name");

            migrationBuilder.DropTable(
                name: "wedding_group");
        }
    }
}
