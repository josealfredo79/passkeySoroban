# 🔴 ERROR: "Idioma es-ES no soportado"

## 📸 Problema Observado en la Captura

En la imagen se ve:
```
⚠️ Idioma es-ES no soportado. Intenta con español (es-ES).
```

## 🔍 Diagnóstico

Este error indica que **tu navegador NO soporta reconocimiento de voz en español**.

### Causas Posibles:

1. **Estás usando Firefox** ❌
   - Firefox tiene soporte **MUY LIMITADO** para Web Speech API
   - No soporta reconocimiento de voz en español
   - Solo funciona en inglés (en-US) y en algunos casos

2. **Navegador desactualizado** ⚠️
   - Chrome < 25, Edge < 79, Safari < 14.1

3. **Sistema operativo sin paquetes de idioma** 🌐
   - Windows sin pack de español instalado
   - Linux sin configuración regional correcta

## ✅ SOLUCIÓN INMEDIATA

### Opción 1: Cambiar a Chrome (RECOMENDADO)
```bash
# Si no tienes Chrome instalado:
# 1. Descarga desde: https://www.google.com/chrome/
# 2. Instala
# 3. Abre la dApp en Chrome
# 4. El micrófono funcionará perfectamente
```

### Opción 2: Usar Microsoft Edge
```bash
# Edge viene preinstalado en Windows 10/11
# 1. Busca "Microsoft Edge" en el menú inicio
# 2. Abre: http://localhost:3000
# 3. Edge tiene EXCELENTE soporte de voz
```

### Opción 3: Safari (solo macOS/iOS)
```bash
# Safari tiene reconocimiento local integrado
# 1. Abre Safari
# 2. Ve a: http://localhost:3000
# 3. Permite permisos de micrófono
```

## 🧪 Cómo Verificar tu Navegador

### 1. Detectar qué navegador estás usando
```javascript
// Abre la consola del navegador (F12)
console.log(navigator.userAgent);

// Si ves "Firefox" → ❌ No funcionará en español
// Si ves "Chrome" → ✅ Funcionará
// Si ves "Edg" → ✅ Funcionará (Edge)
// Si ves "Safari" → ✅ Funcionará
```

### 2. Probar soporte de Web Speech API
```javascript
// En la consola (F12)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  console.log('✅ API disponible');
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'es-ES';
  console.log('Idioma configurado:', recognition.lang);
} else {
  console.log('❌ API NO disponible');
}
```

## 📊 Compatibilidad de Navegadores con Voz en Español

| Navegador | Reconocimiento Español | Síntesis Español | Funciona Offline |
|-----------|----------------------|------------------|------------------|
| **Chrome 25+** | ✅ Excelente | ✅ Excelente | ⚠️ Requiere Chrome 130+ |
| **Edge 79+** | ✅ Excelente | ✅ Excelente | ✅ Sí |
| **Safari 14.1+** | ✅ Bueno | ✅ Excelente | ✅ Sí |
| **Firefox** | ❌ **NO funciona** | ⚠️ Limitado | ❌ No |
| **Opera** | ✅ Bueno (usa Chromium) | ✅ Bueno | ⚠️ Limitado |
| **Brave** | ✅ Bueno (usa Chromium) | ✅ Bueno | ⚠️ Limitado |

## 🔧 Soluciones Alternativas (Si no puedes cambiar de navegador)

### Para Firefox:
```javascript
// Firefox NO soporta voz en español
// SOLUCIÓN: Usar solo el input de texto
// El asistente funcionará igual, solo sin micrófono
```

### Para Chrome sin internet:
```bash
# Habilitar reconocimiento local (Chrome 130+)
1. Ir a: chrome://flags/#enable-experimental-web-platform-features
2. Cambiar a "Enabled"
3. Reiniciar Chrome
4. Chrome descargará paquetes de idioma automáticamente
```

### Para Edge (mejor opción):
```bash
# Edge tiene el MEJOR soporte de reconocimiento local
1. Abrir Edge
2. Ir a: edge://flags/#enable-experimental-web-platform-features  
3. Habilitar
4. Reiniciar
5. ¡Funciona offline con excelente calidad!
```

