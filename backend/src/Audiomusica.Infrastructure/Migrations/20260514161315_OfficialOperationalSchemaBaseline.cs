using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Audiomusica.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OfficialOperationalSchemaBaseline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Baseline migration for the existing centralized SQL Server schema.
            // The official operational tables already exist in AudiomusicaAssetManagementDb.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Baseline migrations do not drop existing centralized tables.
        }
    }
}
