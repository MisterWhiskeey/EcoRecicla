# EcoRecicla

Una aplicación web moderna para la gestión inteligente de reciclaje.

> ✨ **Versión simplificada** - Sin base de datos externa, datos en memoria para fácil despliegue.
> 🚀 **Desplegado en Vercel** - Aplicación en línea funcionando correctamente.

## Características

- 🗺️ Mapa interactivo de contenedores de reciclaje
- 📍 Ordenamiento por distancia (más cercano a más lejano)
- 📊 Estadísticas de reciclaje personal (estáticas)
- 🌙 Modo oscuro/claro
- 📱 Diseño responsive

## Tecnologías

- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + WebSockets
- **Base de datos:** PostgreSQL + Drizzle ORM
- **Build:** Vite + esbuild

## Instalación Local

```bash
npm install
npm run dev
```

## Despliegue

La aplicación está lista para desplegar en Vercel, Railway, o Render.

Configurar variable de entorno:
- `DATABASE_URL`: URL de conexión PostgreSQL

## Scripts

- `npm run dev`: Desarrollo
- `npm run build`: Build de producción
- `npm start`: Ejecutar producción
- `npm run db:push`: Actualizar esquema de base de datos
