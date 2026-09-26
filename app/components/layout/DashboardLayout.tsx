'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../providers/ThemeProvider';
import { Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Get language preference
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang as 'en' | 'ar');
    }

    // TODO: Fetch user data
    setUser({ name: 'User', email: 'user@example.com' });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success(language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out');
    router.push('/auth/login');
  };

  const t = {
    en: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      newProject: 'New Project',
      scripts: 'Scripts',
      characters: 'Characters',
      scenes: 'Scenes',
      timeline: 'Timeline',
      export: 'Export',
      settings: 'Settings',
      apiConnections: 'API Connections',
      logout: 'Logout',
      profile: 'Profile',
    },
    ar: {
      dashboard: 'لوحة التحكم',
      projects: 'المشاريع',
      newProject: 'مشروع جديد',
      scripts: 'السيناريوهات',
      characters: 'الشخصيات',
      scenes: 'المشاهد',
      timeline: 'الجدول الزمني',
      export: 'التصدير',
      settings: 'الإعدادات',
      apiConnections: 'توصيل الـ APIs',
      logout: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
    },
  };

  const text = t[language];

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="text-2xl">🎬</div>
            {sidebarOpen && <span className="font-bold text-lg">AI Tools</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{language === 'ar' ? item.labelAr : item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-xl">⚙️</span>
            {sidebarOpen && <span className="text-sm font-medium">{text.settings}</span>}
          </Link>
          <Link
            href="/dashboard/api-connections"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-xl">🔌</span>
            {sidebarOpen && <span className="text-sm font-medium">{text.apiConnections}</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">{text.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {title && <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => {
                  setLanguage('en');
                  localStorage.setItem('language', 'en');
                }}
                className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  setLanguage('ar');
                  localStorage.setItem('language', 'ar');
                }}
                className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
                  language === 'ar'
                    ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                AR
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard', labelAr: 'لوحة التحكم' },
  { href: '/dashboard/projects', icon: '🎬', label: 'Projects', labelAr: 'المشاريع' },
  { href: '/dashboard/projects/new', icon: '➕', label: 'New Project', labelAr: 'مشروع جديد' },
  { href: '/dashboard/scripts', icon: '📝', label: 'Scripts', labelAr: 'السيناريوهات' },
  { href: '/dashboard/characters', icon: '🎭', label: 'Characters', labelAr: 'الشخصيات' },
  { href: '/dashboard/scenes', icon: '🎞️', label: 'Scenes', labelAr: 'المشاهد' },
  { href: '/dashboard/timeline', icon: '⏱️', label: 'Timeline', labelAr: 'الجدول الزمني' },
  { href: '/dashboard/export', icon: '📤', label: 'Export', labelAr: 'التصدير' },
];
