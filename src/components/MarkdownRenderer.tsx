
import { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    // اگر محتوا HTML است، مستقیماً آن را برمی‌گردانیم
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    
    // در غیر این صورت آن را به عنوان متن ساده در نظر می‌گیریم
    return content.replace(/\n/g, '<br>');
  }, [content]);

  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:text-right prose-p:text-right"
      dir="rtl"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default MarkdownRenderer;
