
import { useState } from 'react';
import { NavigationItem, PageContent } from '@/types/docs';
import { createUniqueSlug, addToNavigationTree, removeFromNavigationTree } from '@/utils/docsUtils';

export const useDocsActions = (
  pageContents: Record<string, PageContent>,
  setPageContents: React.Dispatch<React.SetStateAction<Record<string, PageContent>>>,
  navigationData: Record<string, NavigationItem[]>,
  setNavigationData: React.Dispatch<React.SetStateAction<Record<string, NavigationItem[]>>>,
  activePage: string,
  setActivePage: (page: string) => void
) => {
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

  const createNewPage = (title: string, tab: string, parentSlug?: string, type: "page" | "folder" = "page"): string => {
    const finalSlug = createUniqueSlug(title);
    
    if (type === "page") {
      const newPage: PageContent = {
        title,
        slug: finalSlug,
        tab,
        content: `<h1>${title}</h1><p>این صفحه جدید ایجاد شده است. محتوای خود را اینجا بنویسید...</p><h2>شروع کنید</h2><p>از ویرایشگر متن برای نوشتن محتوای خود استفاده کنید.</p>`
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

    setNavigationData(prev => addToNavigationTree(prev, tab, newNavItem, parentSlug));

    return finalSlug;
  };

  const deletePage = (slug: string) => {
    setPageContents(prev => {
      const newContents = { ...prev };
      delete newContents[slug];
      return newContents;
    });

    // Remove from navigation recursively
    setNavigationData(prev => removeFromNavigationTree(prev, slug));

    // If deleted page was active, switch to intro
    if (activePage === slug) {
      setActivePage('intro');
    }
  };

  return {
    updatePageContent,
    createNewPage,
    deletePage
  };
};
