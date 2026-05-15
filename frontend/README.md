# Audiomusica Asset Management Frontend

Frontend Next.js 14 para la gestion visual de activos fijos, dashboard, usuarios, checklist y herramientas.

## Desarrollo local

```powershell
npm install
$env:NEXT_PUBLIC_API_BASE_URL="http://localhost:5077/api"
npm run dev
```

La aplicacion queda disponible en `http://localhost:3000`.

## Docker

El frontend tiene su propio `Dockerfile`. Normalmente se levanta desde el `docker-compose.yml` de la raiz:

```powershell
cd ..
docker compose up -d --build
```

Para construir solo la imagen web:

```powershell
docker build `
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:5077/api `
  -t audiomusica-frontend .
```

`NEXT_PUBLIC_API_BASE_URL` se fija durante el build porque Next.js lo inyecta en el bundle del navegador.

## Validacion

```powershell
npm run build
```
