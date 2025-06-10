import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TabConfig } from '@/types/tabs';
import { 
  createMdFile, 
  readMdFile, 
  updateMdFile, 
  deleteMdFile, 
  initializeDefaultFiles,
  copyVersionFiles,
  deleteVersionFiles,
  renameVersionFiles
} from '@/utils/fileManager';

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
  versions: string[];
  addVersion: (version: string) => void;
  updateVersion: (oldVersion: string, newVersion: string) => void;
  deleteVersion: (version: string) => void;
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

  // Version management
  const [versions, setVersions] = useState<string[]>(['v1', 'v2']);

  // Initialize MD files and page contents
  const [pageContents, setPageContents] = useState<Record<string, PageContent>>({});

  useEffect(() => {
    // Initialize default MD files for default version
    initializeDefaultFiles(activeVersion);

    // Load page contents from MD files
    const defaultPages = {
      intro: {
        title: "مقدمه‌ای بر خودکارینو",
        slug: "intro",
        tab: "program",
        fileName: "introduction.md",
        filePath: `docs/${activeVersion}/program/introduction.md`
      },
      "quick-start": {
        title: "شروع سریع",
        slug: "quick-start",
        tab: "program",
        fileName: "quick-start.md",
        filePath: `docs/${activeVersion}/program/quick-start.md`
      },
      iterator: {
        title: "تکرارگر (Iterator)",
        slug: "iterator",
        tab: "program",
        fileName: "iterator.md",
        filePath: `docs/${activeVersion}/program/iterator.md`
      },
      "api-intro": {
        title: "مقدمه API",
        slug: "api-intro",
        tab: "api",
        fileName: "api-intro.md",
        filePath: `docs/${activeVersion}/api/api-intro.md`
      },
      "app-intro": {
        title: "مقدمه اپلیکیشن",
        slug: "app-intro",
        tab: "app",
        fileName: "app-intro.md",
        filePath: `docs/${activeVersion}/app/app-intro.md`
      }
    };

    const loadedContents: Record<string, PageContent> = {};
    Object.entries(defaultPages).forEach(([slug, pageInfo]) => {
      const content = readMdFile(pageInfo.filePath) || '';
      loadedContents[slug] = {
        ...pageInfo,
        content
      };
    });

    setPageContents(loadedContents);
  }, [activeVersion]);

  // Mock navigation data
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
    // حذف تمام صفحات و فایل‌های مربوط به این تب
    Object.values(pageContents).forEach(page => {
      if (page.tab === id && page.filePath) {
        deleteMdFile(page.filePath);
      }
    });

    // حذف تب از لیست
    setTabs(prev => prev.filter(tab => tab.id !== id));
    
    // حذف navigation data
    setNavigationData(prev => {
      const newNav = { ...prev };
      delete newNav[id];
      return newNav;
    });

    // حذف محتوای صفحات
    setPageContents(prev => {
      const newContents = { ...prev };
      Object.keys(newContents).forEach(slug => {
        if (newContents[slug].tab === id) {
          delete newContents[slug];
        }
      });
      return newContents;
    });
    
    // اگر تب فعال حذف شد، به تب اول برو
    if (activeTab === id) {
      setActiveTab(tabs.find(t => t.id !== id)?.id || 'program');
    }
  };

  const updatePageContent = (slug: string, content: string, title?: string) => {
    const page = pageContents[slug];
    if (page?.filePath) {
      updateMdFile(page.filePath, content);
    }

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
      const filePath = `docs/${activeVersion}/${tab}/${finalFileName}.md`;
      
      const defaultContent = `# ${title}

این صفحه جدید ایجاد شده است. محتوای خود را اینجا بنویسید...

## شروع کنید

از ویرایشگر متن برای نوشتن محتوای خود استفاده کنید.

### نکات:
- از Markdown برای فرمت‌بندی استفاده کنید
- کدها را در بلوک‌های مخصوص قرار دهید
- تصاویر و لینک‌ها را اضافه کنید`;

      // ایجاد فایل MD
      createMdFile(filePath, defaultContent);

      const newPage: PageContent = {
        title,
        slug: finalSlug,
        tab,
        fileName: `${finalFileName}.md`,
        filePath,
        content: defaultContent
      };

      setPageContents(prev => ({
        ...prev,
        [finalSlug]: newPage
      }));
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
      deleteMdFile(page.filePath);
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

  // Version management functions
  const addVersion = (version: string) => {
    // Copy files from current version to new version
    copyVersionFiles(activeVersion, version);
    
    setVersions(prev => [...prev, version]);
    
    // Switch to new version
    setActiveVersion(version);
  };

  const updateVersion = (oldVersion: string, newVersion: string) => {
    // Rename files in file system
    renameVersionFiles(oldVersion, newVersion);
    
    // Update versions list
    setVersions(prev => prev.map(v => v === oldVersion ? newVersion : v));
    
    // Update active version if it was the one being edited
    if (activeVersion === oldVersion) {
      setActiveVersion(newVersion);
    }
    
    // Update page contents paths
    setPageContents(prev => {
      const newContents: Record<string, PageContent> = {};
      Object.entries(prev).forEach(([slug, content]) => {
        if (content.filePath?.includes(`docs/${oldVersion}/`)) {
          newContents[slug] = {
            ...content,
            filePath: content.filePath.replace(`docs/${oldVersion}/`, `docs/${newVersion}/`)
          };
        } else {
          newContents[slug] = content;
        }
      });
      return newContents;
    });
  };

  const deleteVersion = (version: string) => {
    if (versions.length === 1) return; // Don't delete the last version
    
    // Delete all files for this version
    deleteVersionFiles(version);
    
    // Remove from versions list
    setVersions(prev => prev.filter(v => v !== version));
    
    // Switch to first available version if current version is deleted
    if (activeVersion === version) {
      const remainingVersions = versions.filter(v => v !== version);
      setActiveVersion(remainingVersions[0]);
    }
    
    // Remove page contents for this version
    setPageContents(prev => {
      const newContents: Record<string, PageContent> = {};
      Object.entries(prev).forEach(([slug, content]) => {
        if (!content.filePath?.includes(`docs/${version}/`)) {
          newContents[slug] = content;
        }
      });
      return newContents;
    });
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
    deleteTab,
    versions,
    addVersion,
    updateVersion,
    deleteVersion
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
