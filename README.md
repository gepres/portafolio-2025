# Portfolio Genaro Pretill 2025

Portfolio web profesional y moderno construido con las últimas tecnologías web.

## 🚀 Stack Tecnológico

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion + GSAP
- Firebase v11
- React Router DOM v7

## 📦 Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

## 🔥 Firebase Setup

1. Crear proyecto en Firebase Console
2. Habilitar Authentication, Firestore y Storage
3. Copiar credenciales a .env

## 📂 Sincronización de proyectos (GitHub → Firebase)

La colección `/projects` se mantiene curada y sincronizada con los repos de
GitHub mediante una herramienta única e idempotente:

```bash
# Validar (solo lectura, no escribe): compara GitHub ↔ Firebase
node scripts/sync-projects.mjs

# Escribir los curados faltantes (auth por variables de entorno)
$env:FB_ADMIN_EMAIL="..."; $env:FB_ADMIN_PASSWORD="..."; node scripts/sync-projects.mjs --write

# Exportar la colección a projects-export.json (artefacto ignorado por git)
node scripts/sync-projects.mjs --export
```

- Fuente de verdad: `scripts/curated-projects.json` (lista blanca editable).
- Para agregar un proyecto: añade su entrada al JSON, valida y luego `--write`.
- Documentación completa del flujo: [`docs/PROJECTS_SYNC.md`](docs/PROJECTS_SYNC.md).

## 🚀 Deployment

```bash
npm run build
firebase deploy
```

Ver README completo para más detalles.
