
import { Search, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocs } from "@/contexts/DocsContext";
import { useState } from "react";
import SearchDialog from "./SearchDialog";

const Header = () => {
  const { isEditMode, setIsEditMode } = useDocs();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">
              مستندات خودکارینو
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              جستجو
            </Button>
            
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              className="gap-2"
            >
              {isEditMode ? (
                <>
                  <Eye className="h-4 w-4" />
                  مشاهده
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  ویرایش
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <SearchDialog
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </>
  );
};

export default Header;
