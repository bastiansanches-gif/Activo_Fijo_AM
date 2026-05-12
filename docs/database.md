# Database

Base esperada: SQL Server.

Connection string local:

```json
"DefaultConnection": "Server=localhost,1433;Database=AudiomusicaAssetManagement;User Id=sa;Password=Your_password123;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

Tablas incluidas: Roles, Dimensiones, Usuarios, Cuenta, Marcas, Modelos, Procesadores, DiscosDuros, EstadosActivo, ActivoFijo, MovimientosActivoFijo, Checklist y Herramientas.

Herramientas es independiente de ActivoFijo porque no representa necesariamente activo contable.
