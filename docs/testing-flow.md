# Testing Flow

Use Swagger o REST Client contra `https://localhost:5001/api`.

1. `POST /dimensiones` con `{ "numeroDimension": "DIM-999", "nombreDimension": "QA", "activo": true }`.
2. `PUT /dimensiones/{id}` cambiando `nombreDimension`.
3. `DELETE /dimensiones/{id}` verifica `activo=false`.
4. `POST /usuarios` con rol, dimension e `idCuentas` existentes.
5. `PUT /usuarios/{id}` cambia apellido o `idCuentas`.
6. `DELETE /usuarios/{id}` verifica desactivacion logica.
7. `POST /activo-fijo` crea notebook con serial unico.
8. `GET /activo-fijo/serial/{serial}` consulta el notebook.
9. `PUT /activo-fijo/{id}` cambia `idDimension` o `idUsuario`.
10. `GET /movimientos-activo-fijo/activo/{id}` verifica movimiento automatico.
11. `DELETE /activo-fijo/{id}` desactiva notebook.
12. Repetir alta/edicion/baja para AIO.
13. `POST /herramientas` crea Martillo.
14. `POST /herramientas` crea Taladro.
15. `PUT /herramientas/{id}` cambia estado o cantidad.
16. `DELETE /herramientas/{id}` desactiva.
17. `POST /cuenta` crea cuenta.
18. `PUT /usuarios/{id}` asigna `idCuentas`.

## Pruebas DTO oficiales

Ver `docs/api-tests.http` para ejecutar ejemplos reales contra la API local.

Orden recomendado:

1. `GET /api/health/database`.
2. `POST /api/dimensiones` si la base no tiene dimensiones cargadas.
3. `POST /api/usuarios` enviando `idCuentas`.
4. `GET /api/usuarios` y verificar `cuentas`.
5. `POST /api/activo-fijo` sin enviar `esAF`.
6. `GET /api/activo-fijo` y verificar nombres de catalogos.
7. `PUT /api/activo-fijo/{id}` cambiando `idUsuario` o `idDimension`.
8. `GET /api/movimientos-activo-fijo/activo/{id}`.
19. `GET /checklist`.
20. `GET /checklist/{id}/download`.

Payload minimo activo fijo:

```json
{
  "idDimension": 1,
  "idUsuario": 2,
  "ram": 16,
  "idMarca": 1,
  "idModelo": 1,
  "idProcesador": 1,
  "idDiscoDuro": 2,
  "serial": "NB-QA-001",
  "numeroFactura": "F-QA-001",
  "rutProveedor": "76000000-0",
  "fechaCompra": "2026-05-12",
  "detalles": "Prueba funcional",
  "esAF": true,
  "idEstadoActivo": 2,
  "activo": true
}
```
