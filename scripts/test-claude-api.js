// Script para testear la API interna de Claude
fetch('http://localhost:3000/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Hola Claude, ¿puedes responderme?' })
})
  .then(res => res.json())
  .then(data => {
    console.log('Respuesta de Claude:', data.text);
  })
  .catch(err => {
    console.error('Error al llamar a la API interna de Claude:', err);
  });
