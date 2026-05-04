'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Bot } from 'lucide-react';
import { useAuth } from '../../lib/hooks/useAuth';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import ChatInterface from '../chat/ChatInterface';
import TransactionList from './TransactionList';
import AddExpenseModal from './AddExpenseModal';
import KhataPage from './KhataPage';
import SplashScreen from '../ui/SplashScreen';

export default function DashboardShell() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab]     = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  if (authLoading) return <SplashScreen label="Loading dashboard" />;

  if (!user) return null;

  return (
    <div className="h-screen flex relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#f0f9ff', border: '1px solid rgba(34,211,238,0.15)', fontSize: '13px' },
        }}
      />

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full blur-[120px]" style={{ background: 'rgba(34,211,238,0.04)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px]" style={{ background: 'rgba(45,212,191,0.03)' }} />
        <div className="grid-bg absolute inset-0" />
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onManualAdd={() => setShowAddModal(true)}
        onOpenChat={() => setActiveTab('chat')}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 lg:ml-64 relative z-10 min-h-screen overflow-y-auto">
        {activeTab === 'overview' && (
          <DashboardOverview
            onManualAdd={() => setShowAddModal(true)}
            onMenuClick={() => setSidebarOpen(true)}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionList onMenuClick={() => setSidebarOpen(true)} />
        )}
        {activeTab === 'chat' && (
          <ChatInterface onMenuClick={() => setSidebarOpen(true)} />
        )}
        {activeTab === 'khata' && (
          <KhataPage onMenuClick={() => setSidebarOpen(true)} />
        )}
      </main>

      {showAddModal && <AddExpenseModal onClose={() => setShowAddModal(false)} />}

      {/* Floating Bot Button — opens chat as full page */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => setActiveTab('chat')}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg,#22d3ee,#0891b2)',
            boxShadow: '0 0 24px rgba(34,211,238,0.4), 0 4px 20px rgba(0,0,0,0.3)',
          }}
          title="AI Logger"
        >
          <Bot size={24} className="text-slate-950" />
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#22d3ee' }} />
        </button>
      )}
    </div>
  );
}
