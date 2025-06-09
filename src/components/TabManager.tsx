
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useDocs } from "@/contexts/DocsContext";
import { TabConfig } from "@/types/tabs";

interface TabManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TabManager = ({ isOpen, onClose }: TabManagerProps) => {
  const { tabs, addTab, updateTab, deleteTab } = useDocs();
  const [editingTab, setEditingTab] = useState<TabConfig | null>(null);
  const [newTab, setNewTab] = useState({ label: "", icon: "📄" });
  const [showNewTabForm, setShowNewTabForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddTab = () => {
    if (newTab.label.trim()) {
      addTab(newTab.label, newTab.icon);
      setNewTab({ label: "", icon: "📄" });
      setShowNewTabForm(false);
    }
  };

  const handleUpdateTab = () => {
    if (editingTab && editingTab.label.trim()) {
      updateTab(editingTab.id, editingTab.label, editingTab.icon);
      setEditingTab(null);
    }
  };

  const handleDeleteTab = (tabId: string) => {
    deleteTab(tabId);
    setDeleteConfirm(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>مدیریت تب‌ها</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {tabs.map((tab) => (
            <div key={tab.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
                {!tab.isCustom && <span className="text-xs text-muted-foreground">(پیش‌فرض)</span>}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTab(tab)}
                  className="p-1 h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(tab.id)}
                  className="p-1 h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {showNewTabForm && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">نام تب</label>
                  <Input
                    value={newTab.label}
                    onChange={(e) => setNewTab({ ...newTab, label: e.target.value })}
                    placeholder="نام تب جدید..."
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">آیکون</label>
                  <Input
                    value={newTab.icon}
                    onChange={(e) => setNewTab({ ...newTab, icon: e.target.value })}
                    placeholder="📄"
                    className="w-20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddTab}>
                    افزودن
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowNewTabForm(false)}
                  >
                    لغو
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!showNewTabForm && (
            <Button
              variant="outline"
              onClick={() => setShowNewTabForm(true)}
              className="w-full justify-start gap-2"
            >
              <Plus className="h-4 w-4" />
              تب جدید
            </Button>
          )}
        </div>

        {editingTab && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg w-96 max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-4">ویرایش تب</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">نام تب</label>
                  <Input
                    value={editingTab.label}
                    onChange={(e) => setEditingTab({ ...editingTab, label: e.target.value })}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">آیکون</label>
                  <Input
                    value={editingTab.icon}
                    onChange={(e) => setEditingTab({ ...editingTab, icon: e.target.value })}
                    className="w-20"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleUpdateTab}>
                    ذخیره
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setEditingTab(null)}
                  >
                    لغو
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg w-96 max-w-sm mx-4" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <h3 className="text-lg font-semibold">تأیید حذف</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                آیا از حذف این تب و تمام صفحات و فایل‌های مربوط به آن اطمینان دارید؟ این عمل قابل بازگشت نیست.
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDeleteTab(deleteConfirm)}
                >
                  حذف
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setDeleteConfirm(null)}
                >
                  لغو
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TabManager;
