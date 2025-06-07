
import { useState } from "react";
import { useDocs } from "@/contexts/DocsContext";
import { cn } from "@/lib/utils";

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
    <div className={cn("space-y-1", level > 0 && "mr-4")}>
      {items.map((item) => (
        <div key={item.slug}>
          <button
            onClick={() => {
              if (item.children) {
                toggleExpanded(item.slug);
              } else {
                setActivePage(item.slug);
              }
            }}
            className={cn(
              "w-full flex items-center justify-between text-right p-2 rounded-lg text-sm transition-all duration-200 group",
              activePage === item.slug
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <span className="flex-1 text-right">{item.title}</span>
            
            {item.children && (
              <svg
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  expandedItems.has(item.slug) ? "rotate-90" : ""
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>

          {item.children && expandedItems.has(item.slug) && (
            <div className="mt-1 animate-accordion-down">
              <NavigationTree items={item.children} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavigationTree;
