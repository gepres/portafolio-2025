# 🔧 Solución de Problemas - ERR_BLOCKED_BY_CLIENT

## ❌ Error: `net::ERR_BLOCKED_BY_CLIENT`

Este error aparece cuando intentas crear, editar o eliminar proyectos/experiencias/habilidades en el dashboard.

### 🔍 ¿Qué causa este error?

El navegador o una extensión está **bloqueando las peticiones a Firebase**. Esto es común con:
- ✋ **Ad blockers** (uBlock Origin, AdBlock Plus, etc.)
- 🔒 **Extensiones de privacidad** (Privacy Badger, Ghostery, etc.)
- 🛡️ **Antivirus o Firewall** bloqueando Google APIs
- 🌐 **Configuraciones de red corporativa**

---

## ✅ Soluciones (Prueba en orden)

### 1️⃣ **Modo Incógnito / Privado**

La forma más rápida de verificar si es una extensión:

1. Abre una **ventana de incógnito** (Ctrl+Shift+N en Chrome/Edge)
2. Ve a `http://localhost:5174/admin/login`
3. Inicia sesión
4. Intenta crear un proyecto

**Si funciona en incógnito** → El problema son las extensiones del navegador

---

### 2️⃣ **Deshabilitar Extensiones Temporalmente**

#### En Chrome/Edge:
1. Haz clic en el ícono de extensiones (🧩) en la barra superior
2. Haz clic en "Gestionar extensiones"
3. **Desactiva temporalmente**:
   - uBlock Origin
   - AdBlock / AdBlock Plus
   - Privacy Badger
   - Ghostery
   - Cualquier extensión de privacidad/seguridad

#### En Firefox:
1. Menú → Complementos y temas
2. Extensiones
3. Desactiva las extensiones de bloqueo

#### En Brave:
1. Configuración → Shields
2. Desactiva "Shields" para `localhost`

---

### 3️⃣ **Agregar Firebase a Lista Blanca**

Si quieres mantener tus extensiones activas:

#### uBlock Origin:
1. Haz clic en el ícono de uBlock Origin
2. Haz clic en el botón de encendido para deshabilitar en este sitio
3. O agrega estas URLs a la lista blanca:
   ```
   @@||firebaseapp.com^
   @@||googleapis.com^
   @@||firestore.googleapis.com^
   ```

#### AdBlock Plus:
1. Haz clic en el ícono de AdBlock Plus
2. "Pausar en este sitio"

#### Privacy Badger:
1. Haz clic en el ícono de Privacy Badger
2. Desliza los controles de `firebaseapp.com` y `googleapis.com` a verde

---

### 4️⃣ **Verificar Consola del Navegador**

Abre las DevTools (F12) y revisa:

```javascript
// En la pestaña Console, busca errores como:
// "Blocked by client"
// "Blocked by adblocker"
// "Content Security Policy"

// En la pestaña Network:
// 1. Filtra por "firestore"
// 2. Busca peticiones en rojo
// 3. Haz clic en ellas para ver detalles
```

**Ejemplo de petición bloqueada**:
```
Request URL: https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/...
Status: (blocked:client)
```

---

### 5️⃣ **Verificar Firewall / Antivirus**

Algunos antivirus bloquean peticiones a Google APIs:

#### Windows Defender:
1. Configuración → Privacidad y seguridad → Seguridad de Windows
2. Firewall y protección de red
3. Permitir una aplicación a través del firewall
4. Agrega Chrome/Edge/Firefox

#### Kaspersky / Norton / McAfee:
1. Abre la configuración del antivirus
2. Busca "Control de red" o "Firewall"
3. Agrega `firestore.googleapis.com` a la lista de permitidos

---

### 6️⃣ **Verificar Configuración de Firebase**

Asegúrate de que tu `.env` está correctamente configurado:

```bash
# Abre el archivo .env y verifica:
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Reinicia el servidor después de cambiar .env**:
```bash
# Ctrl+C para detener
npm run dev
```

---

### 7️⃣ **Verificar Reglas de Firestore**

Ve a [Firebase Console](https://console.firebase.google.com/):

1. Selecciona tu proyecto
2. **Firestore Database** → **Reglas**
3. Pega estas reglas (para desarrollo):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Proyectos
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Experiencias
    match /experiences/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Habilidades
    match /skills/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

4. Haz clic en **"Publicar"**

---

### 8️⃣ **Probar con otro Navegador**

Prueba con un navegador diferente sin extensiones:

- ✅ Chrome (sin extensiones)
- ✅ Firefox (sin extensiones)
- ✅ Edge (sin extensiones)
- ✅ Brave (con Shields desactivado)

---

## 🎯 Resumen de Pasos Rápidos

```bash
1. Abre modo incógnito → Prueba crear proyecto
   ✅ Funciona → El problema son extensiones

2. Deshabilita ad blockers → Recarga página → Prueba de nuevo
   ✅ Funciona → Agrega Firebase a lista blanca

3. Verifica .env → Reinicia servidor → Prueba de nuevo
   ✅ Funciona → Configuración correcta

4. Verifica reglas de Firestore → Publica → Prueba de nuevo
   ✅ Funciona → Permisos correctos
```

---

## 🐛 Si Nada Funciona

Si después de probar todo sigue sin funcionar:

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña Network**
3. **Intenta crear un proyecto**
4. **Copia el error completo** que aparece
5. **Envíame el error** para ayudarte mejor

---

## ✅ Verificación Final

Una vez resuelto, deberías poder:

1. ✅ Crear proyectos nuevos
2. ✅ Editar proyectos existentes
3. ✅ Eliminar proyectos
4. ✅ Ver proyectos en la página principal
5. ✅ Lo mismo para experiencias y habilidades

**¡Sin errores en consola!** 🎉

---

## 📝 Notas Adicionales

### Dominios de Firebase que deben estar permitidos:
```
firebaseapp.com
googleapis.com
firestore.googleapis.com
firebase.googleapis.com
identitytoolkit.googleapis.com
```

### Si usas un proxy o VPN:
- Desactívalo temporalmente
- Firebase puede tener problemas con algunos proxies

### Si estás en una red corporativa:
- Contacta a IT para permitir acceso a Firebase
- Puede que necesites usar tu red personal/móvil

---

**Última actualización**: Diciembre 2025
