
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface BlockNoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  readonly?: boolean;
}

const BlockNoteEditorComponent = ({ 
  content, 
  onChange, 
  title, 
  onTitleChange, 
  readonly = false 
}: BlockNoteEditorProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialContent, setInitialContent] = useState<Block[] | undefined>(undefined);
  const { toast } = useToast();

  // ایجاد editor instance
  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  // تبدیل محتوای Markdown به Blocks با استفاده از API رسمی BlockNote
  useEffect(() => {
    const convertMarkdownToBlocks = async () => {
      try {
        if (!content || content.trim() === '') {
          const defaultBlocks: Block[] = [{
            id: "initial",
            type: "paragraph",
            content: [{ type: "text", text: "محتوای خود را اینجا بنویسید..." }]
          }] as Block[];
          setInitialContent(defaultBlocks);
          if (editor) {
            editor.replaceBlocks(editor.document, defaultBlocks);
          }
        } else {
          // استفاده از tryParseMarkdownToBlocks برای تبدیل markdown به blocks
          const blocks = await editor.tryParseMarkdownToBlocks(content);
          setInitialContent(blocks);
          if (editor && blocks) {
            editor.replaceBlocks(editor.document, blocks);
          }
        }
      } catch (error) {
        console.error('Error converting markdown to blocks:', error);
        // در صورت خطا، محتوای markdown را به صورت plain text نمایش دهیم
        const fallbackBlocks: Block[] = [{
          id: "fallback",
          type: "paragraph",
          content: [{ type: "text", text: content }]
        }] as Block[];
        setInitialContent(fallbackBlocks);
        if (editor) {
          editor.replaceBlocks(editor.document, fallbackBlocks);
        }
      }
    };

    if (editor) {
      convertMarkdownToBlocks();
    }
  }, [content, editor]);

  // به‌روزرسانی حالت editable وقتی readonly تغییر کند
  useEffect(() => {
    if (editor) {
      editor.isEditable = !readonly;
    }
  }, [readonly, editor]);

  const handleSave = async () => {
    if (readonly || !editor) return;
    
    try {
      const blocks = editor.document;
      // استفاده از blocksToMarkdownLossy برای تبدیل blocks به markdown
      const markdownContent = await editor.blocksToMarkdownLossy(blocks);
      onChange(markdownContent);
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
    if (!readonly) {
      setHasUnsavedChanges(true);
    }
  };

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!readonly) {
      onTitleChange(e.target.value);
    }
  };

  return (
    <div className="w-full" dir="rtl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          {readonly ? (
            <h1 className="flex-1 text-3xl font-bold text-foreground" dir="rtl">
              {title}
            </h1>
          ) : (
            <input
              type="text"
              value={title}
              onChange={handleTitleInputChange}
              className="flex-1 text-3xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="عنوان صفحه را وارد کنید..."
              dir="rtl"
            />
          )}
          {!readonly && (
            <Button 
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="mr-4"
              size="sm"
            >
              <Save className="w-4 h-4 ml-2" />
              ذخیره
            </Button>
          )}
        </div>
        <div className="h-px bg-gradient-to-l from-border to-transparent" />
      </div>

      <div className={`border border-border rounded-lg overflow-hidden ${readonly ? 'bg-muted/20' : ''}`}>
        {editor && (
          <BlockNoteView 
            editor={editor} 
            onChange={handleEditorChange}
            theme="light"
          />
        )}
      </div>
      
      {!readonly && hasUnsavedChanges && (
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
            ${readonly ? 'cursor: default;' : ''}
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
          .bn-editor .ProseMirror ul,
          .bn-editor .ProseMirror ol {
            text-align: right;
            direction: rtl;
          }
          .bn-editor .ProseMirror li {
            text-align: right;
            direction: rtl;
          }
          .bn-editor .ProseMirror blockquote {
            text-align: right;
            direction: rtl;
            border-right: 4px solid #e5e7eb;
            border-left: none;
            padding-right: 1rem;
            padding-left: 0;
            margin-right: 0;
            margin-left: 1rem;
          }
          .bn-editor .ProseMirror table {
            direction: rtl;
          }
          .bn-editor .ProseMirror td,
          .bn-editor .ProseMirror th {
            text-align: right;
            direction: rtl;
          }
          /* استایل‌های ویژه برای بلوک‌های کد */
          .bn-editor .ProseMirror pre,
          .bn-editor .ProseMirror code,
          .bn-editor .ProseMirror .bn-code-block,
          .bn-editor .ProseMirror [data-node-type="codeBlock"] {
            direction: ltr !important;
            text-align: left !important;
            font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace !important;
          }
          .bn-editor .ProseMirror pre * {
            direction: ltr !important;
            text-align: left !important;
          }
          /* اصلاح حاشیه blockquote برای RTL */
          .dark .bn-editor .ProseMirror blockquote {
            border-right: 4px solid #374151;
            border-left: none;
          }
          ${readonly ? `
            .bn-editor .ProseMirror * {
              cursor: default !important;
            }
            .bn-editor .bn-block-content {
              pointer-events: none;
            }
            .bn-editor .bn-block-outer {
              pointer-events: none;
            }
            .bn-side-menu {
              display: none !important;
            }
            .bn-formatting-toolbar {
              display: none !important;
            }
            .bn-slash-menu {
              display: none !important;
            }
          ` : ''}
        `
      }} />
    </div>
  );
};

export default BlockNoteEditorComponent;
