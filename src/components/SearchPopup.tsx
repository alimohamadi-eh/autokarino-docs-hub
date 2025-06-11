
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from './SearchResults';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPopup = ({ isOpen, onClose }: SearchPopupProps) => {
  const { query, setQuery, search, isSearching, totalItems } = useSearch();
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // جستجو با debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        const searchResults = search(query);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  // فوکوس روی input هنگام باز شدن
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // مدیریت کلیدهای کیبورد
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        if (!isOpen) {
          setQuery('');
          setResults([]);
        }
      }
      
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    onClose();
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="جستجو در مستندات..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 pl-10"
              dir="rtl"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!query && (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">
                {totalItems} صفحه آماده جستجو
              </p>
              <p className="text-xs mt-1">
                برای شروع جستجو تایپ کنید...
              </p>
            </div>
          )}

          {query && (
            <div className="max-h-96 overflow-y-auto">
              <SearchResults
                results={results}
                query={query}
                isLoading={isSearching}
                onResultClick={handleResultClick}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchPopup;
