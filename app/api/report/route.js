import { NextResponse } from 'next/server';
import { getUserExpenses } from '../../../lib/firebase/expenses';
import { callGemini, buildReportPrompt, REPORT_CONFIG } from '../../../lib/ai/gemini';

export async function POST(request) {
  try {
    const { userId, reportType } = await request.json();

    if (!userId)
      return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const now = new Date();
    // Fetch all then filter in JS — avoids composite index requirement
    const all = await getUserExpenses(userId, 500);

    // Use relative days instead of calendar month boundaries
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (reportType === 'weekly' ? 7 : 30));

    let transactions = all.filter(t => {
      const d = t.date instanceof Date ? t.date : new Date(t.date);
      return d >= cutoff;
    });

    // Fallback to all transactions if period filter returns nothing
    if (transactions.length === 0) transactions = all;
    const periodLabel = reportType === 'weekly' ? 'last 7 days' : transactions.length < all.length ? 'last 30 days' : 'all time';

    if (transactions.length === 0) {
      return NextResponse.json({
        success: true,
        report: `No transactions found for ${periodLabel}. Start logging your income and expenses to get insights!`,
        meta: { totalIncome: 0, totalExpense: 0, balance: 0, count: 0, period: periodLabel },
      });
    }

    const income   = transactions.filter(t => t.type === 'incoming');
    const expenses = transactions.filter(t => t.type !== 'incoming');

    const totalIncome  = income.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);

    const categoryBreakdown = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const txSummary = transactions.slice(0, 30).map(t =>
      `- ${t.type === 'incoming' ? 'INCOME' : 'EXPENSE'} | Rs.${t.amount} | ${t.category} | ${t.merchant} | ${new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    ).join('\n');

    const report = await callGemini(
      buildReportPrompt({ periodLabel, totalIncome, totalExpense, categoryBreakdown, txSummary, count: transactions.length }),
      REPORT_CONFIG
    );

    return NextResponse.json({
      success: true,
      report,
      meta: { totalIncome, totalExpense, balance: totalIncome - totalExpense, count: transactions.length, period: periodLabel },
    });
  } catch (err) {
    console.error('[report]', err.message);
    return NextResponse.json({ error: err.message || 'Failed to generate report' }, { status: 500 });
  }
}
