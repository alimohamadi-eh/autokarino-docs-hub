
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
    <div className="hidden md:flex items-center bg-muted/30 backdrop-blur-sm rounded-xl p-1.5 shadow-md border border-border/50">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group",
            activeTab === tab.id
              ? "bg-background shadow-lg text-foreground scale-105 z-10"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60 hover:scale-102"
          )}
        >
          {/* Active tab background gradient */}
          {activeTab === tab.id && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-tab-switch" />
          )}
          
          <span className="text-lg floating-element" style={{ animationDelay: `${index * 0.1}s` }}>
            {tab.icon}
          </span>
          <span className="relative z-10">{tab.label}</span>
          
          {/* Hover effect */}
          <div className={cn(
            "absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full",
            activeTab === tab.id ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-60"
          )} />
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
