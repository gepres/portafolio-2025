# Sistema de CV Dinámico con Generación de PDF

## Descripción

Sistema completo de CV que permite visualizar y descargar un currículum vitae profesional en formato PDF. Los datos se obtienen dinámicamente desde Firebase Firestore, **reutilizando las colecciones existentes** del portafolio para optimizar el almacenamiento.

## Características

- ✅ Diseño profesional de dos columnas
- ✅ **Reutiliza datos existentes** (experiencia, skills, perfil, contacto)
- ✅ Solo requiere agregar educación e idiomas
- ✅ Generación de PDF de alta calidad
- ✅ Responsive design
- ✅ Soporte bilingüe (Español/Inglés)
- ✅ Acceso directo desde el Dashboard

## Estructura de Archivos

```
src/
├── components/
│   └── CV/
│       ├── CVTemplate.tsx          # Componente principal del CV
│       ├── CVLeftColumn.tsx        # Columna izquierda
│       ├── CVRightColumn.tsx       # Columna derecha
│       ├── CVEducation.tsx         # Sección educación
│       ├── CVSkills.tsx            # Skills técnicos
│       ├── CVSoftSkills.tsx        # Soft skills
│       ├── CVExperience.tsx        # Experiencia laboral
│       ├── CVLanguages.tsx         # Idiomas
│       └── CVPDFGenerator.tsx      # Generación de PDF
├── hooks/
│   └── useCV.ts                    # Hook para datos del CV
├── lib/
│   └── firebase/
│       ├── cvService.ts            # Servicio que mapea colecciones
│       ├── seedCVData.ts           # Seed de educación e idiomas
│       └── seedHelper.ts           # Helper para consola
├── pages/
│   ├── CVPage.tsx                  # Página del CV
│   └── SeedCVPage.tsx              # Página para configurar datos
└── types/
    └── index.ts                    # Tipos TypeScript
```

## Mapeo de Datos (Optimización)

El sistema **reutiliza** las siguientes colecciones existentes:

| Dato del CV | Colección Firestore | Campo/Mapeo |
|-------------|-------------------|-------------|
| **Información Personal** | `profile` + `contact` | fullName, title, email, phone, location |
| **Experiencia Laboral** | `experiences` | role → position, company, dates, description |
| **Soft Skills** | `competencies` | name, order |
| **Technical Skills** | `skills` | name, level, category |

### Colecciones Nuevas (Solo 2)

Solo necesitas crear estas **dos colecciones adicionales**:
- `cv_education` - Educación académica
- `cv_languages` - Idiomas

## Instalación

Las dependencias ya están instaladas:
- `html2canvas`: Captura del CV como imagen
- `jspdf`: Generación del archivo PDF

## Uso

### 1️⃣ Acceder desde el Dashboard

1. Inicia sesión en el dashboard: `/admin/login`
2. En la sección **"Vista General"**, verás el botón **"Ver/Descargar CV"** en Quick Actions
3. Haz clic para abrir el CV en una nueva pestaña

### 2️⃣ Configurar Datos (Primera vez)

Si es la primera vez que usas el CV:

**Opción A: Página de configuración**
1. Navega a `/seed-cv`
2. Haz clic en **"Agregar Educación e Idiomas"**
3. Espera unos segundos
4. Haz clic en **"Ver CV"**

**Opción B: Consola del navegador**
1. Abre la consola (F12)
2. Ejecuta: `(window as any).seedCV()`
3. Navega a `/cv`

### 3️⃣ Ver y Descargar el CV

- **Ver CV**: Navega a `/cv`
- **Descargar PDF**: Haz clic en el botón "Descargar PDF"
- El archivo se descarga como: `CV_GenaroPretillEscobar_2025.pdf`

## Estructura de Datos en Firestore

### Colecciones Reutilizadas (Ya existen)

✅ **profile** (documento 'main')
```typescript
{
  fullName: string | BilingualText;
  title: string | BilingualText;
  description: string | BilingualText; // Se usa como summary
  socialLinks: { linkedin?: string };
}
```

✅ **contact** (documento 'main')
```typescript
{
  email: string;
  phone: string;
  location: string | BilingualText;
}
```

✅ **experiences** (colección)
```typescript
{
  role: string | BilingualText;        // Se mapea a position
  company: string;
  startDate: string;
  endDate: string;
  description: string | BilingualText;
  technologies: string[];
  current: boolean;
}
```

