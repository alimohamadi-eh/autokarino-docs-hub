
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
}

const BlockNoteEditorComponent = ({ content, onChange, title, onTitleChange }: BlockNoteEditorProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  // تبدیل محتوای Markdown به Blocks
  const parseMarkdownToBlocks = (markdown: string): Block[] => {
    if (!markdown || markdown.trim() === '') {
      return [{
        id: "initial",
        type: "paragraph",
        content: [{ type: "text", text: "محتوای خود را اینجا بنویسید..." }]
      }] as Block[];
    }

    const lines = markdown.split('\n');
    const blocks: Block[] = [];
    let currentParagraph = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine === '') {
        if (currentParagraph) {
          blocks.push({
            id: `block-${blocks.length}`,
            type: "paragraph",
            content: [{ type: "text", text: currentParagraph.trim() }]
          } as Block);
          currentParagraph = '';
        }
        continue;
      }

      // Headers
      if (trimmedLine.startsWith('### ')) {
        if (currentParagraph) {
          blocks.push({
            id: `block-${blocks.length}`,
            type: "paragraph",
            content: [{ type: "text", text: currentParagraph.trim() }]
          } as Block);
          currentParagraph = '';
        }
        blocks.push({
          id: `block-${blocks.length}`,
          type: "heading",
          props: { level: 3 },
          content: [{ type: "text", text: trimmedLine.substring(4) }]
        } as Block);
      } else if (trimmedLine.startsWith('## ')) {
        if (currentParagraph) {
          blocks.push({
            id: `block-${blocks.length}`,
            type: "paragraph",
            content: [{ type: "text", text: currentParagraph.trim() }]
          } as Block);
          currentParagraph = '';
        }
        blocks.push({
          id: `block-${blocks.length}`,
          type: "heading",
          props: { level: 2 },
          content: [{ type: "text", text: trimmedLine.substring(3) }]
        } as Block);
      } else if (trimmedLine.startsWith('# ')) {
        if (currentParagraph) {
          blocks.push({
            id: `block-${blocks.length}`,
            type: "paragraph",
            content: [{ type: "text", text: currentParagraph.trim() }]
          } as Block);
          currentParagraph = '';
        }
        blocks.push({
          id: `block-${blocks.length}`,
          type: "heading",
          props: { level: 1 },
          content: [{ type: "text", text: trimmedLine.substring(2) }]
        } as Block);
      } else if (trimmedLine.startsWith('```')) {
        // Code blocks - ignore for now in this simple parser
        currentParagraph += line + '\n';
      } else {
        currentParagraph += line + '\n';
      }
    }

    if (currentParagraph.trim()) {
      blocks.push({
        id: `block-${blocks.length}`,
        type: "paragraph",
        content: [{ type: "text", text: currentParagraph.trim() }]
      } as Block);
    }

    return blocks.length > 0 ? blocks : [{
      id: "initial",
      type: "paragraph",
      content: [{ type: "text", text: "محتوای خود را اینجا بنویسید..." }]
    }] as Block[];
  };

  // ایجاد editor instance
  const editor = useCreateBlockNote({
    initialContent: parseMarkdownToBlocks(content),
  });

  // به‌روزرسانی محتوای editor وقتی prop content تغییر کند
  useEffect(() => {
    const newBlocks = parseMarkdownToBlocks(content);
    editor.replaceBlocks(editor.document, newBlocks);
  }, [content, editor]);

  const handleSave = async () => {
    try {
      const blocks = editor.document;
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
