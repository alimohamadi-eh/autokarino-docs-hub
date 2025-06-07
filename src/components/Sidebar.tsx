
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
        "w-80 bg-sidebar border-l border-sidebar-border transition-all duration-300 overflow-hidden",
        isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:w-0"
      )}
    >
      <div className="h-full overflow-y-auto p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-sidebar-foreground mb-2">
            {activeTab === 'program' && '📖 راهنمای برنامه'}
            {activeTab === 'api' && '🔌 مستندات API'}
            {activeTab === 'app' && '📱 راهنمای اپلیکیشن'}
          </h2>
          <div className="h-px bg-gradient-to-l from-sidebar-border to-transparent" />
        </div>

        <NavigationTree items={navigationData[activeTab] || []} />
      </div>
    </aside>
  );
};

export default Sidebar;
