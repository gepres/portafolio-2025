# 🎯 Guía Completa del CRUD en el Dashboard

## ✅ Sistema CRUD Completado

El dashboard ahora cuenta con un **sistema CRUD completo y funcional** para gestionar:
- ✅ **Proyectos**
- ✅ **Experiencia Laboral**
- ✅ **Habilidades**

---

## 🚀 Cómo Usar el Dashboard

### 1. Acceder al Dashboard

```
http://localhost:5174/admin/login
```

Inicia sesión con tus credenciales de Firebase.

---

## 📁 Gestión de Proyectos

### Crear Nuevo Proyecto
1. Ve a la pestaña **"Proyectos"**
2. Haz clic en **"Nuevo Proyecto"** (botón azul)
3. Completa el formulario:
   - **Título*** (requerido)
   - **Descripción Corta*** (2-3 líneas)
   - **Descripción Detallada** (opcional)
   - **Tecnologías*** (separadas por coma)
   - **Categoría*** (Web, Mobile, Desktop, Otro)
   - **Proyecto Destacado** (checkbox)
   - **URL de Imagen** (opcional)
   - **URL Demo** (opcional)
   - **URL GitHub** (opcional)
4. Haz clic en **"Crear"**

### Editar Proyecto
1. Busca el proyecto en la lista
2. Haz clic en el botón **"Editar"**
3. Modifica los campos necesarios
4. Haz clic en **"Actualizar"**

### Eliminar Proyecto
1. Busca el proyecto en la lista
2. Haz clic en el botón del **ícono de basura** (🗑️)
3. Confirma la eliminación

### Características del Formulario
- ✅ Validación en tiempo real
- ✅ Campos requeridos marcados con *
- ✅ Preview de imagen si agregas URL
- ✅ Separación automática de tecnologías
- ✅ Checkbox para proyectos destacados
- ✅ Modal con diseño glassmorphism

---

## 💼 Gestión de Experiencia

### Crear Nueva Experiencia
1. Ve a la pestaña **"Experiencia"**
2. Haz clic en **"Nueva Experiencia"**
3. Completa el formulario:
   - **Empresa*** (requerido)
   - **Cargo*** (requerido)
   - **Fecha Inicio*** (formato libre, ej: "Enero 2022")
   - **Fecha Fin*** (se desactiva si es trabajo actual)
   - **Trabajo Actual** (checkbox)
   - **Descripción*** (responsabilidades y logros)
   - **Tecnologías*** (separadas por coma)
4. Haz clic en **"Crear"**

### Editar Experiencia
1. Busca la experiencia en la lista
2. Haz clic en el botón **"Editar"** (ícono de lápiz)
3. Modifica los campos necesarios
4. Haz clic en **"Actualizar"**

### Eliminar Experiencia
1. Busca la experiencia en la lista
2. Haz clic en el botón del **ícono de basura**
3. Confirma la eliminación

### Características del Formulario
- ✅ Checkbox "Trabajo Actual" desactiva fecha fin
- ✅ Formato de fechas libre (ej: "Enero 2022")
- ✅ Textarea amplio para descripción
- ✅ Tecnologías en badges de color

---

## ⚡ Gestión de Habilidades

### Crear Nueva Habilidad
1. Ve a la pestaña **"Habilidades"**
2. Haz clic en **"Nueva Habilidad"**
3. Completa el formulario:
   - **Nombre*** (ej: React, Node.js, Docker)
   - **Categoría*** (Frontend, Backend, DevOps, Otros)
   - **Nivel de Dominio** (slider de 0-100%)
4. Observa el preview de la barra de progreso
5. Haz clic en **"Crear"**

### Editar Habilidad
1. Busca la habilidad en su categoría
2. Haz clic en el botón **"Editar"**
3. Ajusta el nivel con el slider
4. Haz clic en **"Actualizar"**

### Eliminar Habilidad
1. Busca la habilidad en la lista
2. Haz clic en el botón del **ícono de basura**
3. Confirma la eliminación

### Características del Formulario
- ✅ **Slider interactivo** para nivel (0-100%)
- ✅ **Preview en tiempo real** de la barra de progreso
- ✅ Indicadores visuales: Principiante, Intermedio, Experto
- ✅ Organización automática por categorías
- ✅ Gradiente animado en la barra

---

## 🎨 Características del Dashboard

### Vista General
- **Estadísticas en tiempo real** de todos los elementos
- **Cards interactivas** con contadores
- **Acciones rápidas** para navegar entre secciones

### Sistema de Tabs
- **Vista General**: Resumen y acciones rápidas
- **Proyectos**: Grid de proyectos con imágenes
- **Experiencia**: Timeline de experiencias
- **Habilidades**: Organizadas por categorías

