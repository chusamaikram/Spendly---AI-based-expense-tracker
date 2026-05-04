// ── Gemini AI Configuration ──────────────────────────────────────────────────

// export const GEMINI_MODEL   = 'gemini-2.5-flash'; //gemini 2.5 flash
// export const GEMINI_MODEL   = 'gemma-3-4b-it'; //Gamma 3 4B
// export const GEMINI_MODEL   = 'gemma-3-1b-it';     //Gamma 3 1B
// export const GEMINI_MODEL   = 'gemma-3-12b-it';     //Gamma 3 12B
// export const GEMINI_MODEL   = 'gemma-3-27b-it';     //Gamma 3 27B
export const GEMINI_MODEL   = 'gemma-3n-e4b-it'; //Gamma 3n 4EB

export const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Generation configs
export const PARSE_CONFIG  = { temperature: 0.1, maxOutputTokens: 300 };
export const REPORT_CONFIG = { temperature: 0.7, maxOutputTokens: 700 };

// ── Core Gemini fetch helper ─────────────────────────────────────────────────

export async function callGemini(prompt, config = PARSE_CONFIG) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in .env.local');

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: config,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini API error ${res.status}: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}

// ── Prompts ──────────────────────────────────────────────────────────────────

export function buildParsePrompt(text) {
  const today      = new Date().toISOString().split('T')[0];
  const yesterday  = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastWeek   = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  return `You are a financial transaction parser. Extract structured data from this natural language input.

Today's date: ${today}
User input: "${text}"

Return ONLY a valid JSON object with these exact fields:
{
  "type": "incoming" or "outgoing",
  "amount": number (required),
  "category": one of: food, transport, shopping, bills, health, entertainment, income, other,
  "merchant": string (name of store/person/service, or "Unknown"),
  "paymentMethod": one of: cash, card, online,
  "date": "YYYY-MM-DD" (today=${today}, yesterday=${yesterday}, last week=${lastWeek}),
  "description": string (max 60 chars),
  "confidence": number 0-1
}

Rules:
- type "incoming" → salary, received, got paid, income, refund, allowance, deposited
- type "outgoing" → spent, bought, paid, purchased, ordered
- category "income" only when type is "incoming"
- Default paymentMethod to "cash" if not mentioned
- Default type to "outgoing" if unclear
- amount must be a positive number, never null

Return ONLY the JSON object. No markdown, no explanation, no backticks.`;
}

export function buildReportPrompt({ periodLabel, totalIncome, totalExpense, categoryBreakdown, txSummary, count }) {
  return `You are a personal finance advisor. Analyze this user's financial data for ${periodLabel} and provide a helpful, friendly report.

SUMMARY:
- Period: ${periodLabel}
- Total Income: Rs.${totalIncome.toLocaleString()}
- Total Expenses: Rs.${totalExpense.toLocaleString()}
- Net Balance: Rs.${(totalIncome - totalExpense).toLocaleString()}
- Total Transactions: ${count}

EXPENSE BREAKDOWN BY CATEGORY:
${Object.entries(categoryBreakdown).map(([cat, amt]) => `- ${cat}: Rs.${Number(amt).toLocaleString()}`).join('\n')}

RECENT TRANSACTIONS:
${txSummary}

Write a concise, friendly financial report with:
1. A brief overview of the period (2-3 sentences)
2. Top spending categories with insights
3. Income vs expense analysis
4. 2-3 specific actionable tips based on their actual spending patterns
5. A motivational closing line

Keep it conversational, use emojis sparingly, format with **bold** for section headers. Max 400 words.`;
}
