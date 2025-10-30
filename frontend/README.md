# Integración Gemini (Google Gen AI SDK)

## Configuración de clave API

1. Obtén tu clave en https://aistudio.google.com/apikey
2. Crea o edita el archivo `.env.local` en la carpeta `frontend/` y agrega:

```
GEMINI_API_KEY=tu_clave_valida
```

## Prueba rápida de la API Gemini

1. Inicia el servidor de desarrollo:

```bash
cd frontend
npm run dev
```

2. Haz una petición POST a `/api/gemini`:

```bash
curl -X POST http://localhost:3000/api/gemini -H "Content-Type: application/json" -d '{"prompt":"¿Cuál es la capital de Francia?"}'
```

3. Si la clave es válida, recibirás una respuesta como:

```json
{"text":"La capital de Francia es París."}
```

Si recibes un error, revisa el campo `detail` en la respuesta (en modo desarrollo) para más información.

## Notas técnicas
- El endpoint usa el SDK oficial `@google/genai`.
- Si la clave es inválida, la respuesta será un error 400/401 de Google.
- Para producción, asegúrate de no exponer tu clave en el frontend.

## Recursos
- [Google Gen AI SDK (js-genai)](https://github.com/googleapis/js-genai)
- [Documentación Gemini API](https://ai.google.dev/gemini-api/docs)
