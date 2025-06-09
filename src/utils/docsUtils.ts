
import { NavigationItem, PageContent } from '@/types/docs';

export const generateSlug = (title: string): string => {
  return title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/[\u0600-\u06FF]/g, (match) => {
      return encodeURIComponent(match).replace(/%/g, '');
    });
};

export const createUniqueSlug = (title: string): string => {
  const baseSlug = generateSlug(title);
  return `${baseSlug}-${Date.now()}`;
};

export const addToNavigationTree = (
  navigationData: Record<string, NavigationItem[]>,
  tab: string,
  newNavItem: NavigationItem,
  parentSlug?: string
): Record<string, NavigationItem[]> => {
  const newNav = { ...navigationData };
  
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
};

export const removeFromNavigationTree = (
  navigationData: Record<string, NavigationItem[]>,
  slug: string
): Record<string, NavigationItem[]> => {
  const newNav = { ...navigationData };
  
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
};
