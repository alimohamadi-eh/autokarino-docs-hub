
import { useState } from "react";
import { useDocs } from "@/contexts/DocsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const VersionManager = () => {
  const { 
    versions, 
    activeVersion, 
    addVersion, 
    updateVersion, 
    deleteVersion 
  } = useDocs();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState("");
  const [editingVersion, setEditingVersion] = useState("");
  const [editVersionName, setEditVersionName] = useState("");
  const [versionToDelete, setVersionToDelete] = useState("");

  const handleAddVersion = () => {
    if (!newVersionName.trim()) {
      toast({
        description: "نام نسخه نمی‌تواند خالی باشد",
        variant: "destructive",
      });
      return;
    }

    if (versions.includes(newVersionName.trim())) {
      toast({
        description: "این نسخه قبلاً وجود دارد",
        variant: "destructive",
      });
      return;
    }

    addVersion(newVersionName.trim());
    setNewVersionName("");
    setIsAddDialogOpen(false);
    toast({
      description: `نسخه ${newVersionName} ایجاد شد`,
    });
  };

  const handleEditVersion = () => {
    if (!editVersionName.trim()) {
      toast({
        description: "نام نسخه نمی‌تواند خالی باشد",
        variant: "destructive",
      });
      return;
    }

    if (versions.includes(editVersionName.trim()) && editVersionName.trim() !== editingVersion) {
      toast({
        description: "این نام نسخه قبلاً وجود دارد",
        variant: "destructive",
      });
      return;
    }

    updateVersion(editingVersion, editVersionName.trim());
    setIsEditDialogOpen(false);
    setEditingVersion("");
    setEditVersionName("");
    toast({
      description: `نسخه به ${editVersionName} تغییر یافت`,
    });
  };

  const handleDeleteVersion = () => {
    deleteVersion(versionToDelete);
    setIsDeleteDialogOpen(false);
    setVersionToDelete("");
    toast({
      description: `نسخه ${versionToDelete} حذف شد`,
    });
  };

  const openEditDialog = (version: string) => {
    setEditingVersion(version);
    setEditVersionName(version);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (version: string) => {
    setVersionToDelete(version);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            مدیریت نسخه‌ها
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>مدیریت نسخه‌ها</DialogTitle>
            <DialogDescription>
              نسخه‌های موجود را مدیریت کنید یا نسخه جدید اضافه کنید
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-version">نسخه جدید</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="new-version"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="مثال: v2.0"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVersion()}
                />
                <Button onClick={handleAddVersion} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>نسخه‌های موجود</Label>
              {versions.map((version) => (
                <div key={version} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-mono text-sm">
                    {version}
                    {version === activeVersion && (
                      <span className="text-xs text-primary mr-2">(فعال)</span>
                    )}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(version)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(version)}
                      disabled={versions.length === 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Version Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ویرایش نسخه</DialogTitle>
            <DialogDescription>
              نام نسخه را تغییر دهید
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-version">نام جدید</Label>
              <Input
                id="edit-version"
                value={editVersionName}
                onChange={(e) => setEditVersionName(e.target.value)}
                placeholder="نام جدید نسخه"
                onKeyPress={(e) => e.key === 'Enter' && handleEditVersion()}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              لغو
            </Button>
            <Button onClick={handleEditVersion}>
              ذخیره
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف نسخه</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید نسخه "{versionToDelete}" را حذف کنید؟
              تمامی فایل‌ها و صفحات این نسخه پاک خواهند شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVersion} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VersionManager;
