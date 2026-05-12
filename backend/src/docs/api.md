# API REST

Todas las respuestas exitosas usan:

```json
{ "success": true, "message": "Operacion realizada correctamente", "data": {} }
```

Errores:

```json
{ "success": false, "message": "Descripcion del error", "error": {} }
```

## Endpoints

- Dimensiones: `GET /api/dimensiones`, `GET /api/dimensiones/:id`, `POST /api/dimensiones`, `PUT /api/dimensiones/:id`, `DELETE /api/dimensiones/:id`
- Usuarios: `GET /api/usuarios`, `GET /api/usuarios/:id`, `POST /api/usuarios`, `PUT /api/usuarios/:id`, `DELETE /api/usuarios/:id`
- Cuentas: `GET /api/cuentas`, `GET /api/cuentas/:id`, `POST /api/cuentas`, `PUT /api/cuentas/:id`, `DELETE /api/cuentas/:id`
- Cargos: `GET /api/cargos`, `GET /api/cargos/:id`, `POST /api/cargos`, `PUT /api/cargos/:id`, `DELETE /api/cargos/:id`
- Marcas: `GET /api/marcas`, `GET /api/marcas/:id`, `POST /api/marcas`, `PUT /api/marcas/:id`, `DELETE /api/marcas/:id`
- Modelos: `GET /api/modelos`, `GET /api/modelos/:id`, `POST /api/modelos`, `PUT /api/modelos/:id`, `DELETE /api/modelos/:id`
- Procesadores: `GET /api/procesadores`, `GET /api/procesadores/:id`, `POST /api/procesadores`, `PUT /api/procesadores/:id`, `DELETE /api/procesadores/:id`
- Discos duros: `GET /api/discos-duros`, `GET /api/discos-duros/:id`, `POST /api/discos-duros`, `PUT /api/discos-duros/:id`, `DELETE /api/discos-duros/:id`
- Estados activo: `GET /api/estados-activo`, `GET /api/estados-activo/:id`, `POST /api/estados-activo`, `PUT /api/estados-activo/:id`, `DELETE /api/estados-activo/:id`
- Activo fijo: CRUD en `/api/activo-fijo`
- Activo fijo filtros: `GET /api/activo-fijo/serial/:serial`, `/dimension/:idDimension`, `/usuario/:idUsuario`, `/estado/:idEstadoActivo`
- Movimientos: `GET /api/movimientos-activo-fijo`, `GET /api/movimientos-activo-fijo/:id`, `GET /api/movimientos-activo-fijo/activo/:idActivoFijo`, `POST /api/movimientos-activo-fijo`
- Checklist: CRUD en `/api/checklist` y `GET /api/checklist/:id/download`
