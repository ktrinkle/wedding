using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace wedding.Migrations
{
    public partial class DrinkTypeCd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "drink_type_cd",
                table: "wedding_group_name",
                type: "integer",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "drink_type_cd",
                table: "wedding_group_name");
        }
    }
}
