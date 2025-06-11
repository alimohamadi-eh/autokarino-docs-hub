
import { useDocs } from "@/contexts/DocsContext";
import NavigationTree from "./NavigationTree";
import SearchInput from "./SearchInput";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { 
    activeTab, 
    navigationData, 
    activePage, 
    setActivePage,
    activeVersion 
  } = useDocs();

  const currentNavigation = navigationData[activeTab] || [];

  return (
    <aside 
      className={cn(
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-l border-border transition-all duration-300 flex flex-col",
        isOpen ? "w-80" : "w-0 overflow-hidden"
      )}
    >
      {isOpen && (
        <>
          {/* Search Section */}
          <div className="p-4 border-b border-border">
            <SearchInput 
              placeholder="جستجو در مستندات..."
              className="w-full"
            />
          </div>

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  مستندات {activeVersion}
                </h3>
              </div>
              
              <NavigationTree
                items={currentNavigation}
                activeSlug={activePage}
                onItemClick={setActivePage}
              />
            </div>
          </div>

          {/* Footer info */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              کلید میانبر جستجو: Ctrl+K
            </p>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
