
import { useDocs } from "@/contexts/DocsContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import VersionManager from "./VersionManager";

const VersionSelector = () => {
  const { activeVersion, setActiveVersion, versions } = useDocs();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-xs font-mono">{activeVersion}</span>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {versions.map((version) => (
            <DropdownMenuItem
              key={version}
              onClick={() => setActiveVersion(version)}
              className="font-mono text-sm"
            >
              {version}
              {version === activeVersion && (
                <span className="mr-auto text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <div className="w-full">
              <VersionManager />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default VersionSelector;
