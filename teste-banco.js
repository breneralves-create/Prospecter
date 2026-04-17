
const URL = 'https://vptvtmwrxixtrwjvndha.supabase.co/rest/v1/leads?select=*';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdHZ0bXdyeGl4dHJ3anZuZGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg0OTc1MywiZXhwIjoyMDkxNDI1NzUzfQ.ndE4kO9F7HJcKDCskTq1ct2zJMteqK8YihbnrEdDJmA';

console.log('--- TESTE DE CONEXÃO PROSPECTER ---');
console.log('Conectando em:', URL);

async function test() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(URL, {
      headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` },
      signal: controller.signal
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Tabelas encontradas/Dados:', Array.isArray(data) ? `OK (${data.length} leads)` : 'Erro no formato');
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('ERRO: O servidor não respondeu (Timeout de 10s). Sua internet/rede está bloqueando o Supabase.');
    } else {
      console.error('ERRO DE SISTEMA:', err.message);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

test();
