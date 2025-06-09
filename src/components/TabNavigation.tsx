
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";
import { Edit3, Eye, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TabManager from "./TabManager";

const TabNavigation = () => {
  const { activeTab, setActiveTab, isEditMode, setIsEditMode, tabs } = useDocs();
  const [showTabManager, setShowTabManager] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center bg-muted/50 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        
        {isEditMode && (
          <Button
            onClick={() => setShowTabManager(true)}
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8 ml-1"
            title="مدیریت تب‌ها"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center bg-muted/50 rounded-lg p-1">
        <button
          onClick={() => setIsEditMode(false)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
            !isEditMode
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          <Eye className="h-4 w-4" />
          مشاهده
        </button>
        <button
          onClick={() => setIsEditMode(true)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
            isEditMode
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          <Edit3 className="h-4 w-4" />
          ویرایش
        </button>
      </div>

      <TabManager 
        isOpen={showTabManager} 
        onClose={() => setShowTabManager(false)} 
      />
    </div>
  );
};

export default TabNavigation;
