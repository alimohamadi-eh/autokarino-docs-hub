
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import VersionSelector from "./VersionSelector";
import TabNavigation from "./TabNavigation";
import { Button } from "@/components/ui/button";
import SearchPopup from "./SearchPopup";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">خ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">خودکارینو</h1>
              <p className="text-xs text-muted-foreground">مستندات فنی</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            جستجو
            <span className="hidden md:inline text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              Ctrl+K
            </span>
          </Button>
          
          <TabNavigation />
          <VersionSelector />
        </div>
      </div>

      <SearchPopup 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
};

export default Header;
