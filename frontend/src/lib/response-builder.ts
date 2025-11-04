/**
 * Sistema de Construcción de Respuestas (Response Builder)
 * Genera respuestas estructuradas con texto, botones y acciones
 */

import { Intent, IntentType, getSuggestionsForIntent, requiresAuthentication } from './intent-detection';

export interface AssistantResponse {
  text: string;
  quickReplies?: QuickReply[];
  action?: AssistantAction;
  suggestions?: string[];
  confidence: 'low' | 'medium' | 'high';
  needsConfirmation?: boolean;
}

export interface QuickReply {
  label: string;
  value: string;
  icon?: string;
}

export interface AssistantAction {
  type: 'navigate' | 'execute' | 'confirm' | 'biometric_auth';
  target?: string;
  params?: Record<string, any>;
  description?: string;
}

/**
 * Construye una respuesta basada en la intención detectada
 */
export function buildResponse(
  intent: Intent,
  isAuthenticated: boolean,
  currentPath: string
): AssistantResponse {
  const { type, confidence, entities } = intent;

  // Si requiere autenticación y no está autenticado
  if (requiresAuthentication(type) && !isAuthenticated) {
    return buildAuthRequiredResponse(type);
  }

  // Construir respuesta específica por tipo de intención
  switch (type) {
    case 'register':
      return buildRegisterResponse(isAuthenticated, currentPath, entities);
    case 'login':
      return buildLoginResponse(isAuthenticated, currentPath);
    case 'request_loan':
      return buildLoanResponse(isAuthenticated, entities);
    case 'check_balance':
      return buildBalanceResponse();
    case 'view_dashboard':
      return buildDashboardResponse(currentPath);
    case 'help':
      return buildHelpResponse(isAuthenticated);
    case 'greeting':
      return buildGreetingResponse(isAuthenticated);
    case 'goodbye':
      return buildGoodbyeResponse();
    case 'unknown':
    default:
      return buildUnknownResponse(intent.rawInput);
  }
}

/**
 * Respuesta cuando se requiere autenticación
 */
function buildAuthRequiredResponse(intentType: IntentType): AssistantResponse {
  const actions: Record<string, string> = {
    request_loan: 'solicitar un préstamo',
    check_balance: 'consultar tu saldo',
    view_dashboard: 'acceder al dashboard',
  };

  return {
    text: `Para ${actions[intentType] || 'realizar esta acción'} necesitas iniciar sesión primero. ¿Deseas autenticarte con tu Passkey biométrico?`,
    confidence: 'high',
    quickReplies: [
      { label: '🔐 Iniciar sesión', value: 'iniciar sesión', icon: '🔐' },
      { label: '📝 Registrarme', value: 'registrarme', icon: '📝' },
      { label: '❓ Más información', value: 'ayuda', icon: '❓' },
    ],
    action: {
      type: 'navigate',
      target: '/login',
      description: 'Redirigir a login',
    },
    needsConfirmation: true,
  };
}

/**
 * Respuesta para intención de registro
 */
function buildRegisterResponse(
  isAuthenticated: boolean,
  currentPath: string,
  entities: Record<string, any>
): AssistantResponse {
  if (isAuthenticated) {
    return {
      text: '¡Ya tienes una sesión activa! ¿Deseas ir a tu dashboard o cerrar sesión para crear otra cuenta?',
      confidence: 'high',
      quickReplies: [
        { label: '📊 Ir al Dashboard', value: 'ver dashboard', icon: '📊' },
        { label: '🚪 Cerrar sesión', value: 'cerrar sesión', icon: '🚪' },
      ],
      action: {
        type: 'navigate',
        target: '/dashboard',
      },
    };
  }

  if (currentPath === '/register') {
    return {
      text: '¡Perfecto! Estás en la pantalla de registro. Para crear tu cuenta:\n\n1️⃣ Escribe tu nombre de usuario\n2️⃣ Pulsa "Crear Passkey"\n3️⃣ Usa tu huella digital o Face ID\n\n✨ ¡Es rápido y seguro!',
      confidence: 'high',
      quickReplies: [
        { label: '❓ ¿Qué es un Passkey?', value: '¿qué es un passkey?', icon: '❓' },
        { label: '🔐 Ya tengo cuenta', value: 'iniciar sesión', icon: '🔐' },
      ],
      suggestions: getSuggestionsForIntent('register', false),
    };
  }

  return {
    text: '¡Excelente elección! El registro es simple y seguro:\n\n📝 **Paso 1:** Elige tu nombre de usuario\n🔐 **Paso 2:** Crea tu Passkey biométrico\n\n¿Listo para comenzar?',
    confidence: 'high',
    quickReplies: [
      { label: '✅ Registrarme ahora', value: 'continuar registro', icon: '✅' },
      { label: '❓ ¿Qué es un Passkey?', value: '¿qué es un passkey?', icon: '❓' },
      { label: '🔐 Ya tengo cuenta', value: 'iniciar sesión', icon: '🔐' },
    ],
    action: {
      type: 'navigate',
      target: '/register',
      description: 'Ir a la pantalla de registro',
    },
    suggestions: getSuggestionsForIntent('register', false),
  };
}

