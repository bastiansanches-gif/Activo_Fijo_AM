# Frontend

El frontend Next.js usa servicios HTTP reales en `frontend/services`.

Variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api
```

Pantallas conectadas: dashboard, activo fijo, usuarios, herramientas, configuracion y checklist.

UI: se ajusto sidebar corporativo azul, fondos suaves, cards con glow, logos en login/sidebar y estados de carga/error.

## App Router

Cada route segment conserva `page.tsx` como entrada obligatoria de Next.js. La logica real vive en archivos explicitos `*-page.tsx` para mejorar navegacion en IDE y debugging.

## Menu

Admin:

- Dashboard
- Activo Fijo
- Herramientas
- Usuarios
- Checklist
- Configuracion

Usuario Normal:

- Dashboard
- Activo Fijo
- Checklist
- Configuracion

No se muestran Maestros, Movimientos ni CentroCosto en el sidebar.

## Nuevo Activo

La pantalla muestra cards pastel por tipo de activo. Al seleccionar una card navega a `/activo-fijo/nuevo?tipo=...` y el formulario queda preseleccionado.

Selectores con alta controlada:

- Marca
- Modelo
- Procesador
- Disco Duro
- Estado Activo

Cada selector permite "+ Agregar otro" y guarda el valor por backend. Dimension no permite alta manual porque viene desde SAP.

El tecnico responsable se obtiene desde la sesion local y se muestra como "Registrado por". El usuario asignado se busca por nombre, apellido, correo o cargo, y puede quedar vacio con "Sin usuario asignado / Solo dimension".
