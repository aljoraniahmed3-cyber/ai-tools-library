'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import getAPIClient from '@/lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error(language === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const client = getAPIClient();
      const response = await client.register(email, name, password);

      if (response.success && response.data.token) {
        client.setToken(response.data.token);
        toast.success(language === 'ar' ? 'تم الإنشاء بنجاح' : 'Account created successfully');
        router.push('/dashboard');
      } else {
        toast.error(response.error?.message || (language === 'ar' ? 'فشل الإنشاء' : 'Registration failed'));
      }
    } catch (error) {
      toast.error(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: 'Create Account',
      subtitle: 'Join AI Tools Library today',
      name: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      register: 'Create Account',
      haveAccount: 'Already have an account?',
      login: 'Login here',
      loading: 'Creating account...',
      passwordHint: 'At least 8 characters',
    },
    ar: {
      title: 'إنشاء حساب',
      subtitle: 'انضم إلى مكتبة أدوات الذكاء الاصطناعي اليوم',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      register: 'إنشاء حساب',
      haveAccount: 'هل لديك حساب بالفعل؟',
      login: 'سجل دخول هنا',
      loading: 'جاري إنشاء الحساب...',
      passwordHint: 'على الأقل 8 أحرف',
    },
  };

  const text = t[language];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {text.name}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'ar' ? 'أحمد محمد' : 'John Doe'}
              className="input-field"
              required
            />
          </div>

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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{text.passwordHint}</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {text.confirmPassword}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 font-semibold mt-6"
          >
            {loading ? text.loading : text.register}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          {text.haveAccount}{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            {text.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
