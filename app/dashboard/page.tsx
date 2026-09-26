'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Project {
  id: string;
  title: string;
  description?: string;
  genre: string;
  status: 'draft' | 'in_progress' | 'completed';
  duration: number;
  updatedAt: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const lang = localStorage.getItem('language') as 'en' | 'ar' | null;
    if (lang) setLanguage(lang);

    // TODO: Fetch projects from API
    // For now, show sample data
    setProjects([
      {
        id: '1',
        title: language === 'ar' ? 'فيلمي الأول' : 'My First Film',
        description: language === 'ar' ? 'فيلم درامي' : 'A dramatic film',
        genre: 'Drama',
        status: 'draft',
        duration: 30,
        updatedAt: new Date().toISOString(),
      },
    ]);
    setLoading(false);
  }, [language]);

  const t = {
    en: {
      welcome: 'Welcome to AI Tools Library',
      subtitle: 'Create stunning films and videos with AI',
      recentProjects: 'Recent Projects',
      noProjects: 'No projects yet. Create your first one!',
      newProject: 'New Project',
      stats: 'Statistics',
      totalProjects: 'Total Projects',
      completed: 'Completed',
      inProgress: 'In Progress',
      draft: 'Drafts',
      quickStart: 'Quick Start',
      createStory: 'Create Story',
      writeScript: 'Write Script',
      generateVideo: 'Generate Video',
      editTimeline: 'Edit Timeline',
      exportVideo: 'Export Video',
    },
    ar: {
      welcome: 'أهلاً بك في مكتبة أدوات الذكاء الاصطناعي',
      subtitle: 'أنشئ أفلاماً وفيديوهات مذهلة باستخدام الذكاء الاصطناعي',
      recentProjects: 'المشاريع الأخيرة',
      noProjects: 'لا توجد مشاريع حتى الآن. أنشئ مشروعك الأول!',
      newProject: 'مشروع جديد',
      stats: 'الإحصائيات',
      totalProjects: 'إجمالي المشاريع',
      completed: 'مكتمل',
      inProgress: 'قيد الإنجاز',
      draft: 'مسودات',
      quickStart: 'البدء السريع',
      createStory: 'إنشاء قصة',
      writeScript: 'كتابة سيناريو',
      generateVideo: 'توليد فيديو',
      editTimeline: 'تحرير الجدول الزمني',
      exportVideo: 'تصدير الفيديو',
    },
  };

  const text = t[language];

  const stats = [
    { label: text.totalProjects, value: projects.length },
    { label: text.completed, value: projects.filter((p) => p.status === 'completed').length },
    { label: text.inProgress, value: projects.filter((p) => p.status === 'in_progress').length },
    { label: text.draft, value: projects.filter((p) => p.status === 'draft').length },
  ];

  const quickStartItems = [
    { icon: '✍️', label: text.createStory, href: '#' },
    { icon: '📝', label: text.writeScript, href: '#' },
    { icon: '🎥', label: text.generateVideo, href: '#' },
    { icon: '✂️', label: text.editTimeline, href: '#' },
    { icon: '📤', label: text.exportVideo, href: '#' },
  ];

  return (
    <DashboardLayout title={text.welcome}>
      <div className="space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Hero Section */}
        <div className="card p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <h1 className="text-3xl font-bold mb-2">{text.welcome}</h1>
          <p className="text-blue-100">{text.subtitle}</p>
          <Link href="/dashboard/projects/new" className="inline-block mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            {text.newProject}
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="card p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div>
          <h2 className="section-title">{text.quickStart}</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {quickStartItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">{text.recentProjects}</h2>
            <Link href="/dashboard/projects" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">{text.noProjects}</p>
              <Link href="/dashboard/projects/new" className="btn-primary inline-block">
                {text.newProject}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div>
                      <span className="font-medium">Genre:</span> {project.genre}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {project.duration} min
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'badge-success';
    case 'in_progress':
      return 'badge-warning';
    case 'draft':
      return 'badge-primary';
    default:
      return 'badge-primary';
  }
}
