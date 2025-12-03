const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  apiKey: 'a1cacdc74dfc80e4c71923d3e58d0aa2e89c5b91e21f7a6ae7393dc2d0005785555b176333548f3dd0f381e03e7ad931',
  baseUrl: 'https://api.uberduck.ai',
  endpoints: { speak: '/speak', speakStatus: '/speak-status', voices: '/voices' },
  polling: { maxAttempts: 30, intervalMs: 2000 },
  output: { directory: './audio-output', format: 'wav' }
};

const Logger = {
  colors: { reset: '\x1b[0m', green: '\x1b[32m', blue: '\x1b[34m', red: '\x1b[31m', cyan: '\x1b[36m' },
  success(msg) { console.log(`${this.colors.green}✅ ${msg}${this.colors.reset}`); },
  info(msg) { console.log(`${this.colors.blue}ℹ️  ${msg}${this.colors.reset}`); },
  error(msg) { console.error(`${this.colors.red}❌ ${msg}${this.colors.reset}`); },
  loading(msg) { console.log(`${this.colors.cyan}⏳ ${msg}${this.colors.reset}`); },
  header(title) { console.log(`\n${this.colors.cyan}╔${'═'.repeat(55)}╗\n║   ${title.padEnd(53)}║\n╚${'═'.repeat(55)}╝${this.colors.reset}\n`); },
  section(title) { console.log(`\n${this.colors.blue}═══ ${title} ═══${this.colors.reset}\n`); }
};

class UberduckClient {
  constructor(apiKey) { this.apiKey = apiKey; this.baseUrl = CONFIG.baseUrl; }
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { 'Authorization': `Bearer ${this.apiKey}`, 'Accept': 'application/json', ...options.headers };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    return await response.json();
  }
  async getVoices(language = null) {
    Logger.loading('Fetching voices...');
    const voices = await this.request(CONFIG.endpoints.voices);
    if (language) {
      const filtered = voices.filter(v => v.language && v.language.toLowerCase().includes(language.toLowerCase()));
      Logger.success(`Found ${filtered.length} ${language} voices`);
      return filtered;
    }
    Logger.success(`Found ${voices.length} voices`);
    return voices;
  }
  async synthesize({ text, voice = 'spanish-male-1', pace = 1.0 }) {
    Logger.loading('Starting synthesis...');
    Logger.info(`Text: "${text.substring(0, 50)}..."`);
    const response = await this.request(CONFIG.endpoints.speak, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speech: text, voice, pace })
    });
    Logger.success(`Job: ${response.uuid}`);
    return response.uuid;
  }
  async getJobStatus(uuid) { return await this.request(`${CONFIG.endpoints.speakStatus}?uuid=${uuid}`); }
  async waitForAudio(uuid) {
    Logger.loading('Waiting for audio...');
    for (let i = 0; i < CONFIG.polling.maxAttempts; i++) {
      const status = await this.getJobStatus(uuid);
      if (status.path) { Logger.success('Audio ready!'); return status.path; }
      if (status.failed_at) throw new Error('Generation failed');
      process.stdout.write('.');
      await new Promise(resolve => setTimeout(resolve, CONFIG.polling.intervalMs));
    }
    throw new Error('Timeout');
  }
  async downloadAudio(url, filename) {
    Logger.loading('Downloading...');
    const response = await fetch(url);
    const buffer = await response.buffer();
    await fs.mkdir(CONFIG.output.directory, { recursive: true });
    const filepath = path.join(CONFIG.output.directory, filename);
    await fs.writeFile(filepath, buffer);
    Logger.success(`Saved: ${filepath}`);
    return filepath;
  }
}

class LoanAssistantVoice {
  constructor(client) { this.client = client; }
  async announceCreditScore(score) {
    const rating = this.getCreditRating(score);
    const text = `Tu score crediticio es ${score} puntos. Esto es ${rating.label}. ${rating.message}`;
    const uuid = await this.client.synthesize({ text });
    const audioUrl = await this.client.waitForAudio(uuid);
    return await this.client.downloadAudio(audioUrl, `credit-score-${score}.wav`);
  }
  async announceLoanApproval({ amount, term, rate }) {
    const payment = this.calculateMonthlyPayment(amount, rate, term);
    const text = `¡Felicidades! Tu préstamo de ${amount} dólares aprobado. Pagarás ${payment.toFixed(2)} dólares mensuales.`;
    const uuid = await this.client.synthesize({ text, pace: 0.9 });
    const audioUrl = await this.client.waitForAudio(uuid);
    return await this.client.downloadAudio(audioUrl, 'loan-approved.wav');
  }
  getCreditRating(score) {
    if (score >= 750) return { label: 'excelente', message: 'Mejores tasas disponibles.' };
    if (score >= 700) return { label: 'muy bueno', message: 'Buenos préstamos disponibles.' };
    if (score >= 650) return { label: 'bueno', message: 'Préstamos con tasas moderadas.' };
    return { label: 'regular', message: 'Mejora tu historial primero.' };
  }
  calculateMonthlyPayment(principal, annualRate, months) {
    const monthlyRate = (annualRate / 100) / 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }
}

async function runTests() {
  Logger.header('🎤 Uberduck TTS Test');
  try {
    const client = new UberduckClient(CONFIG.apiKey);
    const assistant = new LoanAssistantVoice(client);
    Logger.section('TEST 1: Voices');
    const voices = await client.getVoices('spanish');
    voices.slice(0, 3).forEach((v, i) => console.log(`  ${i + 1}. ${v.name}`));
    Logger.section('TEST 2: Credit Score');
    await assistant.announceCreditScore(750);
    Logger.section('TEST 3: Loan Approval');
    await assistant.announceLoanApproval({ amount: 5000, term: 12, rate: 8.5 });
    Logger.header('✅ Complete');
    Logger.info(`Files in: ${CONFIG.output.directory}`);
  } catch (error) {
    Logger.error(`Failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

r