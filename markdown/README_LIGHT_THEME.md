# Documentación del Tema Claro (Light Mode)

Este documento guarda la configuración de colores utilizada para el modo claro antes de revertir los cambios, por si se desea implementar nuevamente en el futuro.

## Paleta de Colores (Tailwind Slate)

Se utilizó la escala de grises `slate` (azul grisáceo) de Tailwind CSS para crear una interfaz limpia y profesional.

### Fondos (Backgrounds)
- **Fondo Principal**: `bg-slate-50` (Gris muy claro, casi blanco)
- **Secciones Alternadas**: `bg-slate-100/50` (Gris claro con transparencia)
- **Tarjetas / Glassmorphism**: `bg-white/70` (Blanco translúcido)
- **Inputs / Elementos Web**: `bg-white/50` o `bg-slate-100` hover.

### Textos (Typography)
- **Títulos / Principal**: `text-slate-900` (Gris muy oscuro, casi negro)
- **Subtítulos / Párrafos**: `text-slate-600` (Gris medio, buen contraste)
- **Texto Secundario / Muted**: `text-slate-500` (Gris suave para metadatos)
- **Texto Deshabilitado**: `text-slate-400`

### Bordes (Borders)
- **Bordes Generales**: `border-slate-200`
- **Bordes Glass**: `border-slate-200/50`
- **Focus Ring**: `ring-primary` (mantiene el color de acento original)

### Implementación Técnica (Referencia)

Para activar el modo claro se utilizó la estrategia `darkMode: 'class'` de Tailwind, donde la clase por defecto es el modo claro y los estilos oscuros se aplican con el prefijo `dark:`.

**Ejemplo de conversión:**
- Original (Dark): `text-light` (Blanco)
- Híbrido: `text-slate-600 dark:text-light` (Gris en claro, Blanco en oscuro)

- Original (Dark): `bg-dark` (Azul oscuro)
- Híbrido: `bg-slate-50 dark:bg-dark` (Gris claro en claro, Azul oscuro en oscuro)
