# 📝 Instrucciones de Uso del Portafolio

## 🎉 ¡Todo está listo!

Tu portafolio profesional está completamente configurado y funcionando. Aquí te explico cómo usarlo:

---

## 🚀 Iniciar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en: **http://localhost:5174**

---

## 🎨 Características Implementadas

### ✅ Smooth Scroll Mejorado
- **Lenis smooth scroll** configurado con animaciones fluidas
- Duración de scroll: 1.5 segundos
- Easing suave y natural
- Compatible con navegación por anclas (#about, #projects, etc.)

### ✅ Dashboard de Admin Completo
- Vista general con estadísticas
- Gestión de proyectos con vista de tarjetas
- Gestión de experiencia con timeline
- Gestión de habilidades organizadas por categoría
- Botón "Cargar Datos de Ejemplo" en el header

### ✅ Datos de Ejemplo Incluidos
- **6 proyectos** de ejemplo (E-Commerce, Task Manager, Weather Dashboard, etc.)
- **4 experiencias** laborales
- **30 habilidades** organizadas en 4 categorías:
  - Frontend (React, TypeScript, Tailwind, etc.)
  - Backend (Node.js, PostgreSQL, MongoDB, etc.)
  - DevOps (Docker, AWS, Git, etc.)
  - Other (React Native, Figma, Testing, etc.)

---

## 🔐 Acceso al Dashboard de Admin

### Paso 1: Iniciar sesión
1. Ve a **http://localhost:5174/admin/login**
2. Usa las credenciales de Firebase que configuraste

### Paso 2: Cargar datos de ejemplo
1. Una vez dentro del dashboard, haz clic en el botón **"Cargar Datos de Ejemplo"** (botón azul en el header)
2. Esto cargará automáticamente:
   - 6 proyectos con imágenes y descripciones completas
   - 4 experiencias laborales
   - 30 habilidades técnicas
3. Los datos se guardarán en Firebase Firestore

### Paso 3: Explorar el dashboard
- **Vista General**: Resumen y acciones rápidas
- **Proyectos**: Grid de proyectos con imágenes y tecnologías
- **Experiencia**: Timeline de experiencias laborales
- **Habilidades**: Barras de progreso organizadas por categoría

---

## 🎯 Navegación del Portafolio

El portafolio es una **One-Page Application** con las siguientes secciones:

1. **Hero** - Presentación principal con avatar y CTAs
2. **About** - Sobre mí, servicios e intereses
3. **Projects** - Grid de proyectos con filtros
4. **Experience** - Timeline de experiencia laboral
5. **Skills** - Habilidades con barras de progreso
6. **Contact** - Formulario de contacto

### Smooth Scroll
- Haz clic en cualquier enlace del navbar
- Los botones "Ver Proyectos" y "Contactar" del Hero
- Todo el scroll es suave y animado

---

## 🎨 Estilos y Diseño

### Glassmorphism
Todas las tarjetas y elementos usan efectos glassmorphism:
- `.glass` - Fondo translúcido con blur
- `.glass-hover` - Con efecto hover

### Gradientes
- `.gradient-text` - Texto con gradiente (índigo a rosa)
- `.gradient-primary` - Gradiente índigo a púrpura
- `.gradient-accent` - Gradiente púrpura a rosa

### Animaciones
- `.animate-gradient-shift` - Gradiente animado
- `.animate-pulse-glow` - Pulso con brillo
- `.animate-float` - Flotación suave

### Colores Personalizados
```javascript
primary: '#6366f1'    // Índigo
secondary: '#8b5cf6'  // Púrpura
accent: '#ec4899'     // Rosa
dark: '#0f172a'       // Fondo oscuro
light: '#f8fafc'      // Texto claro
```

---

## 📱 Responsive Design

El portafolio es totalmente responsive:
- **Mobile**: Hamburger menu, grid de 1 columna
- **Tablet**: Grid de 2 columnas
- **Desktop**: Grid de 3 columnas, navbar completo

---

## 🔧 Modificar Contenido

### Opción 1: Desde el Dashboard (Recomendado)
1. Inicia sesión en `/admin/login`
2. Usa los botones "Nuevo Proyecto", "Nueva Experiencia", etc.
3. Los cambios se guardan automáticamente en Firebase

### Opción 2: Modificar datos de ejemplo
Edita el archivo: `src/lib/data/sampleData.ts`

```typescript
export const sampleProjects: Omit<Project, 'id'>[] = [
  {
    title: 'Tu Proyecto',
    description: 'Descripción corta',
    // ... más campos
  },
];
```

Luego recarga los datos desde el dashboard.

---

## 🎨 Personalización

### Cambiar colores
Edita `tailwind.config.js`:

```javascript
colors: {
  primary: '#TU_COLOR',
  secondary: '#TU_COLOR',
  accent: '#TU_COLOR',
}
```

### Cambiar fuentes
Edita `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=TU_FUENTE');
```

### Cambiar información personal
Edita `src/components/home/Hero.tsx`:

```typescript
<h1>Tu Nombre</h1>
<h2>Tu Título</h2>
<p>Tu Descripción</p>
```

---

## 🌐 Deploy

### Vercel (Recomendado)
```bash
npm run build
# Sube la carpeta dist/ a Vercel
```

### Netlify
```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

---

## 📝 Notas Importantes

1. **Firebase**: Asegúrate de tener configurado Firebase en `src/lib/firebase/config.ts`
2. **Imágenes**: Los datos de ejemplo usan imágenes de Unsplash (requieren internet)
3. **Scroll Suave**: Funciona mejor en navegadores modernos (Chrome, Firefox, Edge)
4. **VS Code**: La advertencia de `@tailwind` ya está solucionada en `.vscode/settings.json`

---

## 🐛 Solución de Problemas

### El scroll no es suave
- Asegúrate de que Lenis esté instalado: `npm install @studio-freight/lenis`
- Verifica que el servidor esté corriendo

### No se ven los estilos
- Limpia la caché: `npm run dev` (Ctrl+C y reinicia)
- Verifica que Tailwind esté configurado correctamente

### Error al cargar datos de ejemplo
- Verifica que Firebase esté configurado
- Revisa la consola del navegador para más detalles

---

## 📞 Soporte

Si tienes problemas, verifica:
1. Consola del navegador (F12)
2. Terminal donde corre `npm run dev`
3. Configuración de Firebase

---

¡Disfruta tu nuevo portafolio! 🎉
