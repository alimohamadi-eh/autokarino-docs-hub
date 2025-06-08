
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";
import NavigationTree from "./NavigationTree";
import PageCreationModal from "./PageCreationModal";
import { Plus, FolderPlus, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { activeTab, navigationData, isEditMode } = useDocs();
  const [showCreateModal, setShowCreateModal] = useState(false);

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
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8"
                title="صفحه جدید"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="h-px bg-gradient-to-l from-sidebar-border to-transparent" />
        </div>

        {isEditMode && (
          <div className="mb-4 space-y-2">
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <FileText className="h-4 w-4" />
              صفحه جدید
            </Button>
          </div>
        )}

        <NavigationTree items={navigationData[activeTab] || []} />

        <PageCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
