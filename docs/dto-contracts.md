# DTO Contracts

Los endpoints .NET reciben DTOs oficiales. No enviar propiedades de entidades EF, navegaciones ni campos antiguos como `CodSAP`, `CodCC`, `IdTienda`, `Licencias`, `UsuarioLicencias` o `EsAF`.

## POST ActivoFijo

`POST /api/activo-fijo`

```json
{
  "idDimension": 1,
  "idUsuario": null,
  "ram": 16,
  "idMarca": 1,
  "idModelo": 1,
  "idProcesador": 1,
  "idDiscoDuro": 1,
  "serial": "NB-TEST-001",
  "numeroFactura": "F12345",
  "rutProveedor": "76123456-7",
  "fechaCompra": "2026-05-14",
  "detalles": "Notebook de prueba",
  "idEstadoActivo": 1
}
```

`EsAF` no viaja desde frontend. El backend fuerza `EsAF = true` para `ActivoFijo`.

## PUT ActivoFijo

`PUT /api/activo-fijo/{id}`

```json
{
  "idDimension": 1,
  "idUsuario": 1,
  "ram": 16,
  "idMarca": 1,
  "idModelo": 1,
  "idProcesador": 1,
  "idDiscoDuro": 1,
  "serial": "NB-TEST-001",
  "numeroFactura": "F12345",
  "rutProveedor": "76123456-7",
  "fechaCompra": "2026-05-14",
  "detalles": "Notebook reasignado",
  "idEstadoActivo": 2
}
```

Si cambia `idDimension` o `idUsuario`, el backend inserta automaticamente un registro en `MovimientosActivoFijo` dentro de la misma transaccion.

## POST Usuario Con Cuentas

`POST /api/usuarios`

```json
{
  "rut": "11111111-1",
  "nombreUsuario": "Usuario",
  "apellidoPaterno": "Prueba",
  "apellidoMaterno": "QA",
  "correoCorporativo": "usuario.prueba@audiomusica.cl",
  "fechaIngreso": "2026-05-14",
  "finContrato": null,
  "idRol": 2,
  "idDimension": 1,
  "activo": true,
  "idCuentas": [1, 4, 10]
}
```

Al crear o actualizar usuarios, el backend sincroniza `UsuarioCuentas`: elimina asociaciones que ya no vienen y agrega las nuevas.

## POST Herramienta

`POST /api/herramientas`

```json
{
  "nombreHerramienta": "Tester red",
  "tipoHerramienta": "Medicion",
  "marca": "Fluke",
  "modelo": "MS2-100",
  "serial": "HT-TEST-001",
  "cantidad": 1,
  "idDimension": 1,
  "estado": "Disponible",
  "detalles": "Herramienta de prueba"
}
```

`Herramientas` no usa `ActivoFijo` ni `EsAF`.

## POST Checklist

`POST /api/checklist`

```json
{
  "nombreChecklist": "Checklist prueba",
  "tipoChecklist": "Entrega",
  "nombreArchivo": "checklist-prueba.pdf",
  "rutaArchivo": "Storage/Checklists/checklist-prueba.pdf",
  "extensionArchivo": ".pdf"
}
```

`fechaCreacion` la define el backend.
