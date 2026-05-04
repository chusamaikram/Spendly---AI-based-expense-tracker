import { NextResponse } from 'next/server';
import { callGemini, REPORT_CONFIG } from '../../../lib/ai/gemini';

export async function POST(request) {
  try {
    const { message, history, userId, transactions: clientTransactions } = await request.json();

    if (!message?.trim())
      return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });

    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const dayBefore = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    const lastWeek  = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const historyText = (history || [])
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join('\n');

    // ── STEP 1: Understand the full sentence and decide intent + extract data ──
    const prompt = `You are a multilingual finance assistant that understands English, Roman Urdu, and Urdu.

Today: ${today}

CONVERSATION HISTORY:
${historyText || 'None'}

User message: "${message}"

TASK: Read the FULL sentence carefully and understand its MEANING, not just keywords.

STEP 1 - DETERMINE INTENT:
- "transaction" → user is describing money they gave, received, spent, or borrowed
- "report" → user wants to see their spending summary or analysis
- "chat" → greeting, question, or anything else

STEP 2 - IF TRANSACTION, ANSWER THESE QUESTIONS BY READING THE FULL SENTENCE:

Q1: Is a specific PERSON mentioned who gave or received money?
- YES → category = "person", extract their name
- NO → determine category from what was spent on

Q2: What DIRECTION is the money flowing FROM THE USER'S PERSPECTIVE?
- User gave/spent/paid/lent → type = "outgoing"
- User received/took/got/borrowed → type = "incoming"

Roman Urdu direction clues:
- "diye", "diya", "ko diye", "bheja", "kharch kiya", "liya (bought)", "bhejy","kharida" → outgoing
- "liye (took/received)", "mila", "aayi", "wapis kiye (they returned)", "se liye" → incoming

Q3: What is the CATEGORY?
- RULE: If a person name is involved in money exchange → ALWAYS "person" (even if food/petrol is mentioned as reason)
- The reason (food, petrol) goes in description ONLY
- food/khana/chai/restaurant/grocery → "food"
- petrol/fuel/uber/careem/bus/rickshaw → "transport"  
- kapray/shoes/shopping/mall/daraz → "shopping"
- bijli/gas/internet/rent/bill/subscription → "bills"
- dawa/doctor/hospital/gym → "health"
- cinema/game/Netflix/entertainment → "entertainment"
- salary/income/freelance/profit (no person) → "income"
- person name + money exchange → "person"

Q4: What DATE?
- "aaj"/"today" → ${today}
- "kal"/"yesterday" → ${yesterday}  
- "parso" → ${dayBefore}
- "pichle hafte"/"last week" → ${lastWeek}
- no date mentioned → ${today}

EXAMPLES (study these carefully):
1. "meny azhar sy 200 liye" → incoming, person=Azhar, category=person (took FROM Azhar)
2. "meny ali ko 500 diye" → outgoing, person=Ali, category=person (gave TO Ali)
3. "azhar sy 300 liye khane ke liye" → incoming, person=Azhar, category=person, description="for food"
4. "ali ko 400 diye petrol ke liye" → outgoing, person=Ali, category=person, description="for petrol"
5. "aaj chai pi 150 ki" → outgoing, category=food, no person
6. "petrol dala 2000 ka" → outgoing, category=transport, no person
7. "salary aayi 45000" → incoming, category=income, no person
8. "bijli ka bill diya 3000" → outgoing, category=bills, no person
9. "sara ne mujhe 1000 diye" → incoming, person=Sara, category=person (Sara gave me)
10. "usman ne wapis kiye 500" → incoming, person=Usman, category=person (Usman returned)

RESPOND with ONLY this JSON (no markdown, no backticks):
{
  "intent": "chat" | "transaction" | "report",
  "reply": "friendly reply in same language as user (Roman Urdu if they wrote Roman Urdu, English if English). For person transactions use exact extracted name. Keep it 1-2 sentences.",
  "transaction": {
    "type": "incoming" | "outgoing",
    "amount": number,
    "category": "food" | "transport" | "shopping" | "bills" | "health" | "entertainment" | "income" | "person" | "other",
    "person": "exact person name with capital first letter, or null",
    "merchant": "person name if person transaction, else shop/place name or Unknown",
    "paymentMethod": "cash" | "card" | "online",
    "date": "YYYY-MM-DD",
    "description": "what the money was for, max 60 chars"
  } | null,
  "reportType": "weekly" | "monthly" | null
}`;

    const raw     = await callGemini(prompt, { temperature: 0.1, maxOutputTokens: 500 });
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed  = JSON.parse(cleaned);

    // ── Report: use transactions from client ──
    if (parsed.intent === 'report') {
      const allTransactions = Array.isArray(clientTransactions) ? clientTransactions : [];

      if (allTransactions.length === 0) {
        return NextResponse.json({
          intent: 'report',
          reply: parsed.reply,
          report: "Abhi koi transactions nahi hain. Pehle kuch expenses ya income add karein!",
          meta: { totalIncome: 0, totalExpense: 0, balance: 0, count: 0, period: 'all time' },
        });
      }

      const isWeekly    = parsed.reportType === 'weekly';
      const cutoff      = new Date();
      cutoff.setDate(cutoff.getDate() - (isWeekly ? 7 : 30));

      const filtered    = allTransactions.filter(t => new Date(t.date) >= cutoff);
      const finalTx     = filtered.length > 0 ? filtered : allTransactions;
      const periodLabel = isWeekly ? 'last 7 days' : filtered.length > 0 ? 'last 30 days' : 'all time';

      const income      = finalTx.filter(t => t.type === 'incoming');
      const expenses    = finalTx.filter(t => t.type !== 'incoming');
      const totalIncome  = income.reduce((s, t) => s + (t.amount || 0), 0);
      const totalExpense = expenses.reduce((s, t) => s + (t.amount || 0), 0);

      const categoryBreakdown = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + (t.amount || 0);
        return acc;
      }, {});

      const txSummary = finalTx.slice(0, 30).map(t => {
        const d = new Date(t.date);
        const dateStr = isNaN(d) ? 'Unknown' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `- ${t.type === 'incoming' ? 'INCOME' : 'EXPENSE'} | Rs.${t.amount} | ${t.category} | ${t.merchant || 'Unknown'} | ${dateStr}`;
      }).join('\n');

      const reportPrompt = `You are a finance report generator. Generate a STRUCTURED report using ONLY the data provided. No lengthy explanations.

DATA:
- Period: ${periodLabel}
- Total Income: Rs.${totalIncome.toLocaleString()}
- Total Expenses: Rs.${totalExpense.toLocaleString()}
- Net Balance: Rs.${(totalIncome - totalExpense).toLocaleString()}
- Transactions: ${finalTx.length}

EXPENSE BY CATEGORY:
${Object.entries(categoryBreakdown).map(([cat, amt]) => `${cat}: Rs.${Number(amt).toLocaleString()}`).join('\n')}

Generate report in EXACTLY this format (use these exact section headers, keep it concise):

**📊 Summary**
💰 Income: Rs.X
💸 Expenses: Rs.X
📈 Net Balance: Rs.X
🔢 Transactions: X

**📂 Expenses by Category**
| Category | Amount |
|----------|--------|
| Food | Rs.X |
| Transport | Rs.X |
(list all categories with amounts)

**💡 Quick Tips**
1. One short tip based on top spending category
2. One short saving tip

Keep everything SHORT. No paragraphs. No lengthy explanations. Just the structured data above.`;

      const report = await callGemini(reportPrompt, REPORT_CONFIG);

      return NextResponse.json({
        intent: 'report',
        reply: parsed.reply,
        report,
        meta: { totalIncome, totalExpense, balance: totalIncome - totalExpense, count: finalTx.length, period: periodLabel },
      });
    }

    return NextResponse.json({
      intent: parsed.intent,
      reply: parsed.reply,
      transaction: parsed.transaction || null,
    });

  } catch (err) {
    console.error('[chat]', err.message);
    return NextResponse.json({ error: err.message || 'Failed to process' }, { status: 500 });
  }
}
