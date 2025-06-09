
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TabConfig } from '@/types/tabs';

interface NavigationItem {
  title: string;
  slug: string;
  children?: NavigationItem[];
}

interface PageContent {
  title: string;
  content: string;
  slug: string;
  tab: string;
  fileName?: string;
  filePath?: string;
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
  setNavigationData: (data: Record<string, NavigationItem[]>) => void;
  isLoading: boolean;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  pageContents: Record<string, PageContent>;
  updatePageContent: (slug: string, content: string, title?: string) => void;
  createNewPage: (title: string, tab: string, parentSlug?: string, type?: "page" | "folder", fileName?: string) => string;
  deletePage: (slug: string) => void;
  tabs: TabConfig[];
  addTab: (label: string, icon: string) => void;
  updateTab: (id: string, label: string, icon: string) => void;
  deleteTab: (id: string) => void;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

interface DocsProviderProps {
  children: ReactNode;
}

export const DocsProvider: React.FC<DocsProviderProps> = ({ children }) => {
  // تب‌های پیش‌فرض
  const defaultTabs: TabConfig[] = [
    { id: 'program', label: 'برنامه', icon: '🔄', isCustom: false },
    { id: 'api', label: 'API', icon: '🔌', isCustom: false },
    { id: 'app', label: 'اپلیکیشن', icon: '📱', isCustom: false }
  ];

  const [tabs, setTabs] = useState<TabConfig[]>(defaultTabs);
  const [activeTab, setActiveTab] = useState('program');
  const [activeVersion, setActiveVersion] = useState('v1');
  const [activePage, setActivePage] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // محتوای صفحات - در آینده از فایل‌های JSON خوانده می‌شود
  const [pageContents, setPageContents] = useState<Record<string, PageContent>>({
    intro: {
      title: "مقدمه‌ای بر خودکارینو",
      slug: "intro",
      tab: "program",
      fileName: "introduction.md",
      filePath: "docs/program/introduction.md",
      content: `# مقدمه‌ای بر خودکارینو

خوش آمدید به مستندات جامع **خودکارینو**! این پلتفرم قدرتمند برای ایجاد و مدیریت خودکارسازی‌های پیشرفته طراحی شده است.

## ویژگی‌های کلیدی

### 🔄 خودکارسازی هوشمند
- ایجاد فرآیندهای خودکار پیچیده
- پشتیبانی از شرط‌ها و حلقه‌ها
- تعامل با API های مختلف

### 📊 مانیتورینگ و گزارش‌گیری
- ردیابی عملکرد خودکارسازی‌ها
- گزارش‌های تفصیلی
- هشدارهای هوشمند

### 🎯 سادگی استفاده
رابط کاربری بصری و بدون نیاز به کدنویسی

\`\`\`javascript
// مثال کد ساده
const automation = {
  name: "خودکارسازی نمونه",
  trigger: "webhook",
  actions: ["send_email", "update_database"]
};
\`\`\`

> **نکته:** این فقط یک نمونه از قابلیت‌های خودکارینو است. برای اطلاعات بیشتر بخش‌های مختلف را مطالعه کنید.`
    },
    "quick-start": {
      title: "شروع سریع",
      slug: "quick-start",
      tab: "program",
      fileName: "quick-start.md",
      filePath: "docs/program/quick-start.md",
      content: `# شروع سریع

در این بخش نحوه شروع کار با خودکارینو را یاد می‌گیرید.

## مرحله ۱: ایجاد حساب کاربری

ابتدا باید در پلتفرم خودکارینو ثبت‌نام کنید:

1. به صفحه ثبت‌نام بروید
2. اطلاعات خود را وارد کنید
3. ایمیل تأیید را چک کنید

## مرحله ۲: اولین خودکارسازی

\`\`\`python
# نمونه کد Python برای API
import requests

response = requests.post('https://api.khodkarino.com/automation', {
    'name': 'اولین خودکارسازی من',
    'trigger': 'schedule'
})
\`\`\`

### نکات مهم:
- ✅ همیشه API key خود را محرمانه نگه دارید
- ✅ تست کردن خودکارسازی قبل از اجرای نهایی
- ⚠️ محدودیت‌های نرخ API را رعایت کنید`
    },
    iterator: {
      title: "تکرارگر (Iterator)",
      slug: "iterator", 
      tab: "program",
      fileName: "iterator.md",
      filePath: "docs/program/iterator.md",
      content: `# تکرارگر (Iterator)

تکرارگر یکی از قدرتمندترین ابزارهای خودکارینو است که امکان تکرار اقدامات روی مجموعه‌ای از داده‌ها را فراهم می‌کند.

## نحوه کارکرد

تکرارگر روی هر آیتم در یک آرایه یا لیست عمل می‌کند:

\`\`\`json
{
  "iterator": {
    "input": ["آیتم ۱", "آیتم ۲", "آیتم ۳"],
    "actions": [
      {
        "type": "process_item",
        "value": "{{item}}"
      }
    ]
  }
}
\`\`\`

## مثال عملی

فرض کنید لیستی از ایمیل‌ها داریم و می‌خواهیم برای هر کدام ایمیل ارسال کنیم:

\`\`\`javascript
const emails = ['user1@example.com', 'user2@example.com'];

emails.forEach(email => {
  sendEmail({
    to: email,
    subject: 'خوش آمدید',
    body: 'سلام و به خودکارینو خوش آمدید!'
  });
});
\`\`\`

> **توجه:** تکرارگر محدودیت حداکثر ۱۰۰۰ آیتم در هر اجرا دارد.`
    }
  });

  // Mock navigation data - در آینده از فایل‌های JSON خوانده می‌شود
  const [navigationData, setNavigationData] = useState<Record<string, NavigationItem[]>>({
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
  });

  // مدیریت تب‌ها
  const addTab = (label: string, icon: string) => {
    const newTab: TabConfig = {
      id: `custom-${Date.now()}`,
      label,
      icon,
      isCustom: true
    };
    setTabs(prev => [...prev, newTab]);
    setNavigationData(prev => ({
      ...prev,
      [newTab.id]: []
    }));
  };

  const updateTab = (id: string, label: string, icon: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === id ? { ...tab, label, icon } : tab
    ));
  };

  const deleteTab = (id: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== id));
    setNavigationData(prev => {
      const newNav = { ...prev };
      delete newNav[id];
      return newNav;
    });
    
    // اگر تب فعال حذف شد، به تب اول برو
    if (activeTab === id) {
      setActiveTab(tabs.find(t => t.id !== id)?.id || 'program');
    }
  };

  const updatePageContent = (slug: string, content: string, title?: string) => {
    setPageContents(prev => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        content,
        ...(title && { title })
      }
    }));
  };

  const createNewPage = (title: string, tab: string, parentSlug?: string, type: "page" | "folder" = "page", fileName?: string): string => {
    const slug = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/[\u0600-\u06FF]/g, (match) => {
        return encodeURIComponent(match).replace(/%/g, '');
      });
    
    const finalSlug = `${slug}-${Date.now()}`;
    
    if (type === "page") {
      const finalFileName = fileName || finalSlug;
      const filePath = `docs/${tab}/${finalFileName}.md`;
      
      const newPage: PageContent = {
        title,
        slug: finalSlug,
        tab,
        fileName: `${finalFileName}.md`,
        filePath,
        content: `# ${title}

این صفحه جدید ایجاد شده است. محتوای خود را اینجا بنویسید...

## شروع کنید

از ویرایشگر متن برای نوشتن محتوای خود استفاده کنید.

### نکات:
- از Markdown برای فرمت‌بندی استفاده کنید
- کدها را در بلوک‌های مخصوص قرار دهید
- تصاویر و لینک‌ها را اضافه کنید`
      };

      setPageContents(prev => ({
        ...prev,
        [finalSlug]: newPage
      }));

      console.log(`فایل ${filePath} ایجاد شد`);
    }

    // Add to navigation structure
    const newNavItem: NavigationItem = {
      title,
      slug: finalSlug,
      ...(type === "folder" && { children: [] })
    };

    setNavigationData(prev => {
      const newNav = { ...prev };
      
      if (parentSlug) {
        // Add as child to parent
        const addToParent = (items: NavigationItem[]): NavigationItem[] => {
          return items.map(item => {
            if (item.slug === parentSlug) {
              return {
                ...item,
                children: [...(item.children || []), newNavItem]
              };
            }
            if (item.children) {
              return {
                ...item,
                children: addToParent(item.children)
              };
            }
            return item;
          });
        };
        
        newNav[tab] = addToParent(newNav[tab] || []);
      } else {
        // Add to root level
        newNav[tab] = [...(newNav[tab] || []), newNavItem];
      }
      
      return newNav;
    });

    return finalSlug;
  };

  const deletePage = (slug: string) => {
    const page = pageContents[slug];
    if (page?.filePath) {
      console.log(`فایل ${page.filePath} حذف شد`);
    }

    setPageContents(prev => {
      const newContents = { ...prev };
      delete newContents[slug];
      return newContents;
    });

    // Remove from navigation recursively
    setNavigationData(prev => {
      const newNav = { ...prev };
      
      const removeFromTree = (items: NavigationItem[]): NavigationItem[] => {
        return items
          .filter(item => item.slug !== slug)
          .map(item => ({
            ...item,
            children: item.children ? removeFromTree(item.children) : undefined
          }));
      };

      Object.keys(newNav).forEach(tab => {
        newNav[tab] = removeFromTree(newNav[tab]);
      });
      
      return newNav;
    });

    // If deleted page was active, switch to intro
    if (activePage === slug) {
      setActivePage('intro');
    }
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
    setNavigationData,
    isLoading,
    isEditMode,
    setIsEditMode,
    pageContents,
    updatePageContent,
    createNewPage,
    deletePage,
    tabs,
    addTab,
    updateTab,
    deleteTab
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
