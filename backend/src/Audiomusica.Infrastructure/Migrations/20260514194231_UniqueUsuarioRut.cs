using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Audiomusica.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UniqueUsuarioRut : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF NOT EXISTS (
                    SELECT 1
                    FROM sys.indexes
                    WHERE name = N'IX_Usuarios_Rut'
                      AND object_id = OBJECT_ID(N'[Usuarios]')
                )
                BEGIN
                    CREATE UNIQUE INDEX [IX_Usuarios_Rut] ON [Usuarios] ([Rut]);
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF EXISTS (
                    SELECT 1
                    FROM sys.indexes
                    WHERE name = N'IX_Usuarios_Rut'
                      AND object_id = OBJECT_ID(N'[Usuarios]')
                )
                BEGIN
                    DROP INDEX [IX_Usuarios_Rut] ON [Usuarios];
                END
                """);
        }
    }
}
