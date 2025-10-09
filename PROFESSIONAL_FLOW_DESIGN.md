# 🏦 EBAS DApp - Professional Authentication & Credit Flow

## Overview
Este documento define el flujo profesional completo para la DApp de créditos EBAS, integrando autenticación biométrica (Passkeys) con el sistema de scoring crediticio y asistente de IA.

---

## 🎯 User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE                              │
│  "Préstamos instantáneos con blockchain"                    │
│                                                              │
│  [🔐 Iniciar Sesión]  [💰 Solicitar Crédito]               │
└─────────────────────────────────────────────────────────────┘
                    ↓                    ↓
         ┌──────────┴────────┐    ┌─────┴────────────┐
         ↓                   ↓    ↓                  ↓
    ┌─────────┐      ┌──────────┐ ┌──────────┐      
    │ NUEVO   │      │ USUARIO  │ │ NUEVO    │
    │ USUARIO │      │ EXISTENTE│ │ (CRÉDITO)│
    └─────────┘      └──────────┘ └──────────┘
         ↓                   ↓           ↓
┌────────────────┐   ┌──────────────┐   │
│ REGISTRO       │   │ AUTENTICACIÓN│   │
│ BIOMÉTRICO     │   │ BIOMÉTRICA   │   │
│ (Passkey)      │   │ (Passkey)    │   │
└────────────────┘   └──────────────┘   │
         ↓                   ↓           ↓
         └───────────────────┴───────────┘
                     ↓
         ┌───────────────────────┐
         │ SESIÓN AUTENTICADA    │
         │ ✅ Passkey verificado │
         │ ✅ Wallet conectado   │
         └───────────────────────┘
                     ↓
         ┌───────────────────────┐
         │   DASHBOARD PRINCIPAL │
         │                       │
         │  • Ver perfil         │
         │  • Historial          │
         │  • Solicitar crédito  │
         │  • Asistente IA       │
         └───────────────────────┘
                     ↓
         ┌───────────────────────┐
         │  FLUJO DE CRÉDITO     │
         │  (con IA Voice)       │
         └───────────────────────┘
```

---

## 🔐 Flow 1: Autenticación Biométrica (Primera vez)

### Step 1: Landing Page
```tsx
<LandingPage>
  <Hero>
    <h1>Préstamos instantáneos en blockchain</h1>
    <p>Sin bancos. Sin papeleos. Solo tu huella.</p>
  </Hero>
  
  <CTAButtons>
    <Button onClick={handleLogin} primary>
      🔐 Iniciar Sesión
    </Button>
    <Button onClick={handleRequestCredit} secondary>
      💰 Solicitar Crédito
    </Button>
  </CTAButtons>
  
  <Features>
    • Autenticación biométrica segura
    • Aprobación en 5 minutos
    • Transparencia blockchain
  </Features>
</LandingPage>
```

### Step 2: Registro Biométrico (Nuevo Usuario)
```tsx
<PasskeyRegistration>
  <Title>Crear tu cuenta EBAS</Title>
  <Subtitle>Usa tu huella digital o Face ID</Subtitle>
  
  <Form>
    <Input 
      label="Nombre completo"
      placeholder="Juan Pérez"
    />
    <Input 
      label="Email"
      placeholder="juan@example.com"
    />
    
    <BiometricButton onClick={createPasskey}>
      👆 Registrar Huella/Face ID
    </BiometricButton>
  </Form>
  
  <SecurityNote>
    🔒 Tu biometría nunca sale de tu dispositivo
  </SecurityNote>
