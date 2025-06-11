
import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
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

  // تنظیم Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(searchableItems, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'content', weight: 0.3 }
      ],
      includeMatches: true,
      includeScore: true,
      minMatchCharLength: 2,
      threshold: 0.4, // کمی سخت‌گیرانه‌تر برای نتایج بهتر
      ignoreLocation: true,
      findAllMatches: true
    });
  }, [searchableItems]);

  // تابع برای ایجاد snippet از محل یافت‌شده
  const createSnippet = useCallback((item: SearchableItem, matches: any[]) => {
    // پیدا کردن بهترین match در محتوا
    const contentMatch = matches.find(match => match.key === 'content');
    
    if (contentMatch && contentMatch.indices && contentMatch.indices.length > 0) {
      const firstMatch = contentMatch.indices[0];
      const start = Math.max(firstMatch[0] - 40, 0);
      const end = Math.min(firstMatch[1] + 40, item.content.length);
      
      let snippet = item.content.slice(start, end);
      
      // اضافه کردن ... در ابتدا و انتها در صورت نیاز
      if (start > 0) snippet = '...' + snippet;
      if (end < item.content.length) snippet = snippet + '...';
      
      return snippet;
    }
    
    // اگر match در عنوان بود، اول محتوا را نمایش بده
    return item.content.slice(0, 120) + (item.content.length > 120 ? '...' : '');
  }, []);

  // تابع جستجو
  const search = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }
    
    setIsSearching(true);
    
    try {
      const results = fuse.search(searchQuery);
      
      const searchResults: SearchResult[] = results.map(result => {
        const item = result.item;
        const snippet = createSnippet(item, result.matches || []);
        
        return {
          ...item,
          snippet,
          score: result.score
        };
      });
      
      return searchResults.slice(0, 10); // محدود کردن به 10 نتیجه
    } catch (error) {
      console.error('خطا در جستجو:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [fuse, createSnippet]);

  return {
    query,
    setQuery,
    search,
    isSearching,
    totalItems: searchableItems.length
  };
};
