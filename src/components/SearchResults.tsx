
import { useDocs } from '@/contexts/DocsContext';
import { Copy, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  title: string;
  content: string;
  slug: string;
  tab: string;
  version: string;
  path: string;
  snippet?: string;
  score?: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  onResultClick: () => void;
}

const SearchResults = ({ results, query, isLoading, onResultClick }: SearchResultsProps) => {
  const { setActivePage, setActiveTab, tabs } = useDocs();
  const { toast } = useToast();

  const handleResultClick = (result: SearchResult) => {
    // تغییر به تب و صفحه مناسب
    setActiveTab(result.tab);
    setActivePage(result.slug);
    onResultClick();
  };

  const handleCopyPath = (path: string, title: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // کپی کردن آدرس کامل
    const fullPath = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullPath).then(() => {
      toast({
        title: "آدرس کپی شد",
        description: `آدرس "${title}" در کلیپ‌بورد کپی شد`,
        duration: 2000,
      });
    }).catch(() => {
      toast({
        title: "خطا در کپی",
        description: "مشکلی در کپی کردن آدرس رخ داد",
        variant: "destructive",
        duration: 2000,
      });
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getTabLabel = (tabId: string) => {
    return tabs.find(tab => tab.id === tabId)?.label || tabId;
  };

  if (isLoading) {
    return (
      <div className="absolute top-full right-0 left-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50 p-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Search className="h-4 w-4 animate-spin" />
          <span>در حال جستجو...</span>
        </div>
      </div>
    );
  }

  if (!results.length && query.trim()) {
    return (
      <div className="absolute top-full right-0 left-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50 p-4">
        <div className="text-center text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>نتیجه‌ای برای "{query}" یافت نشد</p>
          <p className="text-xs mt-1">کلمات کلیدی دیگری امتحان کنید</p>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return null;
  }

  return (
    <div className="absolute top-full right-0 left-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-2">
        <div className="text-xs text-muted-foreground mb-2 px-2">
          {results.length} نتیجه یافت شد
        </div>
        
        <div className="space-y-1">
          {results.map((result, index) => (
            <div
              key={`${result.slug}-${index}`}
              onClick={() => handleResultClick(result)}
              className="group p-3 rounded-md hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* عنوان و مسیر */}
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {highlightText(result.title, query)}
                    </h4>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                      {getTabLabel(result.tab)}
                    </span>
                  </div>
                  
                  {/* Snippet */}
                  {result.snippet && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed" dir="rtl">
                      {highlightText(result.snippet, query)}
                    </p>
                  )}
                  
                  {/* مسیر */}
                  <p className="text-xs text-muted-foreground/70 mt-1 font-mono" dir="ltr">
                    {result.path}
                  </p>
                </div>
                
                {/* دکمه کپی */}
                <button
                  onClick={(e) => handleCopyPath(result.path, result.title, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background transition-all"
                  title="کپی آدرس"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-border p-2">
        <p className="text-xs text-muted-foreground text-center">
          Enter برای رفتن • Escape برای بستن
        </p>
      </div>
    </div>
  );
};

export default SearchResults;
