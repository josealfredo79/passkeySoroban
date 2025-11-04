/**
 * Sistema de Detección de Intenciones (Intent Detection System)
 * Maneja el procesamiento de lenguaje natural para identificar
 * las intenciones del usuario y extraer entidades relevantes.
 */

export interface Intent {
  type: IntentType;
  confidence: 'low' | 'medium' | 'high';
  entities: Record<string, any>;
  rawInput: string;
  matchedPatterns: string[];
}

export type IntentType =
  | 'register'
  | 'login'
  | 'request_loan'
  | 'check_balance'
  | 'view_dashboard'
  | 'help'
  | 'greeting'
  | 'goodbye'
  | 'unknown';

/**
 * Patrones de intenciones con sinónimos y variaciones
 */
const INTENT_PATTERNS: Record<IntentType, string[]> = {
  register: [
    'registr',
    'registrarme',
    'registro',
    'crear cuenta',
    'nueva cuenta',
    'sign up',
    'signup',
    'crear passkey',
    'configurar passkey',
    'quiero registrarme',
    'deseo registrarme',
    'me registro',
    'registrame',
    'regístrame',
    'alta',
    'darme de alta',
    'crear usuario',
    'nuevo usuario',
    'abrir cuenta',
  ],
  login: [
    'login',
    'iniciar sesión',
    'iniciar sesion',
    'entrar',
    'acceder',
    'autenticar',
    'autenticación',
    'autenticacion',
    'biométrica',
    'biometrica',
    'huella',
    'passkey',
    'ingresar',
    'log in',
    'sign in',
    'signin',
    'loguear',
    'logear',
  ],
  request_loan: [
    'préstamo',
    'prestamo',
    'solicitar préstamo',
    'solicitar prestamo',
    'pedir préstamo',
    'pedir prestamo',
    'crédito',
    'credito',
    'financiamiento',
    'financiación',
    'loan',
    'quiero un préstamo',
    'necesito dinero',
    'solicitud',
    'aplicar préstamo',
    'pedir dinero',
  ],
  check_balance: [
    'saldo',
    'balance',
    'cuánto tengo',
    'cuanto tengo',
    'mi saldo',
    'consultar saldo',
    'ver saldo',
    'balance',
    'fondos',
    'dinero',
    'cuenta',
  ],
  view_dashboard: [
    'dashboard',
    'panel',
    'inicio',
    'home',
    'principal',
    'mi cuenta',
    'mi panel',
    'ver panel',
    'tablero',
  ],
  help: [
    'ayuda',
    'help',
    'ayúdame',
    'ayudame',
    'no entiendo',
    'qué puedo hacer',
    'que puedo hacer',
    'opciones',
    'comandos',
    'información',
    'informacion',
    'soporte',
    'asistencia',
  ],
  greeting: [
    'hola',
    'buenas',
    'buenos días',
    'buenos dias',
    'buenas tardes',
    'buenas noches',
    'hey',
    'hi',
    'hello',
    'saludos',
    'qué tal',
    'que tal',
  ],
  goodbye: [
    'adiós',
    'adios',
    'chau',
    'chao',
    'hasta luego',
    'nos vemos',
    'bye',
    'goodbye',
    'salir',
    'cerrar',
  ],
  unknown: [],
};

/**
 * Palabras clave para extracción de entidades
 */
const ENTITY_PATTERNS = {
  amount: /(\d+(?:\.\d+)?)\s*(xlm|usdc|lumens|dólares|dolares|pesos)?/i,
  username: /@?([a-zA-Z0-9_-]+)/,
  currency: /(xlm|usdc|lumens|stellar)/i,
};

/**
 * Detecta la intención principal del usuario
 */
export function detectIntent(input: string): Intent {
  const normalizedInput = input.toLowerCase().trim();
  const detectedIntents: { type: IntentType; matches: number; patterns: string[] }[] = [];

  // Buscar coincidencias para cada tipo de intención
  for (const [intentType, patterns] of Object.entries(INTENT_PATTERNS)) {
    const matches: string[] = [];
    let matchCount = 0;

    for (const pattern of patterns) {
      if (normalizedInput.includes(pattern.toLowerCase())) {
        matches.push(pattern);
        matchCount++;
      }
    }

    if (matchCount > 0) {
      detectedIntents.push({
        type: intentType as IntentType,
        matches: matchCount,
        patterns: matches,
      });
    }
  }

  // Ordenar por número de coincidencias
  detectedIntents.sort((a, b) => b.matches - a.matches);

  // Si no hay coincidencias, es unknown
  if (detectedIntents.length === 0) {
    return {
      type: 'unknown',
      confidence: 'low',
      entities: {},
      rawInput: input,
      matchedPatterns: [],
    };
  }

  // Tomar la intención con más coincidencias
  const topIntent = detectedIntents[0];

  // Calcular confianza basada en matches y longitud del input
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (topIntent.matches >= 3 || (topIntent.matches >= 2 && normalizedInput.split(' ').length <= 4)) {
    confidence = 'high';
  } else if (topIntent.matches >= 2 || normalizedInput.split(' ').length <= 3) {
    confidence = 'medium';
  }

  // Extraer entidades
  const entities = extractEntities(input, topIntent.type);

  return {
    type: topIntent.type,
    confidence,
    entities,
    rawInput: input,
    matchedPatterns: topIntent.patterns,
  };
}

