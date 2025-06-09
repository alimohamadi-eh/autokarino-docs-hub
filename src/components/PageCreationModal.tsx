
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
  const [fileName, setFileName] = useState("");
  const [pageType, setPageType] = useState<"page" | "folder">("page");
  const [selectedParent, setSelectedParent] = useState<string>(parentSlug || "no-parent");
  const { activeTab, createNewPage, setActivePage, navigationData } = useDocs();

  const handleCreate = () => {
    if (title.trim() && (pageType === "folder" || fileName.trim())) {
      const finalParentSlug = selectedParent === "no-parent" ? undefined : selectedParent;
      const newSlug = createNewPage(title, activeTab, finalParentSlug, pageType, fileName);
      if (pageType === "page") {
        setActivePage(newSlug);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setFileName("");
    setPageType("page");
    setSelectedParent(parentSlug || "no-parent");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  // تولید خودکار نام فایل از عنوان
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (pageType === "page" && !fileName) {
      const autoFileName = value
        .toLowerCase()
        .replace(/[\u0600-\u06FF]/g, '') // حذف حروف فارسی
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
      setFileName(autoFileName);
    }
  };

  // Get available parent folders
  const availableParents = navigationData[activeTab]?.filter(item => 
    item.children && item.slug !== parentSlug
  ) || [];

  const isFormValid = title.trim() && (pageType === "folder" || fileName.trim());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {pageType === "page" ? "ایجاد صفحه جدید" : "ایجاد پوشه جدید"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">نوع</label>
            <Select value={pageType} onValueChange={(value: "page" | "folder") => {
              setPageType(value);
              if (value === "folder") {
                setFileName("");
              }
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">📄 صفحه</SelectItem>
                <SelectItem value="folder">📁 پوشه</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">عنوان (فارسی)</label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={pageType === "page" ? "عنوان صفحه جدید..." : "نام پوشه جدید..."}
              onKeyDown={handleKeyDown}
              autoFocus
              dir="rtl"
            />
          </div>

          {pageType === "page" && (
            <div>
              <label className="text-sm font-medium mb-2 block">نام فایل (انگلیسی)</label>
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="file-name"
                onKeyDown={handleKeyDown}
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground mt-1">
                فایل به صورت <code>{fileName || 'file-name'}.md</code> در مسیر <code>docs/{activeTab}/</code> ایجاد خواهد شد
              </p>
            </div>
          )}

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
          <Button onClick={handleCreate} disabled={!isFormValid}>
            ایجاد
          </Button>
          <Button variant="outline" onClick={handleClose}>
            لغو
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PageCreationModal;
