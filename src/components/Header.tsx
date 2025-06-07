
import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocs } from "@/contexts/DocsContext";
import TabNavigation from "./TabNavigation";
import VersionSelector from "./VersionSelector";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { searchQuery, setSearchQuery } = useDocs();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="h-16 border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden hover:bg-primary/10 transition-all duration-200 hover:scale-105"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-xl flex items-center justify-center shadow-lg floating-element">
              <span className="text-primary-foreground font-bold text-lg">خ</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gradient leading-tight">
                مستندات خودکارینو
              </h1>
              <span className="text-xs text-muted-foreground">سیستم راهنمای جامع</span>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up">
          <TabNavigation />
        </div>

        <div className="flex items-center gap-4 animate-fade-in">
          <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-80 scale-105' : 'w-64'}`}>
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200" />
            <Input
              placeholder="جستجو در مستندات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`pr-10 bg-muted/30 border-0 focus:bg-background/80 transition-all duration-300 ${
                isSearchFocused ? 'shadow-glow ring-2 ring-primary/20' : ''
              }`}
            />
          </div>
          
          <div className="transform transition-all duration-200 hover:scale-105">
            <VersionSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
