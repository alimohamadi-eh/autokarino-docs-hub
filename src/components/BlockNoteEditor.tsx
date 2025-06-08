
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "./RichTextEditor";

interface BlockNoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const BlockNoteEditorComponent = ({ content, onChange, title, onTitleChange }: BlockNoteEditorProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const { toast } = useToast();

  const handleSave = () => {
    onChange(currentContent);
    setHasUnsavedChanges(false);
    toast({
      title: "ذخیره شد",
      description: "تغییرات با موفقیت ذخیره شد",
    });
  };

  const handleContentChange = (newContent: string) => {
    setCurrentContent(newContent);
    setHasUnsavedChanges(newContent !== content);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="flex-1 text-3xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            placeholder="عنوان صفحه را وارد کنید..."
            dir="rtl"
          />
          <Button 
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="mr-4"
            size="sm"
          >
            <Save className="w-4 h-4 ml-2" />
            ذخیره
          </Button>
        </div>
        <div className="h-px bg-gradient-to-l from-border to-transparent" />
      </div>

      <RichTextEditor
        content={currentContent}
        onChange={handleContentChange}
        placeholder="محتوای خود را اینجا بنویسید... برای فرمت‌بندی روی متن کلیک کنید"
      />
      
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md">
          تغییرات ذخیره نشده دارید
        </div>
      )}
    </div>
  );
};

export default BlockNoteEditorComponent;
