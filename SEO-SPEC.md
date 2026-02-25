# SEO Implementation Spec — genaropretill.com
**Generado:** 2026-02-23
**Score actual:** 60 / 100
**Score objetivo post-implementación:** 80–85 / 100
**Stack actual:** React + Vite (CSR puro) + Firebase Firestore + Fastly CDN

---

## Resumen ejecutivo

El sitio tiene buenas bases (HTTPS, schema JSON-LD, CDN, compresión brotli), pero su arquitectura CSR pura bloquea 5 de las 7 categorías SEO. Googlebot recibe `<div id="root"></div>` — sin contenido estático indexable. El 80% de las mejoras de este spec convergen en un solo problema raíz: **el contenido no existe en el HTML servido por el servidor**.

---

## GRUPO 1 — Arquitectura (Crítico · Sprint 1)

### SPEC-001: Migración a Static Site Generation (SSG)

**Prioridad:** Crítica
**Esfuerzo estimado:** 3–5 días
**Impacto en score:** +12–15 puntos

**Problema:**
El servidor entrega `<body><div id="root"></div></body>` para todas las rutas. Googlebot indexa ~120 palabras de contenido (solo meta tags y JSON-LD). Las secciones Proyectos, Experiencia y Habilidades se cargan desde Firestore en runtime — Googlebot no puede ejecutar esas llamadas.

**Solución — Astro con React Islands (ruta de menor migración):**

```
Estructura de rutas SSG objetivo:
  /                     → src/pages/index.astro
  /cv                   → src/pages/cv.astro
  /privacy-policy       → src/pages/privacy-policy.astro
```

Cada página `.astro` debe:
1. Renderizar el contenido estático como HTML puro en build time
2. Usar `client:visible` solo en componentes interactivos (formulario de contacto, animaciones de scroll)
3. Inyectar su propio `<title>`, `<meta name="description">`, `<link rel="canonical">` y JSON-LD específico por ruta

**Opción alternativa (menor cambio) — Prerendering con react-snap:**
Si la migración a Astro no es viable en el sprint, agregar `react-snap` al build de Vite genera snapshots estáticos de cada ruta conocida. Menos robusto que SSG pero solucionable en 1 día.

**Criterio de aceptación:**
- `curl https://genaropretill.com/` devuelve el H1 "Genaro Pretill Escobar" en el body HTML sin ejecutar JS
- `curl https://genaropretill.com/cv` devuelve contenido específico del CV en el body HTML
- Google Search Console no reporta "Página detectada pero sin indexar" para las 3 rutas del sitemap

---

### SPEC-002: Contenido estático de emergencia en index.html (Interim fix)

**Prioridad:** Crítica (blocker temporal hasta SPEC-001)
**Esfuerzo estimado:** 2–4 horas
**Impacto:** Permite crawleo básico mientras se implementa SPEC-001

**Problema:**
Sin SSG, Googlebot ve HTML vacío en el primer crawl. Puede pasar días o semanas antes del segundo pass (renderizado JS).

**Solución:**
Inyectar contenido estático en `index.html` **fuera** del `<div id="root">`, visible para crawlers pero ocultable visualmente con CSS si es necesario:

```html
<!-- Añadir antes de <div id="root"> -->
<div id="seo-static-content" aria-hidden="true" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">
  <h1>Genaro Pretill Escobar</h1>
  <p>Full Stack Developer y DevOps Engineer con sede en Lima, Perú. Especializado en React.js, Vue.js, NestJS, TypeScript, Kubernetes y AWS.</p>
  <p>Actualmente trabajo como DevOps Engineer y Full Stack Developer en Izipay (Interbank), donde gestiono infraestructura Kubernetes, desarrollo aplicaciones con Next.js y React, e implemento pipelines CI/CD.</p>
  <p>Formación en Ingeniería de Sistemas en la Universidad San Luis Gonzaga.</p>
  <h2>Servicios</h2>
  <p>Desarrollo Frontend: Interfaces modernas y responsivas con React, Next.js y TypeScript.</p>
  <p>Desarrollo Backend: APIs robustas con NestJS, Node.js y PostgreSQL.</p>
  <p>DevOps y Cloud: Infraestructura en AWS, gestión de Kubernetes y pipelines CI/CD.</p>
  <h2>Contacto</h2>
  <p>Lima, Perú | +51 945 335 795 | Disponible para proyectos remotos y freelance.</p>
</div>
```

