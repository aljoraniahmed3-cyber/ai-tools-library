'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/components/layout/DashboardLayout';
import toast from 'react-hot-toast';

interface Connection {
  id: string;
  type: string;
  provider: string;
  isActive: boolean;
  lastVerified?: string;
}

export default function APIConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const lang = localStorage.getItem('language') as 'en' | 'ar' | null;
    if (lang) setLanguage(lang);

    // Load connections status
    loadConnections();
  }, []);

  const loadConnections = async () => {
    // TODO: Fetch from API
    // For now, show demo data
    setConnections([
      {
        id: '1',
        type: 'openai',
        provider: 'OpenAI',
        isActive: !!process.env.NEXT_PUBLIC_OPENAI_CONFIGURED,
        lastVerified: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'video_provider',
        provider: 'Sora Alternative',
        isActive: false,
        lastVerified: undefined,
      },
      {
        id: '3',
        type: 'voice_provider',
        provider: 'OpenAI TTS',
        isActive: false,
        lastVerified: undefined,
      },
      {
        id: '4',
        type: 'storage',
        provider: 'AWS S3',
        isActive: false,
        lastVerified: undefined,
      },
    ]);
  };

  const handleConnect = async (type: string, provider: string) => {
    if (type === 'openai') {
      toast.error(language === 'ar'
        ? 'أضف OPENAI_API_KEY إلى ملف .env.local على جهازك ثم أعد تشغيل التطبيق'
        : 'Add OPENAI_API_KEY to .env.local on your computer and restart the app');
      return;
    }

    toast.info(language === 'ar'
      ? `قريباً: واجهة ربط ${provider}`
      : `Coming soon: ${provider} integration UI`);
  };

  const t = {
    en: {
      title: 'API Connections',
      subtitle: 'Manage your API keys and integrations',
      connect: 'Connect',
      connected: 'Connected',
      notConnected: 'Not Connected',
      verify: 'Verify',
      disconnect: 'Disconnect',
      lastVerified: 'Last verified',
      status: 'Status',
      warning: 'Never share your API keys. Always store them in .env.local',
    },
    ar: {
      title: 'توصيل الـ APIs',
      subtitle: 'أدر مفاتيح الـ API الخاصة بك والتكاملات',
      connect: 'ربط',
      connected: 'موصول',
      notConnected: 'غير موصول',
      verify: 'تحقق',
      disconnect: 'قطع الاتصال',
      lastVerified: 'آخر تحقق',
      status: 'الحالة',
      warning: 'لا تشارك مفاتيح الـ API الخاصة بك. احفظها دائماً في .env.local',
    },
  };

  const text = t[language];

  const categories = [
    {
      title: language === 'ar' ? 'الـ AI' : 'AI Services',
      connections: connections.filter((c) => c.type === 'openai'),
    },
    {
      title: language === 'ar' ? 'توليد الفيديو' : 'Video Generation',
      connections: connections.filter((c) => c.type === 'video_provider'),
    },
    {
      title: language === 'ar' ? 'الصوت والموسيقى' : 'Voice & Audio',
      connections: connections.filter((c) => c.type === 'voice_provider'),
    },
    {
      title: language === 'ar' ? 'التخزين السحابي' : 'Cloud Storage',
      connections: connections.filter((c) => c.type === 'storage'),
    },
  ];

  return (
    <DashboardLayout title={text.title}>
      <div className="space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            ⚠️ {text.warning}
          </p>
        </div>

        {/* Connections */}
        {categories.map((category, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {category.title}
            </h2>

            <div className="space-y-3">
              {category.connections.map((conn) => (
                <div key={conn.id} className="card p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {conn.provider}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          conn.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {conn.isActive ? text.connected : text.notConnected}
                      </span>
                      {conn.lastVerified && (
                        <span className="text-xs text-gray-500">
                          ({text.lastVerified}:{' '}
                          {new Date(conn.lastVerified).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {conn.isActive ? (
                      <>
                        <button className="btn-secondary text-sm px-3 py-1">
                          {text.verify}
                        </button>
                        <button className="btn-secondary text-sm px-3 py-1 text-red-600">
                          {text.disconnect}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(conn.type, conn.provider)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        {text.connect}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Instructions */}
        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
            {language === 'ar' ? 'كيفية الربط' : 'How to Connect'}
          </h3>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>
              {language === 'ar'
                ? 'احصل على مفتاح API من خدمة الطرف الثالث'
                : 'Get API key from the service provider'}
            </li>
            <li>
              {language === 'ar'
                ? 'أضفه إلى ملف .env.local على جهازك'
                : 'Add it to .env.local on your computer'}
            </li>
            <li>
              {language === 'ar'
                ? 'أعد تشغيل التطبيق'
                : 'Restart the application'}
            </li>
            <li>
              {language === 'ar'
                ? 'سيظهر الاتصال كـ "موصول" هنا'
                : 'The connection will show as "Connected" here'}
            </li>
          </ol>
        </div>

        {/* Security Note */}
        <div className="card p-6 border-2 border-purple-200 dark:border-purple-800">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
            🔒 {language === 'ar' ? 'أمان' : 'Security'}
          </h3>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>
              {language === 'ar'
                ? 'جميع مفاتيح API تُستخدم على الخادم فقط'
                : 'All API keys are used on the server only'}
            </li>
            <li>
              {language === 'ar'
                ? 'لا تُرسل المفاتيح إلى المتصفح'
                : 'Keys are never sent to the browser'}
            </li>
            <li>
              {language === 'ar'
                ? 'استخدم متغيرات البيئة للتخزين الآمن'
                : 'Use environment variables for secure storage'}
            </li>
            <li>
              {language === 'ar'
                ? 'دوّر المفاتيح بانتظام'
                : 'Rotate keys regularly'}
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
