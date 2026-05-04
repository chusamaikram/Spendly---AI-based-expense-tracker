import { NextResponse } from 'next/server';
import { callGemini, buildParsePrompt, PARSE_CONFIG } from '../../../lib/ai/gemini';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 3)
      return NextResponse.json({ error: 'Text too short' }, { status: 400 });

    const raw     = await callGemini(buildParsePrompt(text), PARSE_CONFIG);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed  = JSON.parse(cleaned);

    if (!parsed.amount || isNaN(parsed.amount))
      return NextResponse.json({ error: 'Could not extract amount' }, { status: 422 });

    return NextResponse.json({ success: true, expense: parsed });
  } catch (err) {
    console.error('[parse-expense]', err.message);
    return NextResponse.json({ error: err.message || 'Failed to parse' }, { status: 500 });
  }
}
