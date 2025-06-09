
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useDocs } from "@/contexts/DocsContext";

interface PageCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentSlug?: string;
}

const PageCreationModal = ({ isOpen, onClose, parentSlug }: PageCreationModalProps) => {
  const [title, setTitle] = useState("");
  const [pageType, setPageType] = useState<"page" | "folder">("page");
  const [selectedParent, setSelectedParent] = useState<string>(parentSlug || "no-parent");
  const { activeTab, createNewPage, setActivePage, navigationData } = useDocs();

  const handleCreate = () => {
    if (title.trim()) {
      const finalParentSlug = selectedParent === "no-parent" ? undefined : selectedParent;
      const newSlug = createNewPage(title, activeTab, finalParentSlug, pageType);
      if (pageType === "page") {
        setActivePage(newSlug);
      }
      setTitle("");
      setPageType("page");
      setSelectedParent("no-parent");
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Get available parent folders
  const availableParents = navigationData[activeTab]?.filter(item => 
    item.children && item.slug !== parentSlug
  ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>ایجاد صفحه جدید</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">عنوان</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان صفحه جدید..."
              onKeyDown={handleKeyDown}
              autoFocus
              dir="rtl"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">نوع</label>
            <Select value={pageType} onValueChange={(value: "page" | "folder") => setPageType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">📄 صفحه</SelectItem>
                <SelectItem value="folder">📁 پوشه</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {availableParents.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">پوشه والد (اختیاری)</label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب پوشه والد..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-parent">📁 بدون والد</SelectItem>
                  {availableParents.map((parent) => (
                    <SelectItem key={parent.slug} value={parent.slug}>
                      📁 {parent.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-start gap-2">
          <Button onClick={handleCreate} disabled={!title.trim()}>
            ایجاد
          </Button>
          <Button variant="outline" onClick={onClose}>
            لغو
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PageCreationModal;
