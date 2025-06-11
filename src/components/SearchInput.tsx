
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from './SearchResults';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ placeholder = "جستجو در مستندات...", className }: SearchInputProps) => {
  const { query, setQuery, search, isSearching, totalItems } = useSearch();
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // جستجو با debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        const searchResults = search(query);
        setResults(searchResults);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  // بستن نتایج هنگام کلیک خارج از کامپوننت
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // مدیریت کلیدهای کیبورد
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
      
      // کلید میانبر Ctrl+K یا Cmd+K برای فوکوس روی جستجو
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim() && results.length > 0) {
      setIsOpen(true);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className={`
            pr-10 pl-10 transition-all duration-200
            ${isFocused ? 'ring-2 ring-primary/20 border-primary/30' : ''}
          `}
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

      {/* نمایش تعداد آیتم‌های قابل جستجو */}
      {isFocused && !query && (
        <div className="absolute top-full right-0 left-0 mt-2 p-3 bg-background border border-border rounded-md shadow-lg z-50">
          <p className="text-sm text-muted-foreground text-center">
            {totalItems} صفحه آماده جستجو • کلید میانبر: Ctrl+K
          </p>
        </div>
      )}

      {/* نمایش نتایج */}
      {isOpen && (
        <SearchResults
          results={results}
          query={query}
          isLoading={isSearching}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
};

export default SearchInput;
