using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace wedding.Migrations
{
    public partial class InternalColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "conditional_rsvp_yes",
                table: "wedding_group_name",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "airline_flag",
                table: "wedding_group",
                type: "boolean",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "conditional_rsvp_yes",
                table: "wedding_group_name");

            migrationBuilder.DropColumn(
                name: "airline_flag",
                table: "wedding_group");
        }
    }
}
