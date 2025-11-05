# Configuración de ElevenLabs TTS

## 🎯 Objetivo
Integrar ElevenLabs Text-to-Speech para síntesis de voz ultra-realista en español.

## 💰 Costos
- **10,000 caracteres GRATIS por mes** permanentemente
- **NO requiere tarjeta de crédito** para el plan gratuito
- Después: $5/mes por 30,000 caracteres adicionales
- Voces ultra-realistas con IA

## 📋 Pasos de Configuración

### 1. Crear cuenta en ElevenLabs

1. Ve a https://elevenlabs.io
2. Haz clic en **"Get Started Free"**
3. Regístrate con tu email o Google
4. ✅ **No necesitas tarjeta de crédito**

### 2. Obtener API Key

1. Una vez dentro, ve a: https://elevenlabs.io/app/settings/api-keys
2. O navega: Profile Icon → Settings → API Keys
3. Haz clic en **"Create API Key"**
4. Dale un nombre (ej: "Soroban TTS")
5. Copia la API key (guárdala en un lugar seguro)

### 3. Configurar API Key en tu proyecto

Edita `.env.local` y agrega tu API key:
```env
ELEVENLABS_API_KEY=tu_api_key_aqui
```

### 4. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## 🎵 Voces Disponibles

Por defecto usa **Sarah** (voz femenina cálida). Puedes cambiarla en `/src/app/api/elevenlabs-tts/route.ts`:

| Voice ID | Nombre | Descripción |
|----------|--------|-------------|
| `EXAVITQu4vr4xnSDxMaL` | **Sarah** | Femenina, cálida, amigable (PREDETERMINADA) |
| `pNInz6obpgDQGcFmaJgB` | **Adam** | Masculina, versátil, profesional |
| `VR6AewLTigWG4xSOukaG` | **Arnold** | Masculina, profunda, autoritaria |
| `ThT5KcBeYPX3keUQqHPh` | **Dorothy** | Femenina, clara, educativa |

### Ver todas las voces disponibles:
1. Ve a: https://elevenlabs.io/app/voice-library
2. Prueba diferentes voces
3. Copia el Voice ID que quieras usar

### Cambiar voz en el código:
```typescript
// En /src/app/api/elevenlabs-tts/route.ts línea 29
const audioStream = await elevenlabs.textToSpeech.convert('VOICE_ID_AQUI', {
  // ...
});
```

## 🎚️ Configuración Avanzada

### Ajustar calidad de voz

En `/src/app/api/elevenlabs-tts/route.ts`:

```typescript
voice_settings: {
  stability: 0.5,        // 0-1: Mayor = más consistente, Menor = más expresiva
  similarity_boost: 0.75, // 0-1: Mayor = más fiel a la voz original
  style: 0.0,            // 0-1: Exageración del estilo (experimental)
  use_speaker_boost: true, // Mejora la claridad
},
```

### Cambiar modelo

```typescript
model_id: 'eleven_multilingual_v2', // Mejor para español
// Opciones:
// - 'eleven_monolingual_v1' (solo inglés, más rápido)
// - 'eleven_multilingual_v1' (varios idiomas)
// - 'eleven_multilingual_v2' (mejor calidad español) ✅
// - 'eleven_turbo_v2' (más rápido, calidad menor)
```

## 🔧 Uso en tu Componente

Ya está integrado en `SmartAssistant.tsx`:

```typescript
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';

function MiComponente() {
  const { isSpeaking, speak, stopSpeaking, error } = useElevenLabsTTS();

  const handleSpeak = async () => {
    await speak('¡Hola! Esta es una prueba de ElevenLabs TTS');
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

1. Ve a: https://elevenlabs.io/app/usage
2. Verás:
   - Caracteres usados este mes
   - Caracteres restantes (10,000 gratis/mes)
   - Historial de uso

## ❓ Solución de Problemas

### Error: "ElevenLabs API key not configured"
✅ Verifica que:
1. Creaste el archivo `.env.local`
2. La API key está correcta (sin espacios)
3. Reiniciaste el servidor (`npm run dev`)

### Error: 401 Unauthorized
✅ Tu API key no es válida:
1. Verifica que copiaste la key completa
2. Crea una nueva key en elevenlabs.io/app/settings/api-keys

### Error: 429 Rate Limit (cuota excedida)
✅ Excediste los 10,000 caracteres gratuitos:
1. Espera hasta el próximo mes
2. O actualiza a plan paid ($5/mes por 30K chars)
3. Revisa tu uso en elevenlabs.io/app/usage

### Audio no se reproduce
✅ Verifica:
1. Configuración de audio del navegador
2. Permisos de reproducción automática
3. Consola del navegador para errores

## 🆚 Comparación con Otras Opciones

| Característica | ElevenLabs | OpenAI TTS | Web Speech API |
|----------------|------------|------------|----------------|
| **Calidad** | ⭐⭐⭐⭐⭐ Ultra | ⭐⭐⭐⭐ Alta | ⭐⭐⭐ Media |
| **Español** | ⭐⭐⭐⭐⭐ Excelente | ⭐⭐⭐⭐ Bueno | ⭐⭐⭐ Varía |
| **Gratis/mes** | 10,000 chars | $5 USD crédito | ∞ Ilimitado |
| **Requiere tarjeta** | ❌ No | ✅ Sí | ❌ No |
| **Realismo** | ⭐⭐⭐⭐⭐ Ultra | ⭐⭐⭐⭐ Muy bueno | ⭐⭐⭐ Aceptable |
| **Latencia** | ~1-2s | ~0.5-1s | Instantáneo |
| **Consistencia** | ✅ Perfecta | ✅ Perfecta | ⚠️ Varía |

## 📚 Recursos

- [Documentación oficial](https://docs.elevenlabs.io/)
- [Voice Library (explorar voces)](https://elevenlabs.io/app/voice-library)
- [Dashboard de uso](https://elevenlabs.io/app/usage)
- [API Reference](https://docs.elevenlabs.io/api-reference/text-to-speech)
- [Pricing](https://elevenlabs.io/pricing)

---

**¡Listo para usar!** Obtén tu API key gratuita y disfruta de voces ultra-realistas en tu dApp. 🎤✨
