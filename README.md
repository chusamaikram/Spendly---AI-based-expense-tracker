# ⚡ Spendly — AI-Powered Finance Tracker

A modern, full-stack personal finance tracker built with **Next.js 15**, **Firebase**, and **Gemini AI**. Track income and expenses through natural conversation in English, Roman Urdu, or mixed language. Get AI-generated financial reports, manage person-wise ledgers (Khata), and visualize your spending with interactive ECharts.

---

## ✨ Features

### 🤖 Gemini AI Assistant
- Natural language transaction logging in **English**, **Roman Urdu**, and mixed language
- Understands phrases like *"meny azhar ko 500 diye"*, *"aaj chai pe 150 kharch kiye"*, *"salary aayi 45000"*
- Automatically detects transaction type (income/expense), category, merchant, payment method, and date
- Generates **weekly and monthly financial reports** with category breakdown and actionable tips
- Conversational chat with full context history across sessions

### 💬 AI Chat with History
- Dedicated AI Logger page with collapsible history sidebar
- Chat sessions **auto-saved to Firebase** after 2 seconds of inactivity
- Load, resume, or delete any previous chat session
- Floating **Bot button** accessible from every dashboard page
- Voice input support via Web Speech API

### 📊 Dashboard & Analytics
- **Net Balance**, Total Income, Total Expenses stat cards
- **Monthly bar chart** — income vs expense side-by-side (ECharts)
- **Category donut chart** — expense breakdown by category (ECharts)
- Recent transactions list with skeleton loaders
- All stats include data from all sources (categories + person transactions)

### 💳 Transaction Management
- Add transactions manually via modal (income or expense)
- Full transaction list with **search**, **type filter** (income/expense), and **category filter**
- Group transactions by date with daily totals
- Delete transactions with confirmation
- Income shown in green (`+`), expenses in red (`-`)

### 👥 Khata (Person Ledger)
- Track money exchanged with specific people
- Per-person ledger showing **Given** (red) and **Taken** (green) amounts
- Net balance per person: *"They owe you"* or *"You owe them"* with correct color coding
- Expandable transaction history per person
- Summary cards for total given and taken across all people
- AI understands: *"gave 400 to Ali"*, *"Ali returned 200"*, *"meny sara sy 300 liye"*

### 🔐 Authentication
- Email/password signup and login
- Google OAuth sign-in
- Password strength indicator on signup
- Per-user data isolation — users only see their own data

### 🛡️ App Check
- Firebase App Check enabled with **reCAPTCHA v3** provider
- Blocks unauthorized clients from accessing Firestore and other Firebase resources
- All API requests are verified — only legitimate app instances can read/write data
- Enforced on both Firestore and Authentication backends

### 🎨 UI/UX
- **Dark and Light themes** with smooth toggle (persisted in localStorage)
- Warm cyan color scheme (`#22d3ee`) as primary accent
- Beautiful **splash screen** with animated logo and progress bar on page load
- Skeleton loaders for all data-heavy sections
- Fully responsive — works on mobile and desktop
- Sticky navbar on landing page
- Toast notifications for all actions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| App Security | Firebase App Check (reCAPTCHA v3) |
| AI | Google Gemini 1.5 Flash |
| Charts | ECharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Fonts | Syne, DM Sans, JetBrains Mono |

---

## 📁 Project Structure