</PasskeyRegistration>
```

### Step 3: Proceso de Creación de Passkey
```typescript
async function createPasskey(username: string, email: string) {
  // 1. Crear passkey con WebAuthn
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: getChallenge(),
      rp: { name: "EBAS", id: "ebas.finance" },
      user: {
        id: generateUserId(),
        name: email,
        displayName: username
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Face ID, Touch ID
        userVerification: "required"
      }
    }
  });

  // 2. Desplegar wallet en Stellar
  const walletAddress = await deployWebAuthnWallet(credential);

  // 3. Guardar en DB/localStorage
  await saveUser({
    credentialId: credential.id,
    username,
    email,
    walletAddress,
    createdAt: new Date()
  });

  // 4. Iniciar sesión automáticamente
  return { authenticated: true, walletAddress };
}
```

---

## 🔓 Flow 2: Autenticación (Usuario Existente)

### Step 1: Login Prompt
```tsx
<PasskeyLogin>
  <Title>Bienvenido de nuevo</Title>
  <Subtitle>Usa tu huella digital para entrar</Subtitle>
  
  <BiometricButton onClick={authenticatePasskey}>
    👆 Autenticar con Huella/Face ID
  </BiometricButton>
  
  <OrDivider />
  
  <Link href="/forgot-passkey">
    ¿Perdiste acceso a tu dispositivo?
  </Link>
</PasskeyLogin>
```

### Step 2: Proceso de Autenticación
```typescript
async function authenticatePasskey() {
  // 1. Solicitar autenticación
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: getChallenge(),
      allowCredentials: getStoredCredentials(),
      userVerification: "required"
    }
  });

  // 2. Verificar firma en servidor
  const verified = await verifySignature(credential);

  if (verified) {
    // 3. Cargar datos del usuario
    const user = await loadUserData(credential.id);
    
    // 4. Conectar wallet
    const wallet = await connectWallet(user.walletAddress);
    
    // 5. Iniciar sesión
    setSession({
      authenticated: true,
      user: user,
      wallet: wallet,
      credentialId: credential.id
    });

    return { success: true, user };
  }
}
```

---

## 🏠 Flow 3: Dashboard Autenticado

### Componente Principal
```tsx
<AuthenticatedDashboard user={user}>
  <Header>
    <UserInfo>
      <Avatar>{user.name[0]}</Avatar>
      <Name>{user.name}</Name>
      <WalletAddress>{truncate(user.walletAddress)}</WalletAddress>
    </UserInfo>
    
    <BiometricIndicator>
      ✅ Sesión segura
    </BiometricIndicator>
  </Header>

  <QuickActions>
    <ActionCard onClick={requestLoan}>
      💰 Solicitar Crédito
      <Badge>Rápido</Badge>
    </ActionCard>
    
    <ActionCard onClick={viewProfile}>
      📊 Ver mi Score
      <Score>{user.creditScore || "---"}</Score>
    </ActionCard>
    
    <ActionCard onClick={viewHistory}>
      📜 Historial
      <Count>{user.loanCount || 0}</Count>
    </ActionCard>
  </QuickActions>

  <FinancialOverview>
    <CreditScoreCard score={user.creditScore} />
    <LoanHistoryCard loans={user.loans} />
    <RecommendationsCard />
  </FinancialOverview>

  <AIAssistantButton>
    🎤 Habla con EBAS
  </AIAssistantButton>
</AuthenticatedDashboard>
```

---

## 💰 Flow 4: Solicitud de Crédito (Flujo Completo)

### State Machine
```typescript
type CreditFlowState = 
  | 'authentication_check'    // Verificar si está autenticado
  | 'income_verification'     // Capturar datos de ingreso
  | 'score_calculation'       // Calcular score crediticio
  | 'loan_configuration'      // Configurar monto y términos
  | 'ai_review'              // IA revisa y sugiere
  | 'blockchain_execution'    // Ejecutar transacción
  | 'success'                // Préstamo aprobado
  | 'rejected';              // No califica