**Criterio de aceptación:**
- `curl https://genaropretill.com/ | grep "Full Stack Developer"` retorna resultado
- El contenido no es visible para usuarios (no afecta el diseño)

---

## GRUPO 2 — Indexabilidad y Canonicals (Crítico · Sprint 1)

### SPEC-003: Redireccionamiento www → non-www

**Prioridad:** Crítica
**Esfuerzo estimado:** 30 minutos (config de CDN/DNS)
**Impacto en score:** +4 puntos

**Problema:**
`https://www.genaropretill.com/` devuelve HTTP 200 con el mismo contenido que `https://genaropretill.com/`. Google detecta dos versiones indexables del mismo sitio — dilución de PageRank y señales de duplicado.

**Solución:**
Configurar regla 301 en Fastly (o el panel DNS/hosting):

```
Si host == www.genaropretill.com
→ 301 Redirect a https://genaropretill.com{path}
```

**Verificación:**
```bash
curl -I https://www.genaropretill.com/
# Esperado: HTTP/1.1 301 Moved Permanently
# Location: https://genaropretill.com/
```

---

### SPEC-004: Canonical correcto por ruta

**Prioridad:** Crítica
**Esfuerzo estimado:** Incluido en SPEC-001 (SSG)

**Problema:**
`/cv` y `/privacy-policy` tienen `<link rel="canonical" href="https://genaropretill.com/">` — apuntan al homepage. Google las trata como duplicados del homepage y no las indexa individualmente.

**Solución:**
Cada ruta debe servir su propio canonical auto-referenciado:

| Ruta | Canonical correcto |
|------|--------------------|
| `/` | `https://genaropretill.com/` |
| `/cv` | `https://genaropretill.com/cv` |
| `/privacy-policy` | `https://genaropretill.com/privacy-policy` |

En Astro/Next.js esto es automático si se usa el componente `<head>` por página. En el HTML estático actual, requiere tres archivos HTML separados con su respectiva tag.

---

### SPEC-005: Soft 404 — rutas desconocidas devuelven HTTP 200

**Prioridad:** Alta
**Esfuerzo estimado:** 1–2 horas (config de CDN o router)

**Problema:**
Cualquier URL inventada (`/blog`, `/about`, `/404`, etc.) retorna HTTP 200 con el app shell. Google registra estas como páginas válidas y las marca como "soft 404" en Search Console — daña el crawl budget y la coverage report.

**Solución:**
Configurar el servidor/CDN para retornar HTTP 404 en rutas no mapeadas. En Fastly con un sitio estático:

```
# Reglas de routing:
/           → index.html  (200)
/cv         → cv.html     (200)
/privacy-policy → privacy-policy.html (200)
*           → 404.html    (404)
```

**Criterio de aceptación:**
```bash
curl -I https://genaropretill.com/ruta-inexistente
# Esperado: HTTP/1.1 404 Not Found
```

---

### SPEC-006: Normalización trailing slash

**Prioridad:** Alta
**Esfuerzo estimado:** 1 hora (reglas de CDN)

**Problema:**
`/cv` y `/cv/` ambas devuelven HTTP 200 sin redirigir una a la otra. Google puede indexarlas como URLs distintas.

**Solución:**
Agregar regla 301 en CDN: eliminar trailing slash en todas las rutas excepto `/`:

```
/cv/  → 301 → /cv
/privacy-policy/  → 301 → /privacy-policy
```

---

## GRUPO 3 — Performance / Core Web Vitals (Alto · Sprint 2)

### SPEC-007: Google Fonts — eliminar render-blocking

**Prioridad:** Alta
**Esfuerzo estimado:** 1 hora
**Impacto en LCP:** −200 a −500ms estimado

**Problema:**
```html
<!-- ACTUAL — render-blocking -->
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900
        &family=Fira+Code:wght@400;500;600&display=swap">
```
Esta tag bloquea el primer paint hasta que Google Fonts responde. Además se cargan 6 pesos de Inter (solo se necesitan 3).

