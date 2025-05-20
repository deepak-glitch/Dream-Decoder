// src/services/sonar.ts
import axios from 'axios';

const API_BASE = 'https://api.perplexity.ai/chat/completions';
const API_KEY  = import.meta.env.VITE_SONAR_API_KEY;

export async function interpretSymbols(symbols: string[]): Promise<string> {
  const { data } = await axios.post(
    API_BASE,
    {
      model: 'sonar',
      messages: [
        { role: 'system', content: 'You are a dream-oracle assistant.' },
        { role: 'user',   content: symbols.join(', ') }
      ]
    },
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  return data.choices?.[0]?.message?.content ?? 'No interpretation.';
}