const creditFlowMachine = {
  initial: 'authentication_check',
  states: {
    authentication_check: {
      on: {
        AUTHENTICATED: 'income_verification',
        NOT_AUTHENTICATED: 'redirect_to_login'
      }
    },
    income_verification: {
      on: {
        DATA_COMPLETE: 'score_calculation',
        NEED_MORE_INFO: 'income_verification'
      }
    },
    score_calculation: {
      on: {
        SCORE_CALCULATED: [
          { target: 'loan_configuration', cond: score >= 700 },
          { target: 'rejected', cond: score < 700 }
        ]
      }
    },
    loan_configuration: {
      on: {
        AMOUNT_SELECTED: 'ai_review'
      }
    },
    ai_review: {
      on: {
        USER_CONFIRMED: 'blockchain_execution',
        USER_CANCELLED: 'loan_configuration'
      }
    },
    blockchain_execution: {
      on: {
        TRANSACTION_SUCCESS: 'success',
        TRANSACTION_FAILED: 'error'
      }
    }
  }
};
```

### Step-by-Step con IA Voice

#### Step 1: Authentication Guard
```tsx
function CreditRequestFlow() {
  const { session } = useAuth();

  if (!session?.authenticated) {
    return (
      <AuthenticationRequired>
        <Icon>🔒</Icon>
        <Title>Autenticación requerida</Title>
        <Message>
          Para solicitar un crédito necesitas autenticarte con tu huella digital.
        </Message>
        <Button onClick={redirectToLogin}>
          Iniciar Sesión
        </Button>
      </AuthenticationRequired>
    );
  }

  return <AuthenticatedCreditFlow />;
}
```

#### Step 2: Income Verification (con IA Voice)
```tsx
<IncomeVerification>
  <VoiceAssistant
    onTranscript={handleVoiceInput}
    greeting="Hola {user.name}! Para calcular tu elegibilidad necesito conocer tus ingresos."
  />
  
  <Form>
    {/* IA puede pre-llenar esto */}
    <Input 
      label="Ingreso mensual promedio"
      value={aiExtractedData.monthlyIncome}
    />
    <Select 
      label="Plataformas de trabajo"
      options={["Uber", "Rappi", "Freelancer"]}
      value={aiExtractedData.platforms}
    />
    <Input
      label="Años de experiencia"
      value={aiExtractedData.yearsExperience}
    />
  </Form>

  <AIActionButtons>
    <Button onClick={continueWithAI}>
      🎤 Continuar hablando
    </Button>
    <Button onClick={fillManually}>
      ⌨️ Llenar manualmente
    </Button>
  </AIActionButtons>
</IncomeVerification>
```

#### Step 3: Score Calculation
```tsx
<ScoreCalculation>
  <LoadingAnimation>
    <Spinner />
    <Text>Calculando tu score crediticio...</Text>
    <Substeps>
      ✓ Analizando ingresos
      ✓ Evaluando estabilidad
      ⏳ Calculando score
    </Substeps>
  </LoadingAnimation>
</ScoreCalculation>

// Después de calcular:
<ScoreResult score={750}>
  <ScoreGauge value={750} max={850} />
  
  <Congratulations>
    🎉 ¡Excelente! Tu score es {score}
  </Congratulations>
  
  <Explanation>
    Tu score es "Bueno". Calificas para préstamos de hasta ${maxAmount}.
  </Explanation>
  
  <AIInsight>
    💡 EBAS dice: "Tu score es bueno porque tienes ingresos estables 
    y experiencia comprobada. Te ofrecemos 10% APR."
  </AIInsight>
  
  <NextButton onClick={configureLoan}>
    Continuar →
  </NextButton>
</ScoreResult>
```

#### Step 4: Loan Configuration (con IA)
```tsx
<LoanConfiguration score={750} maxAmount={1000}>
  <AmountSelector>
    <Label>¿Cuánto necesitas?</Label>
    <Slider 
      min={50}
      max={maxAmount}
      value={amount}
      onChange={setAmount}
    />
    <Display>${amount} USD</Display>
  </AmountSelector>

  <PurposeSelector>
    <Radio value="emergency">🚨 Emergencia</Radio>
    <Radio value="business">💼 Negocio</Radio>
    <Radio value="personal">🏠 Personal</Radio>
    <Radio value="education">📚 Educación</Radio>
  </PurposeSelector>

  <RepaymentPlan>
    <Option value="weekly">
      <Period>Semanal</Period>
      <Payment>${calculateWeekly(amount)}</Payment>
    </Option>
    <Option value="monthly">
      <Period>Mensual</Period>
      <Payment>${calculateMonthly(amount)}</Payment>
    </Option>
  </RepaymentPlan>

  <VoiceAlternative>
    <Button onClick={configureWithVoice}>
      🎤 "Necesito 500 dólares para emergencia, pago mensual"
    </Button>
  </VoiceAlternative>

  <Summary>
    <Item>Monto: ${amount}</Item>
    <Item>APR: {apr}%</Item>
    <Item>Plazo: {term}</Item>
    <Item>Total a pagar: ${totalPayment}</Item>
  </Summary>
