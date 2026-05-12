# Frontend Backend Connection

URL backend:

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api
```

Servicios conectados:

- `apiClient.ts`
- `activo-fijo-service.ts`
- `usuarios-service.ts`
- `dimensionesService.ts`
- `herramientasService.ts`
- `checklistService.ts`
- `maestros-service.ts`

Pruebas:

1. Abrir `/dashboard` y verificar resumen.
2. Abrir `/activo-fijo` y listar activos seed.
3. Crear notebook/AIO desde API y refrescar frontend.
4. Abrir `/herramientas`, crear herramienta y verificar tabla.
5. Abrir `/checklist` y descargar plantilla.
6. Apagar backend y verificar mensajes de error.

Troubleshooting CORS: revisar `Cors:AllowedOrigins` en `appsettings.json`.

Errores 404: confirmar que `NEXT_PUBLIC_API_BASE_URL` termina en `/api`.

Errores 500: revisar consola del backend y connection string SQL Server.