/**
 * Respuesta para intención de login
 */
function buildLoginResponse(isAuthenticated: boolean, currentPath: string): AssistantResponse {
  if (isAuthenticated) {
    return {
      text: '¡Ya estás autenticado! ¿Qué deseas hacer?',
      confidence: 'high',
      quickReplies: [
        { label: '📊 Ver Dashboard', value: 'ver dashboard', icon: '📊' },
        { label: '💰 Solicitar préstamo', value: 'solicitar préstamo', icon: '💰' },
        { label: '💳 Consultar saldo', value: 'consultar saldo', icon: '💳' },
      ],
      action: {
        type: 'navigate',
        target: '/dashboard',
      },
    };
  }

  if (currentPath === '/register') {
    return {
      text: 'Estás en la pantalla de registro. Si ya tienes Passkey, pulsa el botón "Autenticar" para iniciar sesión.',
      confidence: 'high',
      quickReplies: [
        { label: '🔐 Autenticar ahora', value: 'autenticar', icon: '🔐' },
        { label: '❓ Ayuda', value: 'ayuda', icon: '❓' },
      ],
    };
  }

  return {
    text: '¡Perfecto! Voy a iniciar tu autenticación biométrica con Passkey. Prepara tu huella digital o Face ID.',
    confidence: 'high',
    quickReplies: [
      { label: '🔐 Continuar', value: 'continuar autenticación', icon: '🔐' },
      { label: '📝 No tengo cuenta', value: 'registrarme', icon: '📝' },
    ],
    action: {
      type: 'biometric_auth',
      description: 'Iniciar autenticación biométrica',
    },
    needsConfirmation: false,
  };
}

/**
 * Respuesta para solicitud de préstamo
 */
function buildLoanResponse(isAuthenticated: boolean, entities: Record<string, any>): AssistantResponse {
  const amount = entities.amount;
  const currency = entities.currency || 'XLM';

  let text = '¡Perfecto! Puedo ayudarte a solicitar un préstamo.';
  
  if (amount) {
    text += ` Vi que mencionaste ${amount} ${currency.toUpperCase()}. `;
  }
  
  text += '\n\nPara continuar, te llevaré a la pantalla de solicitud de préstamos donde podrás:\n\n💰 Elegir el monto\n📅 Seleccionar el plazo\n📊 Ver tu score crediticio';

  return {
    text,
    confidence: 'high',
    quickReplies: [
      { label: '✅ Solicitar préstamo', value: 'continuar préstamo', icon: '✅' },
      { label: '📊 Ver mi score', value: 'ver score', icon: '📊' },
      { label: '❓ Más información', value: 'ayuda préstamos', icon: '❓' },
    ],
    action: {
      type: 'navigate',
      target: '/ebas-credit',
      params: amount ? { amount, currency } : undefined,
      description: 'Ir a solicitud de préstamo',
    },
    suggestions: ['Ver condiciones', 'Consultar tasas', 'Calcular cuotas'],
  };
}

/**
 * Respuesta para consulta de saldo
 */
function buildBalanceResponse(): AssistantResponse {
  return {
    text: '¡Claro! Te muestro tu información financiera:\n\n💳 **Saldo disponible**\n📊 **Historial de transacciones**\n💰 **Préstamos activos**',
    confidence: 'high',
    quickReplies: [
      { label: '📊 Ver dashboard', value: 'ver dashboard', icon: '📊' },
      { label: '💰 Solicitar préstamo', value: 'solicitar préstamo', icon: '💰' },
    ],
    action: {
      type: 'navigate',
      target: '/dashboard',
      description: 'Ver dashboard completo',
    },
  };
}

/**
 * Respuesta para ver dashboard
 */