### Modales
- **Diseño glassmorphism** consistente
- **Animaciones suaves** con Framer Motion
- **Backdrop blur** cuando se abre un modal
- **Cierre con ESC** o clic fuera del modal
- **Validación en tiempo real**
- **Loading states** durante guardado

### Toast Notifications
- ✅ Éxito al crear/editar/eliminar
- ❌ Error con mensaje descriptivo
- 🔄 Loading durante operaciones

---

## 🔄 Flujo de Trabajo Recomendado

### 1. Cargar Datos de Ejemplo
```
1. Haz clic en "Cargar Datos" en el header
2. Esto agregará:
   - 6 proyectos de ejemplo
   - 4 experiencias laborales
   - 30 habilidades en 4 categorías
3. Usa estos datos como plantilla
```

### 2. Personalizar el Contenido
```
1. Edita los proyectos de ejemplo con tus datos reales
2. Ajusta las experiencias laborales
3. Modifica las habilidades según tu nivel
4. Elimina lo que no necesites
5. Agrega nuevo contenido según sea necesario
```

### 3. Verificar en el Portafolio
```
1. Haz clic en "Ver Portafolio"
2. Navega por todas las secciones
3. Verifica que todo se vea correcto
4. Regresa al dashboard para ajustes
```

---

## 📊 Estructura de Datos

### Proyecto
```typescript
{
  title: string;              // Título del proyecto
  description: string;        // Descripción corta (para cards)
  longDescription?: string;   // Descripción detallada (para modal)
  technologies: string[];     // Array de tecnologías
  category: 'web' | 'mobile' | 'desktop' | 'other';
  imageUrl?: string;          // URL de imagen
  demoUrl?: string;           // URL de demo en vivo
  githubUrl?: string;         // URL del repositorio
  featured: boolean;          // ¿Es destacado?
  createdAt: Date;           // Fecha de creación
}
```

### Experiencia
```typescript
{
  company: string;           // Nombre de la empresa
  role: string;              // Cargo/Posición
  startDate: string;         // Fecha inicio (formato libre)
  endDate: string;           // Fecha fin o "Presente"
  description: string;       // Responsabilidades y logros
  technologies: string[];    // Array de tecnologías usadas
  current: boolean;          // ¿Es trabajo actual?
}
```

### Habilidad
```typescript
{
  name: string;              // Nombre de la habilidad
  level: number;             // Nivel de dominio (0-100)
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Other';
}
```

---

## 🎯 Tips y Buenas Prácticas

### Para Proyectos
- ✅ Usa imágenes de alta calidad (1200x600px recomendado)
- ✅ Descripción corta: máximo 2-3 líneas
- ✅ Marca como "Destacado" tus 3-4 mejores proyectos
- ✅ Incluye enlaces a demo y GitHub cuando sea posible
- ✅ Usa entre 3-6 tecnologías principales

### Para Experiencia
- ✅ Formato de fechas consistente (ej: "Enero 2022")
- ✅ Describe logros cuantificables cuando sea posible
- ✅ Menciona las tecnologías más relevantes
- ✅ Máximo 4-5 experiencias laborales

### Para Habilidades
- ✅ Sé honesto con tu nivel de dominio
- ✅ 50-70%: Nivel intermedio
- ✅ 70-85%: Nivel avanzado
- ✅ 85-100%: Nivel experto
- ✅ Organiza por categorías para mejor visualización
- ✅ Incluye solo habilidades relevantes

---

## 🐛 Solución de Problemas

### Error al guardar
- Verifica que todos los campos requeridos (*) estén completos
- Revisa tu conexión a internet
- Asegúrate de estar autenticado en Firebase

### No se ven los cambios
- Haz clic en "Ver Portafolio" para ver en tiempo real
- Recarga la página del portafolio
- Verifica que el cambio se guardó (debe aparecer toast de éxito)

### Modal no cierra
- Haz clic fuera del modal
- Presiona ESC
- Haz clic en la X
- Recarga la página si persiste

---

## 🎉 ¡Listo!

Ahora tienes un **dashboard completamente funcional** para gestionar todo el contenido de tu portafolio.

**Funcionalidades:**
- ✅ Crear, Editar y Eliminar Proyectos
- ✅ Crear, Editar y Eliminar Experiencias
- ✅ Crear, Editar y Eliminar Habilidades
- ✅ Cargar datos de ejemplo con un clic
- ✅ Vista previa en tiempo real
- ✅ Validación de formularios
- ✅ Toast notifications
- ✅ Modales con glassmorphism
- ✅ Responsive design

**¡Disfruta gestionando tu portafolio!** 🚀
