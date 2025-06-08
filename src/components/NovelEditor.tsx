

import { EditorRoot, EditorContent, type JSONContent } from "novel";
import { useState } from "react";

interface NovelEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const NovelEditor = ({ content, onChange, title, onTitleChange }: NovelEditorProps) => {
  const [editorContent, setEditorContent] = useState(content);

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange(newContent);
  };

  // Convert HTML string to JSONContent format
  const getInitialContent = (): JSONContent => {
    if (!content || content.trim() === '') {
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: []
          }
        ]
      };
    }
    
    // For now, create a basic document structure
    // In production, you might want to use a proper HTML to JSONContent converter
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: content.replace(/<[^>]*>/g, '') // Simple HTML strip for now
            }
          ]
        }
      ]
    };
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
        <EditorRoot>
          <EditorContent
            initialContent={getInitialContent()}
            onUpdate={({ editor }) => {
              const html = editor.getHTML();
              handleContentChange(html);
            }}
            className="min-h-[500px]"
            editorProps={{
              attributes: {
                class: "prose prose-lg max-w-none focus:outline-none",
                dir: "rtl"
              }
            }}
          />
        </EditorRoot>
      </div>
    </div>
  );
};

export default NovelEditor;