## 🎯 Qué Hacer AHORA

### Paso 1: Verificar tu navegador actual
```bash
# Presiona F12 para abrir DevTools
# Ve a la pestaña "Console"
# Escribe:
navigator.userAgent

# Lee el resultado:
# - Si dice "Firefox" → Cambia a Chrome/Edge
# - Si dice "Chrome" → Verifica que sea versión 25+
# - Si dice "Edg" → ¡Perfecto! Ya estás en Edge
```

### Paso 2: Si estás en Firefox
```bash
# ❌ Firefox NO funcionará con voz en español
# ✅ SOLUCIÓN: Usa Chrome o Edge

# Descarga Chrome:
# https://www.google.com/chrome/

# O usa Edge (ya viene con Windows):
# Busca "Microsoft Edge" en el menú inicio
```

### Paso 3: Si estás en Chrome y no funciona
```bash
# 1. Verifica la versión de Chrome
chrome://version

# 2. Si es < 25, actualiza:
# Chrome → Menú (⋮) → Ayuda → Acerca de Google Chrome

# 3. Verifica permisos de micrófono:
chrome://settings/content/microphone

# 4. Asegura que localhost:3000 tenga permiso
```

### Paso 4: Probar nuevamente
```bash
# 1. Recarga la página: Ctrl + F5
# 2. Click en el botón 🎤
# 3. Permite el permiso cuando se solicite
# 4. Habla claramente: "Hola", "Registrarme"
# 5. Deberías ver el texto aparecer en tiempo real
```

## 📝 Logs Útiles para Debug

### Abrir Consola (F12) y buscar:
```
✅ Mensajes de éxito:
✅ On-device speech recognition enabled
🎤 Speech Recognition initialized with language: es-ES
📍 Browser: Chrome/Edge
🎤 Recording started...
Available voices: [Google español (es-ES), ...]

❌ Mensajes de error:
❌ language-not-supported
⚠️ On-device recognition not available
📍 Browser: Firefox
```

## 🆘 Si NADA Funciona

### Checklist Final:
- [ ] ¿Estás usando Chrome, Edge o Safari?
- [ ] ¿Tu navegador está actualizado?
- [ ] ¿Tienes internet activo? (Chrome requiere internet por defecto)
- [ ] ¿Tu micrófono funciona en otras apps? (prueba con Zoom, Discord, etc.)
- [ ] ¿Permitiste el permiso de micrófono en el navegador?
- [ ] ¿Intentaste en modo incógnito? (para descartar extensiones)

### Última Opción:
```bash
# Si definitivamente no funciona el micrófono:
# ✅ Usa el INPUT DE TEXTO
# El asistente funciona igual de bien escribiendo
# Solo perderás la comodidad de hablar
```

## 💡 Recomendación Final

**La mejor experiencia de voz en español es con:**

🥇 **Microsoft Edge** (Windows/macOS/Linux)
- ✅ Reconocimiento local excelente
- ✅ Funciona offline
- ✅ Síntesis de voz de alta calidad
- ✅ Ya viene preinstalado en Windows

🥈 **Google Chrome** (Windows/macOS/Linux)
- ✅ Excelente reconocimiento
- ✅ Gran soporte
- ⚠️ Requiere internet (por defecto)
- ✅ Mejores voces de síntesis

🥉 **Safari** (solo macOS/iOS)
- ✅ Reconocimiento local integrado
- ✅ Privacidad máxima
- ✅ Funciona offline
- ⚠️ Solo en dispositivos Apple

❌ **NO usar Firefox** para funcionalidades de voz en español

---

## 📞 Siguiente Paso

1. **Abre Chrome o Edge**
2. **Ve a:** http://localhost:3000
3. **Click en el botón morado 🎤**
4. **Di: "Hola"**
5. **¡Debería funcionar!** ✅

**Si sigues teniendo problemas, comparte:**
- Navegador + versión (de chrome://version)
- Sistema operativo
- El mensaje de error exacto de la consola (F12)

---

**Última actualización:** Noviembre 4, 2025  
**Versión:** 1.0  
**Estado:** Problema identificado - Usar Chrome/Edge en lugar de Firefox
