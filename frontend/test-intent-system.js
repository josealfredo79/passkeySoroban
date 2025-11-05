// Script de prueba para el sistema de detección de intenciones
const { detectIntent, getSuggestionsForIntent, getIntentDescription } = require('./src/lib/intent-detection.ts');

console.log('🧪 PRUEBAS DEL SISTEMA DE DETECCIÓN DE INTENCIONES\n');
console.log('='.repeat(60));

// Array de casos de prueba
const testCases = [
  "quiero registrarme",
  "deseo registrarme",
  "registrame",
  "crear cuenta",
  "iniciar sesión",
  "login",
  "quiero un préstamo",
  "necesito un préstamo de 1000 XLM",
  "solicitar préstamo de 500 USDC",
  "cuánto tengo en mi cuenta",
  "consultar saldo",
  "ver mi dashboard",
  "hola",
  "ayuda",
  "qué puedo hacer",
  "adios",
  "algo random que no existe"
];

console.log('\n📝 CASOS DE PRUEBA:\n');

testCases.forEach((input, index) => {
  console.log(`\n${index + 1}. Input: "${input}"`);
  console.log('-'.repeat(60));
  
  try {
    const intent = detectIntent(input);
    
    console.log(`   ✓ Tipo: ${intent.type}`);
    console.log(`   ✓ Confianza: ${intent.confidence}`);
    console.log(`   ✓ Descripción: ${getIntentDescription(intent.type)}`);
    
    if (Object.keys(intent.entities).length > 0) {
      console.log(`   ✓ Entidades detectadas:`, JSON.stringify(intent.entities, null, 2));
    }
    
    if (intent.matchedPatterns.length > 0) {
      console.log(`   ✓ Patrones coincidentes: ${intent.matchedPatterns.slice(0, 3).join(', ')}...`);
    }
    
    const suggestions = getSuggestionsForIntent(intent.type, false);
    console.log(`   ✓ Sugerencias: ${suggestions.slice(0, 3).join(', ')}...`);
    
  } catch (error) {
    console.log(`   ✗ Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ PRUEBAS COMPLETADAS\n');
