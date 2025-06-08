
import { useState, useEffect, useMemo } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

interface BlockNoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const BlockNoteEditorComponent = ({ content, onChange, title, onTitleChange }: BlockNoteEditorProps) => {
  const [initialContent, setInitialContent] = useState<PartialBlock[]>([]);

  // Parse content to blocks format for BlockNote
  const parseContentToBlocks = (htmlContent: string): PartialBlock[] => {
    if (!htmlContent || htmlContent.trim() === '') {
      return [
        {
          type: "paragraph",
          content: "محتوای خود را اینجا بنویسید...",
        },
      ];
    }

    // Simple HTML to blocks conversion
    const lines = htmlContent.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#')) {
        return {
          type: "heading",
          props: {
            level: trimmedLine.startsWith('###') ? 3 : trimmedLine.startsWith('##') ? 2 : 1,
          },
          content: trimmedLine.replace(/^#+\s*/, ''),
        };
      }
      return {
        type: "paragraph",
        content: trimmedLine,
      };
    });
  };

  // Convert blocks to HTML
  const convertBlocksToHTML = (blocks: PartialBlock[]): string => {
    return blocks.map(block => {
      if (block.type === "heading") {
        const level = (block.props as any)?.level || 1;
        return `${'#'.repeat(level)} ${block.content}`;
      }
      return block.content || '';
    }).join('\n\n');
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  useEffect(() => {
    const blocks = parseContentToBlocks(content);
    setInitialContent(blocks);
    if (editor && blocks.length > 0) {
      editor.replaceBlocks(editor.document, blocks);
    }
  }, [content, editor]);

  const handleEditorChange = () => {
    if (editor) {
      const blocks = editor.document;
      const htmlContent = convertBlocksToHTML(blocks);
      onChange(htmlContent);
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

      <div className="prose prose-lg max-w-none" dir="rtl">
        <BlockNoteView
          editor={editor}
          onChange={handleEditorChange}
          theme="light"
        />
      </div>
    </div>
  );
};

export default BlockNoteEditorComponent;
