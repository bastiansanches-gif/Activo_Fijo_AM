# Docker

El compose levanta dos servicios:

- `database`: SQL Server 2022 en puerto `1433`.
- `backend`: API Express en puerto `3001`.

Comandos:

```bash
docker compose up --build
docker compose down
docker compose logs -f backend
docker compose logs -f database
```

Antes de migrar, asegure que `.env` tenga una `DATABASE_URL` valida. Para SQL Server local en Docker:

```env
DATABASE_URL="sqlserver://localhost:1433;database=AudiomusicaAssetManagement;user=sa;password=YourStrong!Passw0rd;encrypt=true;trustServerCertificate=true"
```
