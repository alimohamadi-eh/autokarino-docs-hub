
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Undo2, Redo2, Type, Heading1, Heading2, Heading3, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = "شروع به نوشتن کنید..." }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    setIsToolbarVisible(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only hide toolbar if focus is not moving to a toolbar button
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setTimeout(() => setIsToolbarVisible(false), 150);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold (Ctrl+B)" },
    { icon: Italic, command: "italic", title: "Italic (Ctrl+I)" },
    { icon: Underline, command: "underline", title: "Underline (Ctrl+U)" },
    { icon: Heading1, command: "formatBlock", value: "h1", title: "Heading 1" },
    { icon: Heading2, command: "formatBlock", value: "h2", title: "Heading 2" },
    { icon: Heading3, command: "formatBlock", value: "h3", title: "Heading 3" },
    { icon: Type, command: "formatBlock", value: "p", title: "Paragraph" },
    { icon: Quote, command: "formatBlock", value: "blockquote", title: "Quote" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
    { icon: Undo2, command: "undo", title: "Undo (Ctrl+Z)" },
    { icon: Redo2, command: "redo", title: "Redo (Ctrl+Y)" },
  ];

  return (
    <div className="relative" dir="rtl">
      {/* Floating Toolbar */}
      {isToolbarVisible && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-wrap gap-1">
          {toolbarButtons.map(({ icon: Icon, command, value, title }) => (
            <Button
              key={command + (value || '')}
              variant="ghost"
              size="sm"
              onClick={() => executeCommand(command, value)}
              title={title}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "min-h-96 w-full p-4 border rounded-md text-right",
          "prose prose-lg max-w-none",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "bg-background text-foreground",
          "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4",
          "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3",
          "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2",
          "[&_p]:mb-2 [&_p]:leading-relaxed",
          "[&_blockquote]:border-r-4 [&_blockquote]:border-primary [&_blockquote]:pr-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
          "[&_ul]:list-disc [&_ul]:pr-6 [&_ul]:mb-4",
          "[&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:mb-4",
          "[&_li]:mb-1"
        )}
        style={{ direction: 'rtl' }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
