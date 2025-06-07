
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";
import NavigationTree from "./NavigationTree";
import { Plus } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { activeTab, navigationData, isEditMode, createNewPage, setActivePage } = useDocs();
  const [newPageTitle, setNewPageTitle] = useState("");
  const [showNewPageForm, setShowNewPageForm] = useState(false);

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      const newSlug = createNewPage(newPageTitle, activeTab);
      setActivePage(newSlug);
      setNewPageTitle("");
      setShowNewPageForm(false);
    }
  };

  return (
    <aside
      className={cn(
        "w-80 bg-sidebar border-l border-sidebar-border transition-all duration-300 overflow-hidden",
        isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:w-0"
      )}
    >
      <div className="h-full overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              {activeTab === 'program' && '📖 راهنمای برنامه'}
              {activeTab === 'api' && '🔌 مستندات API'}
              {activeTab === 'app' && '📱 راهنمای اپلیکیشن'}
            </h2>
            {isEditMode && (
              <button
                onClick={() => setShowNewPageForm(!showNewPageForm)}
                className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                title="صفحه جدید"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="h-px bg-gradient-to-l from-sidebar-border to-transparent" />
        </div>

        {isEditMode && showNewPageForm && (
          <div className="mb-4 p-3 bg-sidebar-accent/30 rounded-lg">
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="عنوان صفحه جدید..."
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreatePage();
                } else if (e.key === 'Escape') {
                  setShowNewPageForm(false);
                  setNewPageTitle("");
                }
              }}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCreatePage}
                className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                ایجاد
              </button>
              <button
                onClick={() => {
                  setShowNewPageForm(false);
                  setNewPageTitle("");
                }}
                className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        )}

        <NavigationTree items={navigationData[activeTab] || []} />
      </div>
    </aside>
  );
};

export default Sidebar;
