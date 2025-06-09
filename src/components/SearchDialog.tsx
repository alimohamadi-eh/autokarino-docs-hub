
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText } from "lucide-react";
import { useDocs } from "@/contexts/DocsContext";
import Fuse from "fuse.js";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { pageContents, setActivePage, setIsEditMode } = useDocs();

  // تبدیل محتوای صفحات به فرمت قابل جستجو
  const searchableContent = useMemo(() => {
    return Object.values(pageContents).map(page => ({
      title: page.title,
      content: page.content.replace(/<[^>]*>/g, ''), // حذف HTML tags
      slug: page.slug,
      tab: page.tab
    }));
  }, [pageContents]);

  // تنظیم Fuse.js برای جستجوی فازی
  const fuse = useMemo(() => {
    return new Fuse(searchableContent, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'content', weight: 0.3 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
  }, [searchableContent]);

  // نتایج جستجو
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 10);
  }, [fuse, searchQuery]);

  const handleSelectResult = (slug: string) => {
    setActivePage(slug);
    setIsEditMode(false); // خروج از حالت ویرایش
    onClose();
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            جستجو در مستندات
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="متن مورد نظر خود را جستجو کنید..."
            className="w-full"
            dir="rtl"
            autoFocus
          />
          
          {searchQuery.trim() && (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Button
                    key={result.item.slug}
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto text-right"
                    onClick={() => handleSelectResult(result.item.slug)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-right truncate">
                          {result.item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground text-right line-clamp-2">
                          {result.item.content.slice(0, 150)}...
                        </p>
                        <span className="text-xs text-muted-foreground">
                          امتیاز: {((1 - (result.score || 0)) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  نتیجه‌ای یافت نشد
                </div>
              )}
            </div>
          )}
          
          {!searchQuery.trim() && (
            <div className="text-center py-8 text-muted-foreground">
              عبارت مورد نظر خود را تایپ کنید
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
