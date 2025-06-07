
import { useState } from "react";
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface NavigationItem {
  title: string;
  slug: string;
  children?: NavigationItem[];
}

interface NavigationTreeProps {
  items: NavigationItem[];
  level?: number;
}

const NavigationTree = ({ items, level = 0 }: NavigationTreeProps) => {
  const { activePage, setActivePage } = useDocs();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['intro', 'automation']));

  const toggleExpanded = (slug: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className={cn("space-y-2", level > 0 && "mr-4 border-r border-sidebar-border/30 pr-4")}>
      {items.map((item, index) => (
        <div 
          key={item.slug} 
          className="animate-fade-in-up"
          style={{ animationDelay: `${(index * 0.05) + (level * 0.1)}s` }}
        >
          <button
            onClick={() => {
              if (item.children) {
                toggleExpanded(item.slug);
              } else {
                setActivePage(item.slug);
              }
            }}
            className={cn(
              "w-full flex items-center justify-between text-right p-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
              activePage === item.slug
                ? "bg-gradient-to-r from-sidebar-primary/20 to-sidebar-primary/10 text-sidebar-primary font-semibold shadow-md border border-sidebar-primary/20"
                : "text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/80 hover:to-sidebar-accent/40 menu-item-hover"
            )}
          >
            {/* Background shimmer effect for active item */}
            {activePage === item.slug && (
              <div className="absolute inset-0 shimmer-effect opacity-20" />
            )}
            
            <span className="flex-1 text-right relative z-10">{item.title}</span>
            
            {item.children && (
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-all duration-300 relative z-10",
                  expandedItems.has(item.slug) ? "rotate-90 text-sidebar-primary" : "group-hover:text-sidebar-primary/70"
                )}
              />
            )}
            
            {/* Hover indicator */}
            <div className={cn(
              "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-sidebar-primary to-sidebar-primary/50 transition-all duration-300 rounded-r",
              activePage === item.slug ? "opacity-100" : "opacity-0 group-hover:opacity-60"
            )} />
          </button>

          {item.children && expandedItems.has(item.slug) && (
            <div className="mt-2 animate-accordion-down">
              <NavigationTree items={item.children} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavigationTree;