function buildDashboardResponse(currentPath: string): AssistantResponse {
  if (currentPath === '/dashboard') {
    return {
      text: '¡Ya estás en tu dashboard! Aquí puedes ver toda tu información financiera.',
      confidence: 'high',
      quickReplies: [
        { label: '💰 Solicitar préstamo', value: 'solicitar préstamo', icon: '💰' },
        { label: '💳 Ver saldo', value: 'consultar saldo', icon: '💳' },
      ],
    };
  }

  return {
    text: 'Te llevo a tu panel de control donde puedes ver toda tu información.',
    confidence: 'high',
    action: {
      type: 'navigate',
      target: '/dashboard',
      description: 'Ir al dashboard',
    },
  };
}

/**
 * Respuesta de ayuda
 */
function buildHelpResponse(isAuthenticated: boolean): AssistantResponse {
  const text = isAuthenticated
    ? '¡Estoy aquí para ayudarte! Puedo asistirte con:\n\n💰 Solicitar préstamos\n💳 Consultar tu saldo\n📊 Ver tu dashboard\n🔐 Cerrar sesión\n\n¿Qué necesitas?'
    : '¡Hola! Soy tu asistente virtual. Puedo ayudarte con:\n\n📝 Crear tu cuenta con Passkey\n🔐 Iniciar sesión con biometría\n💰 Solicitar préstamos (requiere cuenta)\n❓ Información sobre la plataforma\n\n¿Qué te gustaría hacer?';

  return {
    text,
    confidence: 'high',
    quickReplies: isAuthenticated
      ? [
          { label: '💰 Solicitar préstamo', value: 'solicitar préstamo', icon: '💰' },
          { label: '📊 Ver dashboard', value: 'ver dashboard', icon: '📊' },
          { label: '💳 Ver saldo', value: 'consultar saldo', icon: '💳' },
        ]
      : [
          { label: '📝 Registrarme', value: 'registrarme', icon: '📝' },
          { label: '🔐 Iniciar sesión', value: 'iniciar sesión', icon: '🔐' },
          { label: '❓ ¿Qué es Passkey?', value: '¿qué es passkey?', icon: '❓' },
        ],
    suggestions: getSuggestionsForIntent('help', isAuthenticated),
  };
}

/**
 * Respuesta de saludo
 */
function buildGreetingResponse(isAuthenticated: boolean): AssistantResponse {
  const text = isAuthenticated
    ? '¡Hola! ¿En qué puedo ayudarte hoy?'
    : '¡Hola! 👋 Bienvenido a la plataforma de préstamos con autenticación biométrica.\n\n¿Eres nuevo o ya tienes cuenta?';

  return {
    text,
    confidence: 'high',
    quickReplies: isAuthenticated
      ? [
          { label: '💰 Solicitar préstamo', value: 'solicitar préstamo', icon: '💰' },
          { label: '📊 Ver dashboard', value: 'ver dashboard', icon: '📊' },
        ]
      : [
          { label: '📝 Soy nuevo', value: 'registrarme', icon: '📝' },
          { label: '🔐 Ya tengo cuenta', value: 'iniciar sesión', icon: '🔐' },
          { label: '❓ Más información', value: 'ayuda', icon: '❓' },
        ],
    suggestions: getSuggestionsForIntent('greeting', isAuthenticated),
  };
}

/**
 * Respuesta de despedida
 */
function buildGoodbyeResponse(): AssistantResponse {
  return {
    text: '¡Hasta pronto! 👋 Si necesitas algo más, estaré aquí para ayudarte.',
    confidence: 'high',
    quickReplies: [
      { label: '🔄 Continuar', value: 'ayuda', icon: '🔄' },
    ],
  };
}

/**
 * Respuesta para intención desconocida
 */
function buildUnknownResponse(rawInput: string): AssistantResponse {
  return {
    text: `No estoy seguro de entender "${rawInput}". ¿Podrías ser más específico?\n\nPuedo ayudarte con:\n• Registrarte\n• Iniciar sesión\n• Solicitar préstamos\n• Consultar saldo`,
    confidence: 'low',
    quickReplies: [
      { label: '📝 Registrarme', value: 'registrarme', icon: '📝' },
      { label: '🔐 Iniciar sesión', value: 'iniciar sesión', icon: '🔐' },
      { label: '💰 Préstamos', value: 'préstamos', icon: '💰' },
      { label: '❓ Ayuda', value: 'ayuda', icon: '❓' },
    ],
    suggestions: ['Registrarme', 'Iniciar sesión', 'Solicitar préstamo', 'Ayuda'],
  };
}
