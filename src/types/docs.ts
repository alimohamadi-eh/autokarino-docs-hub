
export interface NavigationItem {
  title: string;
  slug: string;
  children?: NavigationItem[];
  type?: "page" | "folder";
}

export interface PageContent {
  title: string;
  content: string;
  slug: string;
  tab: string;
}

export interface DocsContextType {
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
  createNewPage: (title: string, tab: string, parentSlug?: string, type?: "page" | "folder") => string;
  deletePage: (slug: string) => void;
}
