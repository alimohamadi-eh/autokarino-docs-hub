
import { useState } from "react";
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, Folder, FolderOpen, Plus, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageCreationModal from "./PageCreationModal";

interface NavigationItem {
  title: string;
  slug: string;
  children?: NavigationItem[];
  type?: "page" | "folder";
}

interface NavigationTreeProps {
  items: NavigationItem[];
  level?: number;
}

const NavigationTree = ({ items, level = 0 }: NavigationTreeProps) => {
  const { activePage, setActivePage, isEditMode, deletePage } = useDocs();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['intro', 'automation']));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<string | undefined>();

  const toggleExpanded = (slug: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedItems(newExpanded);
  };

  const handleCreateChild = (parentSlug: string) => {
    setSelectedParent(parentSlug);
    setShowCreateModal(true);
  };

  const handleDelete = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('آیا مطمئن هستید که می‌خواهید این صفحه را حذف کنید؟')) {
      deletePage(slug);
    }
  };

  return (
    <div className={cn("space-y-1", level > 0 && "mr-4")}>
      {items.map((item) => {
        const isFolder = item.children !== undefined;
        const isExpanded = expandedItems.has(item.slug);
        const isActive = activePage === item.slug;

        return (
          <div key={item.slug}>
            <div
              className={cn(
                "group flex items-center justify-between rounded-lg transition-all duration-200",
                isActive && !isFolder
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              <button
                onClick={() => {
                  if (isFolder) {
                    toggleExpanded(item.slug);
                  } else {
                    setActivePage(item.slug);
                  }
                }}
                className="flex items-center gap-2 p-2 text-sm flex-1 text-right"
              >
                {isFolder ? (
                  <>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded ? "rotate-90" : ""
                      )}
                    />
                    {isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                  </>
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                
                <span className="flex-1 text-right truncate">{item.title}</span>
              </button>

              {isEditMode && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isFolder && (
                      <DropdownMenuItem onClick={() => handleCreateChild(item.slug)}>
                        <Plus className="h-4 w-4 ml-2" />
                        اضافه کردن صفحه
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={(e) => handleDelete(item.slug, e)} className="text-destructive">
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {isFolder && isExpanded && item.children && item.children.length > 0 && (
              <div className="mt-1 animate-accordion-down">
                <NavigationTree items={item.children} level={level + 1} />
              </div>
            )}
          </div>
        );
      })}

      <PageCreationModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedParent(undefined);
        }}
        parentSlug={selectedParent}
      />
    </div>
  );
};

export default NavigationTree;
