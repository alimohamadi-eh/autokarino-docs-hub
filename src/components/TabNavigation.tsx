
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";
import { Edit3, Eye } from "lucide-react";

const TabNavigation = () => {
  const { activeTab, setActiveTab, isEditMode, setIsEditMode } = useDocs();

  const tabs = [
    { id: 'program', label: 'برنامه', icon: '🔄' },
    { id: 'api', label: 'API', icon: '🔌' },
    { id: 'app', label: 'اپلیکیشن', icon: '📱' }
  ];

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
    </div>
  );
};

export default TabNavigation;
