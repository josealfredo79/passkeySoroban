# Configuración de OpenAI TTS

## 🎯 Objetivo
Integrar OpenAI Text-to-Speech (TTS) para síntesis de voz de alta calidad sin depender del navegador.

## 💰 Costos
- **$5 USD de crédito gratuito** para nuevos usuarios
- Después: **$0.015 por 1,000 caracteres** (~€0.014/1K chars)
- Tu crédito gratuito te da aproximadamente: **333,000 caracteres**

## 📋 Pasos de Configuración

### 1. Obtener API Key de OpenAI

1. Ve a https://platform.openai.com/signup
2. Crea una cuenta (o inicia sesión si ya tienes una)
3. Ve a https://platform.openai.com/api-keys
4. Haz clic en **"Create new secret key"**
5. Dale un nombre (ej: "Soroban TTS")
6. Copia la API key (empieza con `sk-proj-...`)
   ⚠️ **IMPORTANTE**: Guarda esta key, no podrás verla de nuevo

### 2. Configurar API Key en tu proyecto

1. Crea un archivo `.env.local` en la raíz del proyecto:
   ```bash
   cd /home/josealfredo/soroban-passkey-demo/frontend
   cp .env.local.example .env.local
   ```

2. Edita `.env.local` y agrega tu API key:
   ```env
   OPENAI_API_KEY=sk-proj-TU_API_KEY_AQUI
   ```

3. ⚠️ **Seguridad**: NUNCA compartas tu API key ni la subas a GitHub
   - El archivo `.env.local` ya está en `.gitignore`
   - Nunca expongas la key en el código del frontend

### 3. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## 🎵 Voces Disponibles

OpenAI ofrece 6 voces diferentes:

| Voz | Descripción |
|-----|-------------|
| **alloy** | Neutral, balanceada |
| **echo** | Masculina, clara |
| **fable** | Británica, expresiva |
| **onyx** | Masculina, profunda |
| **nova** | Femenina, amigable (RECOMENDADA para español) |
| **shimmer** | Femenina, suave |

Puedes cambiar la voz en `/src/app/api/tts/route.ts`:
```typescript
voice: 'nova', // Cambia aquí la voz
```

## 🎚️ Configuración Avanzada

### Cambiar modelo (calidad)
```typescript
model: 'tts-1', // Estándar (más rápido)
model: 'tts-1-hd', // Alta definición (más lento, mejor calidad)
```

### Ajustar velocidad
```typescript
speed: 1.0, // Rango: 0.25 a 4.0
```

## 🔧 Uso en tu Componente

```typescript
import { useOpenAITTS } from '@/hooks/useOpenAITTS';

function MiComponente() {
  const { isSpeaking, speak, stopSpeaking, error } = useOpenAITTS();

  const handleSpeak = async () => {
    await speak('Hola, esto es una prueba de OpenAI TTS');
  };

  return (
    <div>
      <button onClick={handleSpeak} disabled={isSpeaking}>
        {isSpeaking ? 'Hablando...' : 'Hablar'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

## 📊 Monitorear Uso

1. Ve a https://platform.openai.com/usage
2. Podrás ver:
   - Créditos restantes
   - Uso diario
   - Historial de requests

## ❓ Solución de Problemas

### Error: "OpenAI API key not configured"
✅ Verifica que:
1. Creaste el archivo `.env.local`
2. La API key está correcta
3. Reiniciaste el servidor (`npm run dev`)

### Error: 401 Unauthorized
✅ Tu API key no es válida:
1. Verifica que copiaste la key completa
2. Crea una nueva key en platform.openai.com

### Error: 429 Rate Limit
✅ Excediste el límite de requests:
1. Espera un momento
2. Revisa tu uso en platform.openai.com/usage
3. Considera upgrade si necesitas más

### Audio no se reproduce
✅ Verifica:
1. Configuración de audio del navegador
2. Permisos de reproducción automática
3. Consola del navegador para errores

## 🆚 Ventajas vs Web Speech API

| Característica | OpenAI TTS | Web Speech API |
|----------------|------------|----------------|
| **Calidad** | ⭐⭐⭐⭐⭐ Alta | ⭐⭐⭐ Media |
| **Consistencia** | ✅ Igual en todos los navegadores | ❌ Varía por navegador |
| **Configuración** | ⚠️ Requiere API key | ✅ Sin configuración |
| **Offline** | ❌ Requiere internet | ⚠️ Varía por navegador |
| **Costo** | 💰 $5 gratis, luego $0.015/1K | 🆓 Totalmente gratis |
| **Latencia** | ⚠️ ~500ms-1s | ✅ Instantáneo |
| **Idiomas** | ✅ Excelente español | ⚠️ Depende del navegador |

## 📚 Recursos

- [Documentación oficial OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech)
- [Pricing de OpenAI](https://openai.com/pricing)
- [Dashboard de uso](https://platform.openai.com/usage)
- [Ejemplos de voces](https://platform.openai.com/docs/guides/text-to-speech/voice-options)

---

**¿Necesitas ayuda?** Revisa los logs en la terminal o la consola del navegador para más detalles de los errores.
