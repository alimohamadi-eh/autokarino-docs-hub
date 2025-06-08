
import { useState, useEffect } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote, BlockNoteView } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

interface NovelEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const NovelEditor = ({ content, onChange, title, onTitleChange }: NovelEditorProps) => {
  const editor = useCreateBlockNote({
    initialContent: content ? [
      {
        type: "paragraph",
        content: content,
      } as PartialBlock
    ] : undefined,
  });

  useEffect(() => {
    const handleChange = async () => {
      const html = await editor.blocksToHTMLLossy(editor.document);
      onChange(html);
    };

    editor.onChange(handleChange);
  }, [editor, onChange]);

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

      <div className="prose prose-lg max-w-none" style={{ direction: 'rtl' }}>
        <BlockNoteView 
          editor={editor} 
          theme="light"
          style={{
            minHeight: '500px',
            direction: 'rtl'
          }}
        />
      </div>
    </div>
  );
};

export default NovelEditor;
