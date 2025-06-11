
import { useState } from "react";
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, Folder, FolderOpen, Plus, MoreHorizontal, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageCreationModal from "./PageCreationModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface SortableItemProps {
  item: NavigationItem;
  level: number;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpanded: (slug: string) => void;
  onSetActivePage: (slug: string) => void;
  onCreateChild: (parentSlug: string) => void;
  onDelete: (slug: string, e: React.MouseEvent) => void;
  isEditMode: boolean;
}

const SortableItem = ({
  item,
  level,
  isActive,
  isExpanded,
  onToggleExpanded,
  onSetActivePage,
  onCreateChild,
  onDelete,
  isEditMode
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isFolder = item.children !== undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "group flex items-center justify-between rounded-lg transition-all duration-200",
          isActive && !isFolder
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-sidebar-accent/50",
          isDragging && "bg-sidebar-accent/30"
        )}
      >
        <div className="flex items-center flex-1">
          {isEditMode && (
            <div
              {...attributes}
              {...listeners}
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          <button
            onClick={() => {
              if (isFolder) {
                onToggleExpanded(item.slug);
              } else {
                onSetActivePage(item.slug);
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
        </div>

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
                <DropdownMenuItem onClick={() => onCreateChild(item.slug)}>
                  <Plus className="h-4 w-4 ml-2" />
                  اضافه کردن صفحه
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={(e) => onDelete(item.slug, e)} className="text-destructive">
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
};

const NavigationTree = ({ items, level = 0 }: NavigationTreeProps) => {
  const { activePage, setActivePage, isEditMode, deletePage, movePageToFolder } = useDocs();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['intro', 'automation']));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<string | undefined>();
  const [sortableItems, setSortableItems] = useState(items);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeItem = items.find(item => item.slug === active.id);
    const overItem = items.find(item => item.slug === over.id);

    if (!activeItem || !overItem) {
      return;
    }

    // اگر آیتم روی یک پوشه رها شد، آن را به پوشه منتقل کن
    if (overItem.children !== undefined) {
      if (movePageToFolder) {
        movePageToFolder(activeItem.slug, overItem.slug);
      }
    } else {
      // در غیر این صورت، ترتیب آیتم‌ها را تغییر بده
      const oldIndex = items.findIndex(item => item.slug === active.id);
      const newIndex = items.findIndex(item => item.slug === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setSortableItems(newItems);
    }
  };

  // استفاده از آیتم‌های اصلی یا آیتم‌های مرتب شده
  const displayItems = sortableItems.length > 0 ? sortableItems : items;

  return (
    <div className={cn("space-y-1", level > 0 && "mr-4")}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={displayItems.map(item => item.slug)} strategy={verticalListSortingStrategy}>
          {displayItems.map((item) => {
            const isExpanded = expandedItems.has(item.slug);
            const isActive = activePage === item.slug;

            return (
              <div key={item.slug}>
                <SortableItem
                  item={item}
                  level={level}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  onToggleExpanded={toggleExpanded}
                  onSetActivePage={setActivePage}
                  onCreateChild={handleCreateChild}
                  onDelete={handleDelete}
                  isEditMode={isEditMode}
                />
              </div>
            );
          })}
        </SortableContext>
      </DndContext>

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
