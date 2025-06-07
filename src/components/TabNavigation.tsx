
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";

const TabNavigation = () => {
  const { activeTab, setActiveTab } = useDocs();

  const tabs = [
    { id: 'program', label: 'برنامه', icon: '🔄' },
    { id: 'api', label: 'API', icon: '🔌' },
    { id: 'app', label: 'اپلیکیشن', icon: '📱' }
  ];

  return (
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
  );
};

export default TabNavigation;
