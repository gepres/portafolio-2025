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

## 💼 Experiencia: empresa vs. freelance

Cada documento de `/experiences` lleva `employmentType: 'company' | 'freelance'`. El CV
(`/cv`, PDF y Word) muestra dos bloques separados —Experiencia Profesional y Proyectos
Freelance— y la timeline del home marca las freelance con un badge. Los documentos sin el
campo se tratan como `company`.

El tipo se edita desde el panel admin. Para clasificar en lote:

```bash
# Validar (solo lectura): muestra qué quedaría como empresa y qué como freelance
node scripts/backfill-employment-type.mjs

# Escribir el campo (auth por variables de entorno)
$env:FB_ADMIN_EMAIL="..."; $env:FB_ADMIN_PASSWORD="..."; node scripts/backfill-employment-type.mjs --write
```

La lista de empresas freelance vive en la constante `FREELANCE` del script.

## 🚀 Deployment

```bash
npm run build
firebase deploy
```

Ver README completo para más detalles.
