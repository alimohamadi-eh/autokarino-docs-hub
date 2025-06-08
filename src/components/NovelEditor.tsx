
import { useState, useEffect, useRef } from "react";

interface NovelEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const NovelEditor = ({ content, onChange, title, onTitleChange }: NovelEditorProps) => {
  const [editorContent, setEditorContent] = useState(content);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange(newContent);
  };

  // For now, let's create a simple rich text editor fallback
  // until we can properly configure the novel editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleContentEdit = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      handleContentChange(newContent);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-3xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          placeholder="عنوان صفحه را وارد کنید..."
        />
        <div className="h-px bg-gradient-to-l from-border to-transparent mt-4" />
      </div>

      <div className="prose prose-lg max-w-none">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentEdit}
          className="min-h-[500px] prose prose-lg max-w-none focus:outline-none border border-gray-200 rounded-lg p-4"
          style={{ direction: 'rtl' }}
          suppressContentEditableWarning={true}
        />
      </div>
    </div>
  );
};

export default NovelEditor;
