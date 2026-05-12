# Testing Flow

Use Swagger o REST Client contra `https://localhost:5001/api`.

1. `POST /dimensiones` con `{ "numeroDimension": "DIM-999", "nombreDimension": "QA", "activo": true }`.
2. `PUT /dimensiones/{id}` cambiando `nombreDimension`.
3. `DELETE /dimensiones/{id}` verifica `activo=false`.
4. `POST /usuarios` con rol y dimension existentes.
5. `PUT /usuarios/{id}` cambia apellido o cuenta.
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
18. `PUT /usuarios/{id}` asigna `idCuenta`.
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
