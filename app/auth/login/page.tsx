'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import getAPIClient from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const client = getAPIClient();
      const response = await client.login(email, password);

      if (response.success && response.data.token) {
        client.setToken(response.data.token);
        toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
        router.push('/dashboard');
      } else {
        toast.error(response.error?.message || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'));
      }
    } catch (error) {
      toast.error(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: 'Login',
      subtitle: 'Welcome back to AI Tools Library',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      noAccount: "Don't have an account?",
      register: 'Register here',
      loading: 'Logging in...',
    },
    ar: {
      title: 'دخول',
      subtitle: 'أهلاً بعودتك إلى مكتبة أدوات الذكاء الاصطناعي',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      login: 'دخول',
      noAccount: 'ليس لديك حساب؟',
      register: 'سجل هنا',
      loading: 'جاري تسجيل الدخول...',
    },
  };

  const text = t[language];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎬</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{text.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{text.subtitle}</p>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              language === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              language === 'ar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            العربية
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {text.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {text.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 font-semibold"
          >
            {loading ? text.loading : text.login}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          {text.noAccount}{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            {text.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