**Solución — reemplazar en `index.html`:**

```html
<!-- Mantener preconnects existentes -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- NUEVO: preload del CSS de fuentes -->
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code:wght@400;500&display=swap">

<!-- NUEVO: carga no-bloqueante -->
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code:wght@400;500&display=swap"
  media="print" onload="this.media='all'">
<noscript>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code:wght@400;500&display=swap">
</noscript>
```

**Cambios:** Inter de 6 pesos → 3 (400, 600, 700). Fira Code de 3 → 2 (400, 500). Reduce el payload de fuentes ~35%.

**Alternativa preferible:** Autohost con `@fontsource/inter` + `@fontsource/fira-code` vía npm. Elimina la dependencia DNS de Google y permite caching `immutable` desde Fastly.

---

### SPEC-008: Firebase — lazy loading

**Prioridad:** Alta
**Esfuerzo estimado:** 2–4 horas
**Impacto en LCP:** −80 a −150ms (menos JS en critical path)

**Problema:**
`vendor-firebase-C_RNevIz.js` (340 KB raw / ~90 KB brotli) se carga en todas las páginas vía `modulepreload`, incluida `/privacy-policy` que no usa Firebase.

**Solución:**
Remover Firebase del bundle inicial. Cargarlo dinámicamente solo cuando el formulario de contacto es visible:

```javascript
// En el componente ContactForm.jsx
const initFirebase = async () => {
  const { initializeApp } = await import('firebase/app');
  const { getFirestore, addDoc, collection } = await import('firebase/firestore');
  // inicializar y usar
};

// Disparar en useEffect o al focus del formulario
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) initFirebase(); },
    { threshold: 0.1 }
  );
  observer.observe(formRef.current);
}, []);
```

En `vite.config.ts`, asegurarse que Firebase **no** esté en la lista de `modulePreload`.

---

### SPEC-009: Code splitting por ruta

**Prioridad:** Alta
**Esfuerzo estimado:** 3–5 horas
**Impacto en LCP:** −100 a −200ms

**Problema:**
`index-B-xG9TeJ.js` pesa 1,565 KB uncompressed. Todas las secciones (Hero, About, Projects, Skills, Contact) están en el bundle inicial.

**Solución:**
Implementar `React.lazy()` + `Suspense` para secciones no-críticas:

```javascript
// App.jsx
import { lazy, Suspense } from 'react';

const ProjectsSection = lazy(() => import('./sections/Projects'));
const ExperienceSection = lazy(() => import('./sections/Experience'));
const SkillsSection = lazy(() => import('./sections/Skills'));
const ContactSection = lazy(() => import('./sections/Contact'));

// Usar en JSX
<Suspense fallback={<SectionSkeleton />}>
  <ProjectsSection />
</Suspense>
```

**Objetivo:** Reducir el bundle inicial de 1,565 KB a <500 KB.

---

### SPEC-010: Preload imagen LCP + fetchpriority

**Prioridad:** Alta
**Esfuerzo estimado:** 30 minutos

**Problema:**
La imagen LCP (foto de perfil / hero) es descubierta por el browser solo después de ejecutar JS. No hay `<link rel="preload">` para ella en el HTML.

**Solución:**
Agregar en `index.html` `<head>`:

```html
<!-- Preload imagen LCP — ajustar URL a la real -->
<link rel="preload" as="image"
  href="/images/profile.webp"
  type="image/webp"
  fetchpriority="high">
```

En el componente JSX de la imagen:

```jsx
<img
  src="/images/profile.webp"
  alt="Genaro Pretill Escobar — Full Stack Developer"
  width={400}
  height={400}
  fetchPriority="high"
  loading="eager"
/>
```

---

### SPEC-011: Convertir logo.png a WebP con cache immutable

**Prioridad:** Media
**Esfuerzo estimado:** 1 hora

**Problema:**
`/images/logo.png` (12.6 KB PNG) se sirve con `Cache-Control: max-age=604800` (7 días) sin `immutable`. Sin content hash en el nombre, el cache no se puede invalidar correctamente.

**Solución:**
1. Convertir a WebP/AVIF con herramienta como `sharp` o Squoosh
2. Renombrar con hash: `logo-[hash].webp`
3. Servir con `Cache-Control: public, max-age=31536000, immutable`
4. Actualizar todas las referencias (HTML, JSON-LD, manifest)