✅ **competencies** (colección) - Usado como Soft Skills
```typescript
{
  name: string | BilingualText;
  order: number;
  active: boolean;
}
```

✅ **skills** (colección) - Usado como Technical Skills
```typescript
{
  name: string;
  level: number; // 0-100
  category: SkillCategory;
  order: number;
}
```

### Colecciones Nuevas (Creadas por el seed)

🆕 **cv_education** (colección)
```typescript
{
  degree: BilingualText;
  institution: BilingualText;
  startDate: string;
  endDate: string;
  order: number;
}
```

🆕 **cv_languages** (colección)
```typescript
{
  language: BilingualText;
  level: BilingualText;
  order: number;
}
```

## Acceso Rápido

### Desde el Dashboard
- **Dashboard** → Vista General → **"Ver/Descargar CV"** (botón en Quick Actions)

### URLs Directas
- `/cv` - Ver CV completo
- `/seed-cv` - Configurar educación e idiomas (primera vez)
- `/admin/dashboard` - Panel de administración

## Personalización

### Actualizar Datos del CV

Los datos del CV se actualizan automáticamente cuando modificas:
- **Experiencia**: Edita en Dashboard → Experiencia
- **Skills**: Edita en Dashboard → Skills
- **Soft Skills**: Edita en Dashboard → Competencias
- **Información Personal**: Edita en Dashboard → Perfil / Contacto

Solo necesitas gestionar manualmente:
- **Educación**: Directamente en Firestore (`cv_education`)
- **Idiomas**: Directamente en Firestore (`cv_languages`)

### Modificar el Diseño

Los componentes están diseñados con Tailwind CSS:
- `CVTemplate.tsx`: Layout general y header
- `CVLeftColumn.tsx`: Columna izquierda (educación, skills, idiomas)
- `CVRightColumn.tsx`: Columna derecha (resumen, experiencia)

### Configuración del PDF

Edita `CVPDFGenerator.tsx`:
```typescript
const canvas = await html2canvas(element, {
  scale: 2,           // Calidad (1-3)
  useCORS: true,
  backgroundColor: '#ffffff',
});
```

## Ventajas de esta Implementación

✅ **Eficiencia**: Solo 2 colecciones nuevas en lugar de 6
✅ **Consistencia**: Un solo lugar para actualizar datos
✅ **Mantenimiento**: Cambios en experiencia/skills se reflejan automáticamente en el CV
✅ **Almacenamiento**: Menor uso de Firestore
✅ **Sincronización**: Datos siempre actualizados entre portafolio y CV

## Datos Prepoblados

La función `seedCVData()` crea:
- 2 títulos académicos (Ingeniería de Sistemas, Matemática e Informática)
- 2 idiomas (Español Nativo, Inglés Intermedio)

El resto de los datos provienen automáticamente de tus colecciones existentes.

## Troubleshooting

### El CV no se carga
- **Causa**: No hay datos en las colecciones reutilizadas
- **Solución**: Asegúrate de tener datos en `profile`, `contact`, `experiences`, `skills` y `competencies`

### Solo veo educación e idiomas
- **Causa**: Las colecciones principales están vacías
- **Solución**: Ve al Dashboard y agrega experiencia, skills y completa tu perfil

### El PDF se ve diferente
- **Solución**: Aumenta el `scale` en `CVPDFGenerator.tsx` (línea del html2canvas)

### Error de TypeScript
- **Solución**: Ejecuta `npm run build` para verificar errores

## Próximas Mejoras

- [ ] Editor de educación e idiomas desde el Dashboard
- [ ] Múltiples plantillas de CV
- [ ] Exportación en más formatos (DOCX, JSON)
- [ ] Vista previa antes de descargar PDF

## Notas Técnicas

- **Mapeo automático**: `cvService.ts` transforma los datos de las colecciones existentes al formato del CV
- **Categorías de skills**: Se mapean automáticamente (ej: `database` → `backend`, `cloud_devops` → `cloud`)
- **BilingualText**: El sistema detecta automáticamente el idioma actual y muestra el texto correspondiente
- **Performance**: Usa `Promise.all()` para cargar todas las colecciones en paralelo

---

Para soporte técnico, consulta la documentación del proyecto principal.
