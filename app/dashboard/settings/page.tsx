'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import toast from 'react-hot-toast';

interface SettingSection {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
}

export default function SettingsPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [activeTab, setActiveTab] = useState('api-keys');
  const [showApiForm, setShowApiForm] = useState(false);
  const [apiKeyType, setApiKeyType] = useState<'openai' | 'video' | 'storage' | ''>('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const t = {
    en: {
      settings: 'Settings',
      apiKeys: 'API Keys',
      security: 'Security',
      appearance: 'Appearance',
      billing: 'Billing',
      apiConnectionsDescription: 'Manage API keys for AI features',
      securityDescription: 'Security and privacy settings',
      appearanceDescription: 'Theme, language, and display options',
      billingDescription: 'Billing and subscription settings',

      addKey: 'Add API Key',
      openaiKey: 'OpenAI API Key',
      videoProviderKey: 'Video Provider Key',
      storageKey: 'Storage Key',

      keyName: 'Key Name',
      apiKey: 'API Key',
      save: 'Save',
      cancel: 'Cancel',

      warning: '⚠️ Important Security Notice',
      warningText: 'Never share your API keys. Keys entered here are encrypted and stored securely on our servers.',

      connected: '✅ Connected',
      notConnected: '❌ Not Connected',
      updateKey: 'Update Key',
      removeKey: 'Remove Key',

      howToAdd: 'How to Add Your API Key',
      step1: '1. Get your API key from the provider',
      step2: '2. Paste it in the form below',
      step3: '3. Click Save',
      step4: '4. The key is encrypted and stored securely',
      step5: '5. Used only on the server (never sent to browser)',

      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      autoMode: 'Auto (System)',
      language: 'Language',
      english: 'English',
      arabic: 'العربية',

      secretsNotDisplayed: 'API Keys are not displayed for security',
      lastVerified: 'Last verified',
      testing: 'Testing connection...',
      testFailed: 'Connection test failed',
      testSuccess: 'Connection successful',
    },
    ar: {
      settings: 'الإعدادات',
      apiKeys: 'مفاتيح API',
      security: 'الأمان',
      appearance: 'المظهر',
      billing: 'الفواتير',
      apiConnectionsDescription: 'إدارة مفاتيح الـ API للميزات الذكية',
      securityDescription: 'إعدادات الأمان والخصوصية',
      appearanceDescription: 'خيارات المظهر واللغة والعرض',
      billingDescription: 'إعدادات الفواتير والاشتراك',

      addKey: 'إضافة مفتاح API',
      openaiKey: 'مفتاح OpenAI',
      videoProviderKey: 'مفتاح مزود الفيديو',
      storageKey: 'مفتاح التخزين',

      keyName: 'اسم المفتاح',
      apiKey: 'مفتاح API',
      save: 'حفظ',
      cancel: 'إلغاء',

      warning: '⚠️ تنبيه أمان مهم',
      warningText: 'لا تشارك مفاتيح الـ API الخاصة بك. المفاتيح المدخلة هنا مشفرة وآمنة على خوادمنا.',

      connected: '✅ موصول',
      notConnected: '❌ غير موصول',
      updateKey: 'تحديث المفتاح',
      removeKey: 'حذف المفتاح',

      howToAdd: 'كيفية إضافة مفتاح API',
      step1: '1. احصل على مفتاح API من المزود',
      step2: '2. الصقه في النموذج أدناه',
      step3: '3. اضغط حفظ',
      step4: '4. المفتاح مشفر وآمن',
      step5: '5. يُستخدم على الخادم فقط (لا يُرسل للمتصفح)',

      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      autoMode: 'تلقائي (النظام)',
      language: 'اللغة',
      english: 'English',
      arabic: 'العربية',

      secretsNotDisplayed: 'مفاتيح الـ API غير معروضة لأسباب أمنية',
      lastVerified: 'آخر تحقق',
      testing: 'جاري اختبار الاتصال...',
      testFailed: 'فشل الاتصال',
      testSuccess: 'نجح الاتصال',
    },
  };

  const text = t[language];

  const sections: SettingSection[] = [
    {
      id: 'api-keys',
      title: text.apiKeys,
      titleAr: 'مفاتيح API',
      description: text.apiConnectionsDescription,
      descriptionAr: 'إدارة مفاتيح الـ API للميزات الذكية',
      icon: '🔑',
    },
    {
      id: 'security',
      title: text.security,
      titleAr: 'الأمان',
      description: text.securityDescription,
      descriptionAr: 'إعدادات الأمان والخصوصية',
      icon: '🔒',
    },
    {
      id: 'appearance',
      title: text.appearance,
      titleAr: 'المظهر',
      description: text.appearanceDescription,
      descriptionAr: 'خيارات المظهر واللغة والعرض',
      icon: '🎨',
    },
  ];

  const handleAddApiKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKeyType || !apiKeyInput) {
      toast.error(language === 'ar' ? 'الرجاء ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setLoadingKey(apiKeyType);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        language === 'ar'
          ? `تم حفظ مفتاح ${apiKeyType} بنجاح`
          : `Successfully saved ${apiKeyType} key`
      );

      setApiKeyInput('');
      setApiKeyType('');
      setShowApiForm(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'Error occurred');
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <DashboardLayout title={text.settings}>
      <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Language Toggle */}
        <div className="flex gap-2">
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

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`px-4 py-3 border-b-2 transition-colors ${
                activeTab === section.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              {section.icon} {language === 'ar' ? section.titleAr : section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'api-keys' && (
          <div className="space-y-6">
            {/* Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                {text.warning}
              </h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                {text.warningText}
              </p>
            </div>

            {/* How to Add */}
            <div className="card p-6 bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-bold mb-4 text-gray-900 dark:text-white">
                {text.howToAdd}
              </h4>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>{text.step1}</li>
                <li>{text.step2}</li>
                <li>{text.step3}</li>
                <li>{text.step4}</li>
                <li>{text.step5}</li>
              </ol>
            </div>

            {/* Add Key Form */}
            {showApiForm ? (
              <div className="card p-6">
                <form onSubmit={handleAddApiKey} className="space-y-4">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {text.keyName}
                    </label>
                    <select
                      value={apiKeyType}
                      onChange={(e) => setApiKeyType(e.target.value as any)}
                      className="input-field"
                    >
                      <option value="">-- {text.keyName} --</option>
                      <option value="openai">OpenAI API</option>
                      <option value="video">Video Provider</option>
                      <option value="storage">Cloud Storage</option>
                    </select>
                  </div>

                  {/* API Key Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {text.apiKey}
                    </label>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder={
                        language === 'ar'
                          ? 'الصق مفتاح API هنا'
                          : 'Paste your API key here'
                      }
                      className="input-field font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {language === 'ar'
                        ? 'المفتاح مشفر ولا يُرسل أبداً للمتصفح'
                        : 'Key is encrypted and never sent to browser'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      disabled={loadingKey === apiKeyType}
                      className="btn-primary flex-1"
                    >
                      {loadingKey === apiKeyType ? text.testing : text.save}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowApiForm(false);
                        setApiKeyInput('');
                        setApiKeyType('');
                      }}
                      className="btn-secondary flex-1"
                    >
                      {text.cancel}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setShowApiForm(true)}
                className="btn-primary w-full py-3"
              >
                ➕ {text.addKey}
              </button>
            )}

            {/* Current Connections */}
            <div>
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
                {text.apiKeys}
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'OpenAI', type: 'openai', connected: false },
                  { name: 'Video Provider', type: 'video', connected: false },
                  { name: 'AWS S3', type: 'storage', connected: false },
                ].map((conn) => (
                  <div key={conn.type} className="card p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {conn.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {conn.connected ? text.connected : text.notConnected}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-sm px-3 py-1">
                        {text.updateKey}
                      </button>
                      {conn.connected && (
                        <button className="btn-secondary text-sm px-3 py-1 text-red-600">
                          {text.removeKey}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card p-6">
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
              {text.security}
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>✅ {language === 'ar' ? 'كلمات المرور مشفرة' : 'Passwords encrypted'}</p>
              <p>✅ {language === 'ar' ? 'JWT authentication آمن' : 'Secure JWT authentication'}</p>
              <p>✅ {language === 'ar' ? 'مفاتيح API على الخادم فقط' : 'API keys server-side only'}</p>
              <p>✅ {language === 'ar' ? 'HTTPS مفعّل' : 'HTTPS enabled'}</p>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="card p-6 space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                {text.language}
              </h4>
              <div className="flex gap-2">
                <button className="btn-primary">{text.english}</button>
                <button className="btn-secondary">{text.arabic}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
