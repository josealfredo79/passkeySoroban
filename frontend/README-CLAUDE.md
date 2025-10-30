# Guía rápida para conectar tu dapp con la API de Claude (Anthropic)

## 1. Consigue tu API key
- Ve a https://console.anthropic.com
- Inicia sesión con tu correo y acepta los términos de servicio.
- Copia tu API key (guárdala en lugar seguro).

## 2. Configura la variable de entorno
Crea (o edita) el archivo `.env.local` en la raíz del proyecto frontend:

```
CLAUDE_API_KEY=tu_clave_de_anthropic_aqui
```

> Cambia `tu_clave_de_anthropic_aqui` por tu clave real.

## 3. Reinicia el servidor de desarrollo
Para que Next.js lea la variable de entorno:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

## 4. Prueba la conexión a Claude
En otra terminal, ejecuta:

```bash
curl -v -X POST http://localhost:3000/api/claude \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hola Claude, ¿estás ahí?"}'
```

- Si todo está bien, recibirás una respuesta JSON con el texto generado por Claude.
- Si hay error, revisa la terminal donde corre Next.js: verás mensajes de error detallados.

## 5. Diagnóstico de errores comunes
- **"CLAUDE_API_KEY no configurada"**: la variable no está en `.env.local` o no reiniciaste el servidor.
- **Error 401/403**: la clave es inválida, fue rotada o no tiene permisos. Revisa en https://console.anthropic.com.
- **"Sin respuesta de Claude"**: la API respondió pero el formato cambió. Copia el JSON crudo del error y compártelo para soporte.

## 6. Producción (Vercel, etc.)
- Configura la variable `CLAUDE_API_KEY` en el panel de variables de entorno de tu plataforma (Vercel, Railway, etc.).
- Vuelve a desplegar para que la variable se aplique.

## 7. Seguridad
- Nunca subas tu API key a un repositorio público.
- No expongas la clave en el frontend; solo debe usarse en el backend (como ya está en `/api/claude`).

---

¿Dudas? Revisa los logs del servidor o comparte el error aquí para ayuda personalizada.