</LoanConfiguration>
```

#### Step 5: AI Review & Confirmation
```tsx
<AIReview loanDetails={loanDetails}>
  <AIAvatar speaking={true}>
    🤖 EBAS
  </AIAvatar>

  <AIMessage>
    "Perfecto {user.name}. Revisé tu solicitud:
    
    • Préstamo: ${amount}
    • Tu score: {score} ✅
    • APR: {apr}% (tasa preferencial)
    • Pago mensual: ${monthlyPayment}
    
    Todo está en orden. Si confirmas, ejecutaré la transacción 
    en blockchain. Los fondos llegarán a tu wallet en 30 segundos.
    
    ¿Confirmas?"
  </AIMessage>

  <ConfirmationButtons>
    <Button 
      onClick={confirmTransaction}
      variant="success"
    >
      ✅ Sí, confirmo
    </Button>
    
    <Button 
      onClick={goBack}
      variant="secondary"
    >
      ← Modificar
    </Button>
  </ConfirmationButtons>

  <VoiceConfirmation>
    🎤 O di: "Sí, confirmo el préstamo"
  </VoiceConfirmation>

  <LegalDisclaimer>
    ⚠️ Esta acción ejecutará una transacción real en Stellar blockchain.
    Tarifa de red: ~0.001 XLM
  </LegalDisclaimer>
</AIReview>
```

#### Step 6: Blockchain Execution
```tsx
<BlockchainExecution>
  <TransactionProgress>
    <Step status="completed">
      ✓ Firmando con tu Passkey
    </Step>
    <Step status="in-progress">
      ⏳ Ejecutando en Stellar...
    </Step>
    <Step status="pending">
      ⏱️ Confirmando transacción
    </Step>
    <Step status="pending">
      💰 Transfiriendo fondos
    </Step>
  </TransactionProgress>

  <BlockchainInfo>
    <Label>Transaction Hash:</Label>
    <Hash>{txHash}</Hash>
    <ExplorerLink href={stellarExpertUrl}>
      Ver en Stellar Expert →
    </ExplorerLink>
  </BlockchainInfo>

  <AICommentary>
    🤖 "Ejecutando tu préstamo en blockchain. 
        Esto toma 5-10 segundos..."
  </AICommentary>
</BlockchainExecution>
```

#### Step 7: Success!
```tsx
<SuccessPage loanResult={result}>
  <Celebration>
    🎉 ¡Préstamo Aprobado!
  </Celebration>

  <LoanDetails>
    <Amount>${result.amount}</Amount>
    <LoanId>ID: {result.loanId}</LoanId>
    <TransactionHash>{result.txHash}</TransactionHash>
  </LoanDetails>

  <Timeline>
    <Event>
      Procesado: {formatDate(result.timestamp)}
    </Event>
    <Event>
      Fecha de pago: {formatDate(result.dueDate)}
    </Event>
  </Timeline>

  <NextSteps>
    <Step>✅ Los USDC están en tu wallet</Step>
    <Step>📱 Revisa tu wallet Stellar</Step>
    <Step>📊 Guarda este recibo</Step>
  </NextSteps>

  <AIMessage>
    🤖 "¡Felicidades {user.name}! Tu préstamo fue exitoso. 
        Los fondos ya están disponibles. 
        ¿Quieres que te explique cómo pagar?"
  </AIMessage>

  <Actions>
    <Button onClick={viewWallet}>
      👛 Ver Wallet
    </Button>
    <Button onClick={newLoan}>
      🔄 Nuevo Préstamo
    </Button>
    <Button onClick={dashboard}>
      🏠 Ir al Dashboard
    </Button>
  </Actions>
</SuccessPage>
```

---

## 🔒 Security Considerations

### Session Management
```typescript
interface SecureSession {
  authenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    walletAddress: string;
    credentialId: string;
  };
  expiresAt: Date;
  mfa: {
    passkeyVerified: boolean;
    lastVerification: Date;
  };
}

