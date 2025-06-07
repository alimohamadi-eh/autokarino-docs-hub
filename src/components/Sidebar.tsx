
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";
import NavigationTree from "./NavigationTree";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { activeTab, navigationData } = useDocs();

  return (
    <aside
      className={cn(
        "w-80 bg-sidebar/95 backdrop-blur-md border-l border-sidebar-border/50 transition-all duration-500 ease-in-out overflow-hidden shadow-sidebar",
        isOpen ? "translate-x-0 animate-slide-in-right" : "translate-x-full lg:translate-x-0 lg:w-0 animate-slide-out-right"
      )}
    >
      <div className="h-full overflow-y-auto p-6 mesh-background">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 rounded-lg flex items-center justify-center shadow-md">
              {activeTab === 'program' && <span className="text-white text-sm">📖</span>}
              {activeTab === 'api' && <span className="text-white text-sm">🔌</span>}
              {activeTab === 'app' && <span className="text-white text-sm">📱</span>}
            </div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              {activeTab === 'program' && 'راهنمای برنامه'}
              {activeTab === 'api' && 'مستندات API'}
              {activeTab === 'app' && 'راهنمای اپلیکیشن'}
            </h2>
          </div>
          <div className="h-px bg-gradient-to-l from-sidebar-border via-sidebar-primary/30 to-transparent shadow-sm" />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <NavigationTree items={navigationData[activeTab] || []} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