/**
 * Extrae entidades específicas del input basado en el tipo de intención
 */
function extractEntities(input: string, intentType: IntentType): Record<string, any> {
  const entities: Record<string, any> = {};

  // Extraer cantidad y moneda (útil para préstamos y saldos)
  if (intentType === 'request_loan' || intentType === 'check_balance') {
    const amountMatch = input.match(ENTITY_PATTERNS.amount);
    if (amountMatch) {
      entities.amount = parseFloat(amountMatch[1]);
      if (amountMatch[2]) {
        entities.currency = amountMatch[2].toLowerCase();
      }
    }
  }

  // Extraer nombre de usuario (útil para registro/login)
  if (intentType === 'register' || intentType === 'login') {
    const usernameMatch = input.match(ENTITY_PATTERNS.username);
    if (usernameMatch) {
      // Evitar capturar palabras comunes como "me", "mi", etc.
      const username = usernameMatch[1];
      if (username.length > 2 && !['me', 'mi', 'el', 'la', 'un'].includes(username.toLowerCase())) {
        entities.username = username;
      }
    }
  }

  return entities;
}

/**
 * Genera sugerencias de respuesta basadas en la intención
 */
export function getSuggestionsForIntent(intentType: IntentType, isAuthenticated: boolean): string[] {
  const suggestions: Record<IntentType, string[]> = {
    register: isAuthenticated
      ? ['Ver mi dashboard', '¿Cómo solicitar un préstamo?']
      : ['Continuar con registro', '¿Qué es un Passkey?', 'Ya tengo cuenta'],
    login: isAuthenticated
      ? ['Ir al dashboard', 'Solicitar préstamo']
      : ['Iniciar sesión ahora', '¿Olvidaste tu Passkey?', 'Crear cuenta nueva'],
    request_loan: isAuthenticated
      ? ['Ver opciones de préstamo', 'Consultar mi saldo', 'Ver historial']
      : ['Primero regístrate', 'Iniciar sesión'],
    check_balance: isAuthenticated
      ? ['Ver detalles', 'Solicitar préstamo', 'Ver historial']
      : ['Iniciar sesión', 'Registrarme'],
    view_dashboard: isAuthenticated
      ? ['Solicitar préstamo', 'Ver saldo', 'Configuración']
      : ['Iniciar sesión', 'Crear cuenta'],
    help: [
      'Registrarme',
      'Iniciar sesión',
      'Solicitar préstamo',
      '¿Qué es un Passkey?',
    ],
    greeting: isAuthenticated
      ? ['Ver mi dashboard', 'Solicitar préstamo', 'Consultar saldo']
      : ['Registrarme', 'Iniciar sesión', '¿Cómo funciona?'],
    goodbye: ['Volver', 'Cerrar sesión'],
    unknown: [
      'Registrarme',
      'Iniciar sesión',
      'Solicitar préstamo',
      'Ayuda',
    ],
  };

  return suggestions[intentType] || suggestions.unknown;
}

/**
 * Valida si una intención requiere autenticación
 */
export function requiresAuthentication(intentType: IntentType): boolean {
  return ['request_loan', 'check_balance', 'view_dashboard'].includes(intentType);
}

/**
 * Obtiene una respuesta amigable para explicar la intención detectada
 */
export function getIntentDescription(intentType: IntentType): string {
  const descriptions: Record<IntentType, string> = {
    register: 'Quieres crear una nueva cuenta con Passkey',
    login: 'Quieres iniciar sesión con tu autenticación biométrica',
    request_loan: 'Quieres solicitar un préstamo',
    check_balance: 'Quieres consultar tu saldo',
    view_dashboard: 'Quieres ver tu panel de control',
    help: 'Necesitas ayuda',
    greeting: 'Saludos',
    goodbye: 'Despedida',
    unknown: 'No estoy seguro de qué necesitas',
  };

  return descriptions[intentType];
}
