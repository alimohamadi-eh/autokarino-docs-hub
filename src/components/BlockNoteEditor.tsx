
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlockNoteView } from "@blocknote/react";
import { BlockNoteEditor as BlockNoteEditorType, Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

interface BlockNoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const BlockNoteEditorComponent = ({ content, onChange, title, onTitleChange }: BlockNoteEditorProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  // تبدیل HTML به blocks برای BlockNote
  const initialBlocks = useMemo(() => {
    try {
      if (!content || content.trim() === '') {
        return [
          {
            id: "initial",
            type: "paragraph",
            content: [{ type: "text", text: "محتوای خود را اینجا بنویسید..." }]
          }
        ] as Block[];
      }
      
      // اگر محتوا HTML است، آن را به متن ساده تبدیل می‌کنیم
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      if (textContent.trim() === '') {
        return [
          {
            id: "initial",
            type: "paragraph", 
            content: [{ type: "text", text: "محتوای خود را اینجا بنویسید..." }]
          }
        ] as Block[];
      }

      // تقسیم متن به پاراگراف‌ها
      const paragraphs = textContent.split('\n').filter(p => p.trim() !== '');
      
      return paragraphs.map((paragraph, index) => ({
        id: `block-${index}`,
        type: "paragraph" as const,
        content: [{ type: "text", text: paragraph.trim() }]
      })) as Block[];

    } catch (error) {
      console.error('Error parsing content:', error);
      return [
        {
          id: "error",
          type: "paragraph",
          content: [{ type: "text", text: "محتوای خود را اینجا بنویسید..." }]
        }
      ] as Block[];
    }
  }, [content]);

  // ایجاد editor instance
  const editor = useMemo(() => {
    return BlockNoteEditorType.create({
      initialContent: initialBlocks,
    });
  }, []);

  const handleSave = async () => {
    try {
      const blocks = editor.document;
      const htmlContent = await editor.blocksToHTMLLossy(blocks);
      onChange(htmlContent);
      setHasUnsavedChanges(false);
      toast({
        title: "ذخیره شد",
        description: "تغییرات با موفقیت ذخیره شد",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "خطا در ذخیره",
        description: "مشکلی در ذخیره تغییرات رخ داد",
        variant: "destructive"
      });
    }
  };

  const handleEditorChange = () => {
    setHasUnsavedChanges(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
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

      <div className="border border-border rounded-lg overflow-hidden">
        <BlockNoteView 
          editor={editor} 
          onChange={handleEditorChange}
          theme="light"
          data-theming-css-variables-demo
        />
      </div>
      
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md">
          تغییرات ذخیره نشده دارید
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .bn-container {
            direction: ltr;
          }
          .bn-editor {
            direction: rtl;
            font-family: inherit;
          }
          .bn-editor .ProseMirror {
            direction: rtl;
            text-align: right;
          }
          .bn-editor .ProseMirror p {
            text-align: right;
            direction: rtl;
          }
          .bn-editor .ProseMirror h1,
          .bn-editor .ProseMirror h2, 
          .bn-editor .ProseMirror h3 {
            text-align: right;
            direction: rtl;
          }
        `
      }} />
    </div>
  );
};

export default BlockNoteEditorComponent;
