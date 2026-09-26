'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">🎬 AI Tools Library</div>
          <div className="space-x-4">
            <Link href="/auth/login" className="btn-secondary text-sm">
              دخول / Login
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm">
              إنشاء حساب / Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          منصة إنتاج الأفلام بالذكاء الاصطناعي
        </h1>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          AI-Powered Film & Video Generation Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          إنشاء أفلام واحترافية وفيديوهات مذهلة باستخدام الذكاء الاصطناعي. من الفكرة إلى الفيلم النهائي في منصة واحدة.
        </p>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Create stunning films and videos using AI. From idea to final production in one platform.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/register" className="btn-primary px-8 py-3 text-lg">
            ابدأ الآن / Get Started
          </Link>
          <Link href="#features" className="btn-secondary px-8 py-3 text-lg">
            تعرف أكثر / Learn More
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-title text-center">المميزات / Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="card p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {feature.titleAr} / {feature.titleEn}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.descAr}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Section */}
      <div className="bg-white dark:bg-slate-800 py-20 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">كيف يعمل / How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflow.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-semibold mb-2">{step.titleAr}</h3>
                <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">{step.titleEn}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">جاهز لبدء إنتاج أفلامك؟ / Ready to Create?</h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى آلاف الصناع اليوم / Join thousands of creators today
          </p>
          <Link href="/auth/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
            إنشاء حساب مجاني / Create Free Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">&copy; 2026 AI Tools Library. جميع الحقوق محفوظة / All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '🎬',
    titleAr: 'كاتب السيناريو',
    titleEn: 'AI Script Writer',
    descAr: 'توليد السيناريوهات والحوارات والقصص بذكاء اصطناعي',
    descEn: 'Generate scripts, dialogues, and stories with AI'
  },
  {
    icon: '🎥',
    titleAr: 'مولد الفيديو',
    titleEn: 'Video Generator',
    descAr: 'تحويل النصوص والصور إلى فيديوهات احترافية',
    descEn: 'Convert text and images to professional videos'
  },
  {
    icon: '🎭',
    titleAr: 'مكتبة الشخصيات',
    titleEn: 'Character Library',
    descAr: 'إنشاء وإدارة شخصيات متسقة عبر المشروع',
    descEn: 'Create and manage consistent characters'
  },
  {
    icon: '✂️',
    titleAr: 'استوديو المونتاج',
    titleEn: 'Editing Studio',
    descAr: 'تحرير احترافي مع جدول زمني متقدم',
    descEn: 'Professional editing with advanced timeline'
  },
  {
    icon: '🎵',
    titleAr: 'الموسيقى والصوت',
    titleEn: 'Audio & Music',
    descAr: 'إضافة موسيقى وتعليق صوتي وتأثيرات صوتية',
    descEn: 'Add music, voiceover, and sound effects'
  },
  {
    icon: '📤',
    titleAr: 'التصدير الذكي',
    titleEn: 'Smart Export',
    descAr: 'تصدير بصيغ مختلفة وجودة عالية',
    descEn: 'Export in multiple formats and quality levels'
  },
];

const workflow = [
  { titleAr: 'الفكرة', titleEn: 'Idea', desc: 'ابدأ برأس فكرة بسيطة' },
  { titleAr: 'السيناريو', titleEn: 'Script', desc: 'AI ينشئ السيناريو' },
  { titleAr: 'المشاهد', titleEn: 'Scenes', desc: 'قسم إلى مشاهد' },
  { titleAr: 'الإنتاج', titleEn: 'Production', desc: 'توليد الفيديو' },
  { titleAr: 'التصدير', titleEn: 'Export', desc: 'فيلم نهائي جاهز' },
];
