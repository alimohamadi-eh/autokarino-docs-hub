
import { useState, useEffect } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const [currentContent, setCurrentContent] = useState(content);
  const { toast } = useToast();

  // تبدیل محتوای HTML/Markdown به فرمت BlockNote
  const parseContentToBlocks = (htmlContent: string): PartialBlock[] => {
    if (!htmlContent || htmlContent.trim() === '') {
      return [
        {
          type: "paragraph",
          content: "محتوای خود را اینجا بنویسید...",
        },
      ];
    }

    try {
      // تبدیل ساده HTML/Markdown به blocks
      const lines = htmlContent.split('\n').filter(line => line.trim() !== '');
      return lines.map(line => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('#')) {
          const level = trimmedLine.match(/^#+/)?.[0].length || 1;
          const text = trimmedLine.replace(/^#+\s*/, '');
          return {
            type: "heading",
            props: {
              level: Math.min(level, 3) as 1 | 2 | 3,
            },
            content: text,
          };
        }
        
        return {
          type: "paragraph",
          content: trimmedLine,
        };
      });
    } catch (error) {
      console.error("Error parsing content to blocks:", error);
      return [
        {
          type: "paragraph",
          content: htmlContent,
        },
      ];
    }
  };

  // تبدیل blocks به فرمت HTML/Markdown
  const convertBlocksToHTML = async (blocks: PartialBlock[]): Promise<string> => {
    try {
      return blocks.map(block => {
        if (!block || typeof block !== 'object') {
          return '';
        }

        // استخراج متن از محتوای block
        const getTextFromContent = (content: any): string => {
          if (typeof content === 'string') {
            return content;
          }
          if (Array.isArray(content)) {
            return content.map(item => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object' && item.text) {
                return item.text;
              }
              return '';
            }).join('');
          }
          if (content && typeof content === 'object' && content.text) {
            return content.text;
          }
          return '';
        };

        const text = getTextFromContent(block.content);
        
        if (block.type === "heading") {
          const level = (block.props as any)?.level || 1;
          return `${'#'.repeat(level)} ${text}`;
        }
        
        return text;
      }).filter(line => line.trim() !== '').join('\n\n');
    } catch (error) {
      console.error("Error converting blocks to HTML:", error);
      return '';
    }
  };

  // ایجاد editor با تنظیمات ساده
  const editor = useCreateBlockNote({
    initialContent: parseContentToBlocks(content),
  });

  // مدیریت تغییرات editor
  const handleEditorChange = async () => {
    if (editor) {
      try {
        const blocks = editor.document;
        const htmlContent = await convertBlocksToHTML(blocks);
        setCurrentContent(htmlContent);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error("Error handling editor change:", error);
      }
    }
  };

  // ذخیره تغییرات
  const handleSave = () => {
    onChange(currentContent);
    setHasUnsavedChanges(false);
    toast({
      title: "ذخیره شد",
      description: "تغییرات با موفقیت ذخیره شد",
    });
  };

  // بروزرسانی محتوا زمانی که content از خارج تغییر می‌کند
  useEffect(() => {
    if (editor && content !== currentContent && !hasUnsavedChanges) {
      try {
        const blocks = parseContentToBlocks(content);
        editor.replaceBlocks(editor.document, blocks);
        setCurrentContent(content);
      } catch (error) {
        console.error("Error updating editor content:", error);
      }
    }
  }, [content, editor, currentContent, hasUnsavedChanges]);

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

      <div className="prose prose-lg max-w-none" dir="rtl">
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
    </div>
  );
};

export default BlockNoteEditorComponent;
