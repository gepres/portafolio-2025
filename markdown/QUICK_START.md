# 🚀 Quick Start Guide - Portfolio Genaro 2025

## 📋 Pasos de Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita los servicios:
   - **Authentication**: Email/Password y Google
   - **Firestore Database**: Modo de producción
   - **Storage**: Reglas por defecto

4. Copia tus credenciales de Firebase:
   - Ve a: Configuración del proyecto > Tus aplicaciones > Web
   - Copia el objeto de configuración

### 3. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Edita `.env` y pega tus credenciales:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 4. Configurar Firestore (Importante!)

En Firebase Console > Firestore Database:

1. **Crear documento en settings:**
```javascript
Collection: settings
Document ID: main
{
  siteTitle: "Portfolio Genaro Pretill",
  aboutBio: "Full Stack Developer...",
  contactEmail: "contact@example.com",
  socialLinks: {
    github: "https://github.com/usuario",
    linkedin: "https://linkedin.com/in/usuario",
    email: "contact@example.com"
  },
  theme: "dark",
  updatedAt: [Timestamp actual]
}
```

2. **Crear un usuario admin** (Firebase Console > Authentication):
   - Agrega un usuario con email/password
   - Este será tu usuario para acceder al panel admin

### 5. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La app estará en: `http://localhost:5173`

### 6. Acceder al Admin Panel

1. Ve a: `http://localhost:5173/admin/login`
2. Inicia sesión con el usuario que creaste en Firebase Auth
3. ¡Ahora puedes gestionar tu contenido!

## 📦 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Preview del build

# Deployment
firebase login       # Login en Firebase
firebase init        # Inicializar Firebase (solo primera vez)
firebase deploy      # Desplegar a Firebase Hosting
```

## 🎨 Estructura del Proyecto

```
src/
├── app/              # App principal y configuración
├── pages/            # Páginas de la aplicación
├── components/       # Componentes reutilizables
│   ├── layout/      # Navbar, Footer, etc.
│   ├── home/        # Componentes del Home
│   ├── projects/    # Componentes de proyectos
│   ├── animations/  # Componentes de animación
│   └── ui/          # Componentes UI base
├── lib/             # Utilidades y configuración
│   ├── firebase/   # Configuración Firebase
│   └── utils/      # Funciones de utilidad
├── hooks/           # Custom React hooks
├── context/         # React Context providers
├── types/           # TypeScript types
└── styles/          # Estilos globales
```

## ✅ Checklist Post-Instalación

- [ ] Firebase proyecto creado
- [ ] Authentication habilitado (Email/Password + Google)
- [ ] Firestore Database creado
- [ ] Storage habilitado
- [ ] Variables de entorno configuradas (.env)
- [ ] Usuario admin creado en Authentication
- [ ] Documento 'settings' creado en Firestore
- [ ] Servidor de desarrollo corriendo
- [ ] Login funcionando en /admin/login

## 🐛 Troubleshooting

**Error: Firebase configuration**
- Verifica que todas las variables en `.env` estén correctas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto

**Error: Can't read from Firestore**
- Verifica las reglas de seguridad en Firebase Console
- Asegúrate de que el documento 'settings' exista

**Error: Can't login**
- Verifica que el usuario exista en Firebase Authentication
- Comprueba que Email/Password esté habilitado en Authentication

## 📚 Próximos Pasos

1. Personaliza el contenido en `src/pages/`
2. Agrega proyectos desde el admin panel
3. Sube tu CV y personaliza las redes sociales
4. Despliega a Firebase Hosting

## 🆘 Ayuda

Si encuentras problemas, revisa:
- `README.md` para documentación completa
- Firebase Console para verificar servicios
- Console del navegador para errores JavaScript