// Re-authentication para acciones sensibles
async function requireReauth(action: 'loan' | 'transfer' | 'settings') {
  if (shouldReauthenticate(action)) {
    const verified = await authenticatePasskey();
    if (!verified) {
      throw new Error('Re-authentication required');
    }
  }
  return true;
}
```

### Transaction Signing
```typescript
async function signTransaction(tx: Transaction, session: SecureSession) {
  // 1. Verificar sesión activa
  if (!session.authenticated) {
    throw new Error('Not authenticated');
  }

  // 2. Mostrar detalles de la transacción
  await showTransactionDetails(tx);

  // 3. Solicitar confirmación biométrica
  const signature = await authenticateWithPasskey();

  // 4. Firmar y enviar
  const signedTx = tx.sign(signature);
  return await submitToBlockchain(signedTx);
}
```

---

## 📱 Mobile Considerations

### Responsive Design
- Touch-friendly buttons (min 44x44px)
- Voice input button always accessible
- Bottom navigation for quick actions
- Swipe gestures for navigation

### Native Features
- Use device biometrics (Face ID, Touch ID, Fingerprint)
- Haptic feedback on confirmations
- Push notifications for loan status
- QR code scanning for wallet addresses

---

## 🎯 Success Metrics

### User Experience
- ✅ Login completes in <5 seconds
- ✅ Loan approval in <3 minutes
- ✅ Zero friction with passkeys
- ✅ 90%+ completion rate on started loans

### Security
- ✅ Zero password-related breaches
- ✅ 100% biometric authentication
- ✅ All transactions signed with passkey
- ✅ Session timeout after 30 minutes idle

### Business
- ✅ Higher conversion vs traditional flow
- ✅ Lower support tickets (no password resets)
- ✅ Better user retention
- ✅ Viral sharing ("look, no passwords!")

---

## 🚀 Implementation Roadmap

### Phase 1: Core Authentication (Week 1)
- [x] Passkey registration
- [x] Passkey login
- [ ] Session management
- [ ] Wallet connection

### Phase 2: Dashboard & Profile (Week 1-2)
- [ ] User dashboard
- [ ] Credit score display
- [ ] Loan history
- [ ] Profile management

### Phase 3: Credit Flow (Week 2)
- [ ] Income verification form
- [ ] Score calculation
- [ ] Loan configuration
- [ ] Blockchain execution

### Phase 4: AI Integration (Week 3)
- [ ] Voice input/output
- [ ] AI assistant component
- [ ] Intent detection
- [ ] Function calling

### Phase 5: Polish & Launch (Week 4)
- [ ] Animations & transitions
- [ ] Error handling
- [ ] Mobile optimization
- [ ] Security audit

---

## 📖 Component Architecture

```
src/
├── components/
│   ├── auth/
│   │   ├── PasskeyRegistration.tsx
│   │   ├── PasskeyLogin.tsx
│   │   └── AuthGuard.tsx
│   ├── dashboard/
│   │   ├── AuthenticatedDashboard.tsx
│   │   ├── CreditScoreCard.tsx
│   │   └── QuickActions.tsx
│   ├── credit/
│   │   ├── CreditFlowOrchestrator.tsx
│   │   ├── IncomeVerification.tsx
│   │   ├── ScoreCalculation.tsx
│   │   ├── LoanConfiguration.tsx
│   │   └── SuccessPage.tsx
│   └── ai/
│       ├── VoiceAssistant.tsx
│       ├── AIReviewPanel.tsx
│       └── ChatInterface.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── usePasskey.ts
│   ├── useVoice.ts
│   └── useLoanFlow.ts
├── lib/
│   ├── passkey.ts
│   ├── stellar.ts
│   └── ai-client.ts
└── api/
    ├── auth/
    │   └── passkey.ts
    ├── credit/
    │   ├── calculate-score.ts
    │   └── execute-loan.ts
    └── ai/
        └── chat.ts
```

---

**Version**: 1.0
**Last Updated**: October 9, 2025
**Status**: Ready for Implementation 🚀