---

## GRUPO 4 — Structured Data / Schema (Medio · Sprint 2)

### SPEC-012: Corregir JSON-LD del homepage

**Prioridad:** Media
**Esfuerzo estimado:** 30 minutos
**Archivo de referencia:** `schema/homepage-schema.json` (ya generado)

**Cambios requeridos sobre el JSON-LD actual en `index.html`:**

**Person schema — 4 cambios:**
```diff
- "url": "https://genaropretill.com",
+ "url": "https://genaropretill.com/",
+ "givenName": "Genaro",
+ "familyName": "Pretill Escobar",
+ "address": {
+   "@type": "PostalAddress",
+   "addressLocality": "Lima",
+   "addressCountry": "PE"
+ },
+ "alumniOf": {
+   "@type": "EducationalOrganization",
+   "name": "Universidad San Luis Gonzaga",
+   "department": "Ingeniería de Sistemas"
+ },
+ "knowsLanguage": ["es", "en"],
+ "nationality": "PE"
  "image": {
-   "url": "https://genaropretill.com/images/logo.png",
+   "url": "https://res.cloudinary.com/gepres/image/upload/.../profile-photo.jpg",
```
> **Nota:** `Person.image` debe ser foto de la persona, no el logo.

**WebSite schema — 3 cambios:**
```diff
- "url": "https://genaropretill.com",
+ "url": "https://genaropretill.com/",
- "inLanguage": ["es", "en"],
+ "inLanguage": ["es"],
+ "publisher": { "@id": "https://genaropretill.com/#person" },
+ "potentialAction": {
+   "@type": "SearchAction",
+   "target": {
+     "@type": "EntryPoint",
+     "urlTemplate": "https://genaropretill.com/?q={search_term_string}"
+   },
+   "query-input": "required name=search_term_string"
+ }
```

**ProfilePage schema — 3 cambios:**
```diff
- "url": "https://genaropretill.com",
+ "url": "https://genaropretill.com/",
+ "mainEntity": { "@id": "https://genaropretill.com/#person" },
+ "dateCreated": "2024-01-01",
  "dateModified": "2026-02-23"
```

---

### SPEC-013: JSON-LD específico para /cv y /privacy-policy

**Prioridad:** Media
**Esfuerzo estimado:** Incluido en SPEC-001 (SSG)
**Archivos de referencia:** `schema/cv-schema.json` y `schema/privacy-schema.json` (ya generados)

Las páginas `/cv` y `/privacy-policy` deben tener sus propios bloques JSON-LD (WebPage + BreadcrumbList) en lugar del ProfilePage del homepage. Los archivos JSON ya están generados en `schema/` — solo integrarlos al template de cada ruta.

---

## GRUPO 5 — On-Page SEO (Medio · Sprint 2)

### SPEC-014: Meta description del homepage

**Prioridad:** Media
**Esfuerzo estimado:** 15 minutos

**Problema:**
La descripción actual tiene 173 caracteres — Google la trunca en ~155 en los SERPs.

**Actual:**
```
Portfolio de Genaro Pretill - Full Stack Developer especializado en React.js, Vue.js, NestJS, TypeScript y arquitecturas modernas. Experiencia en DevOps y soluciones cloud.
```
(173 chars)

**Propuesta (148 chars):**
```
Full Stack Developer en Lima, Perú. Especializado en React.js, Vue.js, NestJS y Kubernetes. Disponible para proyectos remotos y freelance.
```

---

### SPEC-015: Consistencia og:title / twitter:title

**Prioridad:** Media
**Esfuerzo estimado:** 15 minutos

**Problema:**
El meta `<title>` dice "NestJS" pero og:title y twitter:title dicen "Node.js". Inconsistente para scrapers y bots sociales.

**Cambio en `index.html` (y en cada ruta SSG):**
```diff
- content="Genaro Pretill | Full Stack Developer - React.js, Vue.js, Node.js & TypeScript"
+ content="Genaro Pretill | Full Stack Developer — React, Vue.js & NestJS"
```
Aplicar en `og:title` y `twitter:title`.

---

