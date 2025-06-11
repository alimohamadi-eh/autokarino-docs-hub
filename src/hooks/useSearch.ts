
import { useState, useMemo, useCallback } from 'react';
import removeMd from 'remove-markdown';
import { useDocs } from '@/contexts/DocsContext';

interface SearchableItem {
  title: string;
  content: string;
  slug: string;
  tab: string;
  version: string;
  path: string;
}

interface SearchResult extends SearchableItem {
  snippet?: string;
  score?: number;
}

export const useSearch = () => {
  const { pageContents, activeVersion, tabs } = useDocs();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // تبدیل محتوای صفحات به فرمت قابل جستجو
  const searchableItems = useMemo(() => {
    const items: SearchableItem[] = [];
    
    Object.values(pageContents).forEach(page => {
      if (page.content) {
        // حذف markdown syntax و تبدیل به متن ساده
        const plainContent = removeMd(page.content);
        
        // ایجاد path برای صفحه
        const tabLabel = tabs.find(t => t.id === page.tab)?.label || page.tab;
        const path = `/${page.tab}/${page.slug}`;
        
        items.push({
          title: page.title,
          content: plainContent,
          slug: page.slug,
          tab: page.tab,
          version: activeVersion,
          path
        });
      }
    });
    
    return items;
  }, [pageContents, activeVersion, tabs]);

  // تابع برای ایجاد snippet از محل یافت‌شده
  const createSnippet = useCallback((item: SearchableItem, matchIndex: number) => {
    const start = Math.max(matchIndex - 40, 0);
    const end = Math.min(matchIndex + 40, item.content.length);
    
    let snippet = item.content.slice(start, end);
    
    // اضافه کردن ... در ابتدا و انتها در صورت نیاز
    if (start > 0) snippet = '...' + snippet;
    if (end < item.content.length) snippet = snippet + '...';
    
    return snippet;
  }, []);

  // تابع جستجو ساده
  const search = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }
    
    setIsSearching(true);
    
    try {
      const normalizedQuery = searchQuery.toLowerCase();
      const results: SearchResult[] = [];
      
      searchableItems.forEach(item => {
        const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
        const contentMatch = item.content.toLowerCase().includes(normalizedQuery);
        
        if (titleMatch || contentMatch) {
          let score = 0;
          let snippet = '';
          
          // امتیاز بیشتر برای تطبیق در عنوان
          if (titleMatch) {
            score += 0.7;
            snippet = item.content.slice(0, 120) + (item.content.length > 120 ? '...' : '');
          }
          
          if (contentMatch) {
            score += 0.3;
            const matchIndex = item.content.toLowerCase().indexOf(normalizedQuery);
            snippet = createSnippet(item, matchIndex);
          }
          
          results.push({
            ...item,
            snippet,
            score
          });
        }
      });
      
      // مرتب‌سازی بر اساس امتیاز
      results.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      return results.slice(0, 10); // محدود کردن به 10 نتیجه
    } catch (error) {
      console.error('خطا در جستجو:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [searchableItems, createSnippet]);

  return {
    query,
    setQuery,
    search,
    isSearching,
    totalItems: searchableItems.length
  };
};