```
spendly/
├── app/
│   ├── (auth)/
│   │   ├── login/page.jsx          # Login page
│   │   ├── signup/page.jsx         # Signup page
│   │   └── layout.jsx              # Auth layout with theme toggle + back link
│   ├── api/
│   │   ├── chat/route.js           # Unified AI chat endpoint (Gemini)
│   │   ├── parse-expense/route.js  # Transaction parser endpoint
│   │   └── report/route.js         # Financial report generator
│   ├── dashboard/
│   │   ├── page.jsx                # Dashboard entry point
│   │   └── layout.jsx
│   ├── layout.jsx                  # Root layout with fonts + providers
│   ├── page.jsx                    # Landing page entry
│   └── providers.jsx               # AuthProvider + ExpensesProvider + PageLoader
│
├── components/
│   ├── chat/
│   │   ├── ChatInterface.jsx       # Main chat page (logic + layout)
│   │   ├── ChatHistorySidebar.jsx  # Collapsible history panel
│   │   ├── ChatInput.jsx           # Textarea + send/mic buttons
│   │   ├── MessageBubble.jsx       # Renders all message types
│   │   ├── TransactionCard.jsx     # Logged transaction card in chat
│   │   ├── ReportCard.jsx          # Financial report card in chat
│   │   └── TypingIndicator.jsx     # Animated dots while AI responds
│   ├── dashboard/
│   │   ├── DashboardShell.jsx      # Main layout with sidebar + routing
│   │   ├── DashboardOverview.jsx   # Stats, charts, recent transactions
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   ├── TransactionList.jsx     # Full transaction list with filters
│   │   ├── KhataPage.jsx           # Person-wise ledger page
│   │   ├── AddExpenseModal.jsx     # Manual add transaction modal
│   │   ├── CategoryDonut.jsx       # ECharts donut chart
│   │   └── SpendingBar.jsx         # ECharts bar chart
│   ├── landing/
│   │   ├── LandingPage.jsx         # Landing page (server component)
│   │   ├── Navbar.jsx              # Sticky navbar with theme toggle
│   │   └── HeroDemo.jsx            # Animated typing demo (client island)
│   ├── layout/
│   │   ├── LoginForm.jsx           # Login form
│   │   └── SignupForm.jsx          # Signup form with password strength
│   └── ui/
│       ├── Button.jsx              # Reusable button (primary/ghost/danger)
│       ├── Modal.jsx               # Modal wrapper with Escape key support
│       ├── StatCard.jsx            # Dashboard stat card
│       ├── TransactionRow.jsx      # Single transaction row
│       ├── EmptyState.jsx          # Empty placeholder with action
│       ├── PageHeader.jsx          # Sticky page header
│       ├── FilterChip.jsx          # Filter pill button
│       ├── Skeleton.jsx            # Shimmer skeleton loader
│       ├── SplashScreen.jsx        # Full-screen loading animation
│       ├── PageLoader.jsx          # Route-aware auth loading wrapper
│       └── ThemeToggle.jsx         # Dark/light mode toggle
│
├── lib/
│   ├── ai/
│   │   └── gemini.js               # Gemini config, callGemini(), prompts
│   ├── firebase/
│   │   ├── config.js               # Firebase initialization + App Check setup
│   │   ├── auth.js                 # Auth functions (email, Google, signOut)
│   │   └── expenses.js             # Firestore CRUD for expenses + chat sessions
│   ├── hooks/
│   │   ├── useAuth.js              # AuthContext + useAuth hook
│   │   ├── useExpenses.js          # ExpensesContext + useExpenses hook
│   │   └── useTheme.js             # Theme toggle hook
│   └── utils/
│       └── expenseParser.js        # CATEGORY_META, formatCurrency, getPersonLedger
│
├── styles/
│   └── globals.css                 # Tailwind v4 + CSS variables + utility classes
│
├── public/
│   └── favicon.svg
│
├── firestore.rules                 # Firestore security rules
├── .gitignore
├── next.config.js
├── postcss.config.js
└── package.json
```

---

## 🗄️ Firestore Data Structure

```
users/
└── {userId}/
    ├── expenses/
    │   └── {expenseId}
    │       ├── type: "incoming" | "outgoing"
    │       ├── amount: number
    │       ├── category: "food" | "transport" | "shopping" | "bills" | "health" | "entertainment" | "income" | "person" | "other"
    │       ├── merchant: string
    │       ├── person: string (only when category = "person")
    │       ├── paymentMethod: "cash" | "card" | "online"
    │       ├── date: Timestamp
    │       ├── description: string
    │       └── createdAt: Timestamp
    └── chats/
        └── {chatId}
            ├── title: string
            ├── messages: array
            ├── createdAt: Timestamp
            └── updatedAt: Timestamp
```

---

## 🚀 Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-username/spendly.git
cd spendly
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create a new project
2. Enable **Authentication** → Sign-in methods → **Email/Password** + **Google**
3. Create a **Firestore Database** in production mode
4. Apply security rules from `firestore.rules`
5. Go to **Project Settings** → Your Apps → Web App → copy config

### 3. Firebase App Check

1. In Firebase Console → **App Check** → Register your web app
2. Choose **reCAPTCHA v3** as the provider
3. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin) → register your site → copy the **site key**
4. Add the site key to `.env.local` (see Environment Variables below)
5. In Firebase Console → App Check → **Enforce** App Check for Firestore and Authentication

### 4. Gemini API Key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the key (starts with `AIza...`)

### 4. Environment Variables

Create `.env.local` in the project root:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase App Check (reCAPTCHA v3)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...

# Gemini AI
GEMINI_API_KEY=AIzaSy...
```

### 5. Firestore Security Rules

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🤖 AI Examples

### Transaction Logging

| Input | Type | Category | Person |
|---|---|---|---|
| `"Spent 500 on lunch"` | Outgoing | Food | — |
| `"Salary aayi 45000"` | Incoming | Income | — |
| `"Petrol dala 2000 ka"` | Outgoing | Transport | — |
| `"Meny Ali ko 400 diye"` | Outgoing | Person | Ali |
| `"Azhar ne mujhe 300 diye"` | Incoming | Person | Azhar |
| `"Bijli ka bill diya 2500"` | Outgoing | Bills | — |
| `"Meny sara sy 1000 liye khane ke liye"` | Incoming | Person | Sara |

### Report Generation

| Input | Action |
|---|---|
| `"Show my monthly report"` | Generates last 30 days report |
| `"Weekly spending summary"` | Generates last 7 days report |
| `"Mera report dikhao"` | Generates report in Roman Urdu |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Accent | Cyan `#22d3ee` |
| Income Color | Emerald `#34d399` |
| Expense Color | Rose `#fb7185` |
| Dark Background | Slate `#020617` |
| Light Background | `#f8fafc` |
| Heading Font | Syne |
| Body Font | DM Sans |
| Mono Font | JetBrains Mono |

---

## 📦 Deploy

```bash
# Vercel (recommended)
npx vercel --prod

# Or build locally
npm run build
npm start
```

---

## 📝 License

ISC © 2025 Spendly