### SPEC-016: Añadir og:image:alt y twitter:image:alt

**Prioridad:** Media
**Esfuerzo estimado:** 15 minutos

Agregar en el `<head>` de todas las páginas:

```html
<meta property="og:image:alt"
  content="Genaro Pretill Escobar — Full Stack Developer y DevOps Engineer" />
<meta name="twitter:image:alt"
  content="Genaro Pretill Escobar — Full Stack Developer y DevOps Engineer" />
```

---

### SPEC-017: Normalizar og:url y twitter:url (trailing slash)

**Prioridad:** Media
**Esfuerzo estimado:** 10 minutos

```diff
- <meta property="og:url" content="https://genaropretill.com" />
+ <meta property="og:url" content="https://genaropretill.com/" />
- <meta property="twitter:url" content="https://genaropretill.com" />
+ <meta property="twitter:url" content="https://genaropretill.com/" />
```

---

### SPEC-018: Títulos únicos para /cv y /privacy-policy

**Prioridad:** Alta
**Esfuerzo estimado:** Incluido en SPEC-001

| Ruta | Title actual | Title correcto |
|------|-------------|----------------|
| `/cv` | Mismo que homepage | `CV — Genaro Pretill Escobar \| Full Stack & DevOps Developer` |
| `/privacy-policy` | Mismo que homepage | `Política de Privacidad — Genaro Pretill` |

---

### SPEC-019: Scroll-reveal — bajar threshold a 0.05

**Prioridad:** Media
**Esfuerzo estimado:** 1 hora

**Problema:**
Los `IntersectionObserver` para las animaciones de entrada tienen threshold alto. Googlebot renderiza la página sin scroll, por lo que las secciones nunca se hacen visibles para el crawler.

**Solución:**
Bajar el threshold de `0.2` (o el valor actual) a `0.05` en todos los observers de scroll-reveal. En entorno de crawler (detectar `navigator.userAgent`), desactivar las animaciones completamente y mostrar todo el contenido de inmediato.

```javascript
const isBot = /Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot/i
  .test(navigator.userAgent);

const threshold = isBot ? 0 : 0.2;
```

---

## GRUPO 6 — Contenido / E-E-A-T (Medio · Sprint 3)

### SPEC-020: Expandir bio a mínimo 500 palabras estáticas

**Prioridad:** Alta
**Esfuerzo estimado:** 2–3 horas (redacción)

**Problema:**
El contenido estático indexable es ~120 palabras. El mínimo para una página de portfolio es 500 palabras.

**Secciones a expandir:**

1. **Bio principal** (actualmente 3 párrafos de ~30 palabras c/u → expandir a 5–6 párrafos):
   - Párrafo 1: Presentación + años de experiencia (número específico)
   - Párrafo 2: Rol actual en Izipay/Interbank con detalles concretos
   - Párrafo 3: Stack técnico con contexto de uso real
   - Párrafo 4: Filosofía de desarrollo / enfoque profesional
   - Párrafo 5: Formación + trayectoria
   - Párrafo 6: Disponibilidad y tipo de proyectos buscados

2. **Descripciones de servicios** (actualmente 1 oración c/u → expandir a 3–4 oraciones con ejemplos):
   - Frontend: tecnologías + casos de uso + metodología
   - Backend: stack + escala manejada + patrones usados
   - DevOps: herramientas + certificaciones + impacto medible

3. **Estadísticas hardcodeadas** (actualmente son valores dinámicos de Firestore):
   - Años de experiencia: valor numérico fijo en HTML
   - Proyectos completados: valor numérico fijo en HTML

---

### SPEC-021: Frases cuantificadas para AI citation readiness

**Prioridad:** Media
**Esfuerzo estimado:** 1 hora (redacción)

Añadir 3–5 párrafos densos en hechos verificables en el HTML estático — estos son los que citan herramientas como Perplexity, AI Overviews y ChatGPT:

**Ejemplo de formato:**
```
"Genaro Pretill Escobar es Full Stack Developer y DevOps Engineer con sede en
Lima, Perú, con [X] años de experiencia en desarrollo web. Actualmente trabaja
en Izipay, filial fintech de Interbank (uno de los mayores bancos privados del
Perú), donde gestiona infraestructura Kubernetes para aplicaciones de pagos
digitales y desarrolla interfaces con React y Next.js."
```

