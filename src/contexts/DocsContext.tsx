
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationItem {
  title: string;
  slug: string;
  children?: NavigationItem[];
}

interface DocsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeVersion: string;
  setActiveVersion: (version: string) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigationData: Record<string, NavigationItem[]>;
  isLoading: boolean;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

interface DocsProviderProps {
  children: ReactNode;
}

export const DocsProvider: React.FC<DocsProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('program');
  const [activeVersion, setActiveVersion] = useState('v1');
  const [activePage, setActivePage] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  // Mock navigation data - در آینده از فایل‌های JSON خوانده می‌شود
  const navigationData: Record<string, NavigationItem[]> = {
    program: [
      {
        title: "مقدمه",
        slug: "intro",
        children: [
          { title: "شروع سریع", slug: "quick-start" },
          { title: "نصب و راه‌اندازی", slug: "installation" }
        ]
      },
      {
        title: "خودکارسازی",
        slug: "automation",
        children: [
          { title: "تکرارگر", slug: "iterator" },
          { title: "شرط‌ها", slug: "conditions" },
          { title: "متغیرها", slug: "variables" }
        ]
      }
    ],
    api: [
      {
        title: "مقدمه API",
        slug: "api-intro",
        children: [
          { title: "احراز هویت", slug: "authentication" },
          { title: "نرخ محدودیت", slug: "rate-limiting" }
        ]
      }
    ],
    app: [
      {
        title: "مقدمه اپلیکیشن",
        slug: "app-intro",
        children: [
          { title: "رابط کاربری", slug: "ui-guide" },
          { title: "تنظیمات", slug: "settings" }
        ]
      }
    ]
  };

  const value: DocsContextType = {
    activeTab,
    setActiveTab,
    activeVersion,
    setActiveVersion,
    activePage,
    setActivePage,
    searchQuery,
    setSearchQuery,
    navigationData,
    isLoading
  };

  return (
    <DocsContext.Provider value={value}>
      {children}
    </DocsContext.Provider>
  );
};

export const useDocs = () => {
  const context = useContext(DocsContext);
  if (context === undefined) {
    throw new Error('useDocs must be used within a DocsProvider');
  }
  return context;
};
