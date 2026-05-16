# Sincronización de proyectos: GitHub → Firebase `/projects`

Flujo para mantener la colección `/projects` (Firestore, proyecto
`portafolio-gepres`) alineada con los repositorios de GitHub del usuario
`gepres`, de forma **curada, idempotente y validable**.

## Archivos

| Archivo | Rol |
|---|---|
| `scripts/curated-projects.json` | **Fuente de verdad**. Lista blanca editable de proyectos que deben estar en el portafolio. |
| `scripts/sync-projects.mjs` | Herramienta única: validar / escribir / exportar. |
| `projects-export.json` | Artefacto **generado** (snapshot de `/projects`). Ignorado por git. |
| `docs/PROJECTS_SYNC.md` | Este documento. |

## Reglas de Firestore relevantes

```
match /projects/{project} {
  allow read:  if true;                 // lectura pública → validar/exportar no requiere auth
  allow write: if request.auth != null; // escribir requiere usuario autenticado
}
```

## Comandos

Desde la raíz del proyecto:

```bash
# 1) VALIDAR (solo lectura, no escribe nada). Es el modo por defecto.
node scripts/sync-projects.mjs

# 2) ESCRIBIR los curados que falten en Firebase (idempotente)
#    PowerShell:
$env:FB_ADMIN_EMAIL="tucorreo@gmail.com"; $env:FB_ADMIN_PASSWORD="********"; node scripts/sync-projects.mjs --write
#    (limpia las variables luego:  Remove-Item Env:FB_ADMIN_EMAIL, Env:FB_ADMIN_PASSWORD )

# 3) EXPORTAR la colección actual a projects-export.json
node scripts/sync-projects.mjs --export
```

### Qué reporta `validar`

- Docs actuales en `/projects` vs. tamaño de la lista curada.
- **A agregar**: curados que aún no están en Firebase (se crearían con `--write`).
- **Omitidos**: curados cuyo `githubUrl` ya existe (no se duplican).
- **Repos fuera de la lista curada**: repos en GitHub (no fork, no archivado)
  que no están ni en la lista curada ni en Firebase → revisar si alguno debería
  entrar al portafolio.

## Agregar un proyecto nuevo a futuro

1. Edita `scripts/curated-projects.json` y añade una entrada:

   ```json
   {
     "repo": "nombre-exacto-del-repo",
     "title": "Título visible",
     "category": "frontend | backend | fullstack | mobile",
     "technologies": ["React", "TypeScript"],
     "description": "Descripción corta.",
     "demoUrl": "https://... | null"
   }
   ```

2. Valida el cambio (no escribe nada):

   ```bash
   node scripts/sync-projects.mjs
   ```

3. Si el reporte es correcto, escribe:

   ```bash
   $env:FB_ADMIN_EMAIL="..."; $env:FB_ADMIN_PASSWORD="..."; node scripts/sync-projects.mjs --write
   ```

4. Regenera el snapshot (opcional):

   ```bash
   node scripts/sync-projects.mjs --export
   ```

## Garantías y notas

- **Idempotente**: la coincidencia es por `githubUrl` normalizado
  (minúsculas, sin `/` final ni `.git`). Correr `--write` varias veces no
  duplica documentos.
- Cada documento se crea con `imageUrl: null` y `featured: false`. Las
  imágenes y destacados se gestionan desde el panel admin del portafolio.
- `validar` y `--export` son **solo lectura** y no requieren credenciales.
- **Seguridad**: las credenciales de admin se pasan solo por variables de
  entorno, nunca se guardan en disco ni se versionan. Tras un `--write`,
  limpia las variables de entorno de la sesión. Si una contraseña quedó
  expuesta en un historial, rótala.
- El script nunca borra ni modifica documentos existentes; solo agrega los
  curados faltantes.

## Cómo se pobló inicialmente (2026-05-16)

- Estado previo: 18 docs (12 con `githubUrl`).
- Lista curada de 17 repos recientes/serios (se descartaron forks, repos de
  práctica, plantillas y duplicados de los ~49 faltantes).
- Resultado: 35 docs (frontend 17 · backend 9 · fullstack 5 · mobile 4).
