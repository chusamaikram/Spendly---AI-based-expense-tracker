🚀 Spendly — AI Expense Tracker
A premium AI-powered expense tracker built with Next.js 15, Firebase, and Claude AI. Track expenses using natural language — just describe what you spent and the AI handles everything else.
---
✨ Features
AI Expense Parsing — Claude AI extracts amount, category, merchant, payment method, and date from any natural sentence
Chat-Style Logging — Conversational expense logging with no forms
Smart Categories — Auto-detects Food, Transport, Shopping, Bills, Health, Entertainment
Natural Date Understanding — "yesterday", "last night", "last week", specific dates
Voice Input — Speak your expenses (Web Speech API)
Dashboard Analytics — Total spending, category donut chart, monthly bar chart
Transaction History — Searchable, filterable, deletable
Dark/Light Theme — Premium dark theme by default with smooth toggle
Firebase Auth — Email/password + Google OAuth
Firestore Storage — Per-user expense data with proper schema
---
📁 Project Structure
```
expense-tracker/
├── app/
│   ├── (auth)/
│   │   ├── login/page.js          # Login page
│   │   ├── signup/page.js         # Signup page
│   │   └── layout.js              # Auth layout
│   ├── api/
│   │   └── parse-expense/route.js # AI parsing API route
│   ├── dashboard/
│   │   ├── page.js                # Dashboard page
│   │   └── layout.js
│   ├── layout.js                  # Root layout
│   ├── page.js                    # Landing page
│   └── providers.js               # Context providers
│
├── components/
│   ├── chat/
│   │   └── ChatInterface.js       # AI chat expense logger
│   ├── dashboard/
│   │   ├── DashboardShell.js      # Main dashboard wrapper
│   │   ├── DashboardOverview.js   # Stats & charts overview
│   │   ├── Sidebar.js             # Navigation sidebar
│   │   ├── TransactionList.js     # All transactions view
│   │   ├── CategoryDonut.js       # SVG donut chart
│   │   └── SpendingBar.js         # Monthly bar chart
│   ├── landing/
│   │   └── LandingPage.js         # Marketing landing page
│   ├── layout/
│   │   ├── LoginForm.js           # Login form
│   │   └── SignupForm.js          # Signup form
│   └── ui/
│       └── ThemeToggle.js         # Dark/light theme toggle
│
├── lib/
│   ├── firebase/
│   │   ├── config.js              # Firebase initialization
│   │   ├── auth.js                # Auth functions
│   │   └── expenses.js            # Firestore CRUD
│   ├── hooks/
│   │   ├── useAuth.js             # Auth context & hook
│   │   ├── useExpenses.js         # Expenses data hook
│   │   └── useTheme.js            # Theme toggle hook
│   └── utils/
│       └── expenseParser.js       # AI parsing utilities & helpers
│
├── styles/
│   └── globals.css                # Global styles & CSS variables
│
├── .env.local.example             # Environment variables template
├── tailwind.config.js
├── next.config.js
└── package.json
```
---
🛠️ Setup Instructions
1. Clone & Install
```bash
cd expense-tracker
npm install
```
2. Firebase Setup
Go to Firebase Console
Create a new project
Enable Authentication → Sign-in methods → Email/Password + Google
Create a Firestore Database in production mode
Add these Firestore security rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```
Get your Firebase config from Project Settings → Your Apps → Web App
3. Anthropic API
Get your API key from console.anthropic.com
The app uses `claude-haiku-4-5` for fast, cost-effective parsing
4. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

ANTHROPIC_API_KEY=sk-ant-...
```
5. Run
```bash
npm run dev
```
Open http://localhost:3000
---
🎨 Design System
Token	Value
Primary Font	Syne (headings)
Body Font	DM Sans
Mono Font	JetBrains Mono
Accent Color	Volt Green `#a0e620`
Background	Obsidian `#05050c`
Theme	Dark by default, light toggle
---
📊 Firestore Schema
```js
// Collection: expenses
{
  userId: string,         // Firebase Auth UID
  amount: number,         // e.g. 450
  category: string,       // food|transport|shopping|bills|health|entertainment|other
  merchant: string,       // e.g. "Espresso"
  paymentMethod: string,  // cash|card|online
  date: Timestamp,        // Firebase Timestamp
  description: string,    // Raw or cleaned text
  createdAt: Timestamp,   // Server timestamp
}
```
---
🤖 AI Parsing Examples
Input	Amount	Category	Merchant
"Bought coffee for 450 at Espresso"	450	food	Espresso
"Spent 400 on coffee"	400	food	Unknown
"Careem ride 320 by card"	320	transport	Careem
"Netflix 1500 last night"	1500	bills	Netflix
"Groceries at Imtiaz, paid 3200 cash"	3200	food	Imtiaz
---
🚀 Deploy
```bash
# Vercel (recommended)
npx vercel --prod

# Or build locally
npm run build
npm start
```