---

### SPEC-022: Contenido estático del Privacy Policy

**Prioridad:** Alta
**Esfuerzo estimado:** 2–3 horas

**Problema:**
La página `/privacy-policy` existe en el sitemap pero su contenido se renderiza dinámicamente. Googlebot no puede leer el texto legal.

**Solución:**
La página `/privacy-policy` debe ser HTML estático puro (no SPA). Crear `privacy-policy.html` con el contenido completo de la política hardcodeado, no dependiente de React.

---

## GRUPO 7 — Seguridad y PWA (Bajo · Sprint 3)

### SPEC-023: Content Security Policy header

**Prioridad:** Media
**Esfuerzo estimado:** 2–3 horas (testing incluido)

Configurar en Fastly/CDN el siguiente header para el stack actual:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
  font-src https://fonts.gstatic.com https://cdn.jsdelivr.net;
  img-src 'self' https://res.cloudinary.com data:;
  connect-src 'self' https://*.firebaseio.com https://firestore.googleapis.com;
  frame-ancestors 'none';
```

> **Precaución:** Testear exhaustivamente antes de deploy — React + inline scripts puede requerir ajustes.

---

### SPEC-024: Corregir manifest.json

**Prioridad:** Baja
**Esfuerzo estimado:** 30 minutos

**Cambios en `/meta/manifest.json`:**
```diff
{
- "name": "App",
+ "name": "Genaro Pretill — Portfolio",
+ "short_name": "G. Pretill",
+ "start_url": "/",
+ "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    {
-     "src": "/android-icon-36x36.png",
+     "src": "/meta/android-icon-36x36.png",
```
Ajustar todos los paths de iconos para que sean relativos al location del manifest (`/meta/manifest.json`) o usar URLs absolutas.

---

### SPEC-025: Actualizar OG image (2019 → actual)

**Prioridad:** Baja
**Esfuerzo estimado:** 1 hora

**Problema:**
La imagen social tiene un timestamp de Cloudinary de 2019 (`v1573426296`). Actualizar a una imagen reciente.

**Solución:**
Subir nueva imagen a Cloudinary (1200×630px, <200 KB) y actualizar en:
- `og:image` en homepage, cv y privacy-policy
- `twitter:image` en las mismas páginas

---

### SPEC-026: Añadir copyright al footer

**Prioridad:** Baja
**Esfuerzo estimado:** 15 minutos

Agregar en el componente Footer:
```html
<p>© 2026 Genaro Pretill Escobar. Todos los derechos reservados.</p>
```

---

### SPEC-027: Sitemap — lastmod granular por página

**Prioridad:** Baja
**Esfuerzo estimado:** 30 minutos

**Problema:**
Las 3 URLs en `sitemap.xml` tienen el mismo `lastmod` (fecha de hoy). Google detecta esto como señal de que las fechas son auto-generadas e ignora el valor.

**Solución:**
Asignar fechas reales de última modificación por página:

```xml
<url>
  <loc>https://genaropretill.com/</loc>
  <lastmod>2026-02-23</lastmod>  <!-- Actualizar solo cuando cambie el homepage -->
</url>
<url>
  <loc>https://genaropretill.com/cv</loc>
  <lastmod>2026-01-15</lastmod>  <!-- Fecha real de última actualización del CV -->
</url>
<url>
  <loc>https://genaropretill.com/privacy-policy</loc>
  <lastmod>2024-06-01</lastmod>  <!-- Fecha real de la política -->
</url>
```

Automatizar en el proceso de build: el `lastmod` debe actualizarse solo cuando el contenido de esa ruta cambie.

---

## GRUPO 8 — Contenido a largo plazo (Backlog)

### SPEC-028: Blog / escritura técnica

**Prioridad:** Baja (backlog)
**Impacto esperado:** +8–12 puntos en Content Quality a 6 meses

Crear una sección `/blog` con artículos técnicos (mínimo 1,000 palabras c/u, 4–6 artículos/año). Temas sugeridos basados en el stack actual:

- "Gestión de infraestructura Kubernetes en producción — lecciones aprendidas en Izipay"
- "CI/CD con GitHub Actions y Docker en proyectos NestJS"
- "Migración de Vue.js 2 a Vue 3: proceso y pitfalls"
- "Implementando autenticación con Firebase en React sin comprometer el bundle size"

Beneficios: señal de frescura recurrente, cobertura de keywords long-tail, material citable para AI Overview.

---

### SPEC-029: Sección de testimonios

**Prioridad:** Baja (backlog)
**Impacto:** +5 puntos en Trustworthiness / E-E-A-T

Añadir 2–3 testimonios de colegas o clientes (con nombre y cargo) con `Review` schema:

```json
{
  "@type": "Review",
  "reviewBody": "Texto del testimonio...",
  "author": {
    "@type": "Person",
    "name": "Nombre Apellido",
    "jobTitle": "Senior Engineer en Empresa X"
  }
}
```

---

## Checklist de implementación

### Sprint 1 — Crítico (Semana 1)
- [ ] **SPEC-003** — Redirect www → non-www en CDN
- [ ] **SPEC-002** — Contenido estático de emergencia en index.html
- [ ] **SPEC-005** — HTTP 404 para rutas desconocidas
- [ ] **SPEC-007** — Google Fonts non-blocking
- [ ] **SPEC-014** — Meta description homepage (≤155 chars)
- [ ] **SPEC-015** — Consistencia og:title/twitter:title
- [ ] **SPEC-017** — Trailing slash en og:url/twitter:url

### Sprint 2 — Alto (Semanas 2–4)
- [ ] **SPEC-001** — Migración SSG (Astro o react-snap)
- [ ] **SPEC-004** — Canonical por ruta *(bloqueado por SPEC-001)*
- [ ] **SPEC-018** — Títulos únicos por ruta *(bloqueado por SPEC-001)*
- [ ] **SPEC-013** — JSON-LD específico por ruta *(bloqueado por SPEC-001)*
- [ ] **SPEC-008** — Firebase lazy loading
- [ ] **SPEC-009** — Code splitting por ruta
- [ ] **SPEC-010** — Preload imagen LCP + fetchpriority
- [ ] **SPEC-006** — Normalización trailing slash en CDN
- [ ] **SPEC-012** — Corregir JSON-LD homepage (trailing slash, SearchAction, publisher, mainEntity)
- [ ] **SPEC-016** — og:image:alt y twitter:image:alt
- [ ] **SPEC-019** — Scroll-reveal threshold 0.05 + bot detection
- [ ] **SPEC-022** — Privacy Policy como HTML estático

### Sprint 3 — Medio (Mes 2)
- [ ] **SPEC-020** — Expandir bio a 500+ palabras estáticas
- [ ] **SPEC-021** — Párrafos cuantificados AI citation-ready
- [ ] **SPEC-011** — logo.png → WebP + cache immutable
- [ ] **SPEC-023** — Content Security Policy header
- [ ] **SPEC-024** — Corregir manifest.json
- [ ] **SPEC-025** — Actualizar OG image (2019 → 2026)
- [ ] **SPEC-026** — Copyright en footer
- [ ] **SPEC-027** — Sitemap lastmod granular por página

### Backlog (Mes 3+)
- [ ] **SPEC-028** — Blog con artículos técnicos
- [ ] **SPEC-029** — Sección de testimonios con Review schema

---

## Impacto esperado por grupo

| Grupo | Score actual | Score post-fix | Delta |
|-------|-------------|----------------|-------|
| Arquitectura (SSG) | ~30 | ~75 | +45 |
| Indexabilidad | ~45 | ~90 | +45 |
| Performance | ~45 | ~70 | +25 |
| Schema | ~70 | ~88 | +18 |
| On-Page SEO | ~65 | ~82 | +17 |
| Contenido / E-E-A-T | ~52 | ~68 | +16 |
| Seguridad / PWA | ~85 | ~90 | +5 |

**Score total estimado post-Sprint 1+2: 75–78 / 100**
**Score total estimado post-Sprint 3: 80–85 / 100**

---

*Spec generado a partir del audit SEO completo de 6 subagentes especializados.*
*Archivos de referencia: `schema/`, `screenshots/`, `schema-analysis-report.md`, `seo-visual-report.md`*
