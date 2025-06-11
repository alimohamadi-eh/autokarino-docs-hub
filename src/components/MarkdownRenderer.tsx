
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // پردازش محتوای Markdown برای نمایش HTML
  const processMarkdown = (text: string) => {
    let processedText = text;
    
    // تبدیل headings
    processedText = processedText.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h3>');
    processedText = processedText.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-6 text-foreground">$1</h2>');
    processedText = processedText.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-0 mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">$1</h1>');
    
    // تبدیل کدهای inline
    processedText = processedText.replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono">$1</code>');
    
    // تبدیل متن Bold
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
    
    // تبدیل متن Italic
    processedText = processedText.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // تبدیل strikethrough
    processedText = processedText.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');
    
    // تبدیل لینک‌ها
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');

    // پردازش خط به خط برای لیست‌ها و سایر عناصر
    const lines = processedText.split('\n');
    const processedLines = [];
    let inList = false;
    let inOrderedList = false;
    let inTable = false;
    let tableHeaders = [];
    let tableRows = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // پردازش جداول
      if (trimmedLine.includes('|') && trimmedLine.split('|').length > 2) {
        if (!inTable) {
          inTable = true;
          tableHeaders = trimmedLine.split('|').map(h => h.trim()).filter(h => h);
          continue;
        } else if (trimmedLine.match(/^\|[\s\-\|:]+\|$/)) {
          // خط جداکننده header - نادیده بگیر
          continue;
        } else {
          // سطر داده جدول
          const cells = trimmedLine.split('|').map(c => c.trim()).filter(c => c);
          tableRows.push(cells);
          continue;
        }
      } else if (inTable) {
        // پایان جدول
        processedLines.push(renderTable(tableHeaders, tableRows));
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
      
      // پردازش لیست‌های غیر مرتب
      if (trimmedLine.match(/^[\-\*\+] /)) {
        if (!inList) {
          if (inOrderedList) {
            processedLines.push('</ol>');
            inOrderedList = false;
          }
          processedLines.push('<ul class="list-disc list-inside space-y-2 my-4 mr-6">');
          inList = true;
        }
        processedLines.push(`<li class="mb-2">${trimmedLine.substring(2)}</li>`);
      } 
      // پردازش لیست‌های مرتب
      else if (trimmedLine.match(/^\d+\. /)) {
        if (!inOrderedList) {
          if (inList) {
            processedLines.push('</ul>');
            inList = false;
          }
          processedLines.push('<ol class="list-decimal list-inside space-y-2 my-4 mr-6">');
          inOrderedList = true;
        }
        const match = trimmedLine.match(/^\d+\. (.*)$/);
        if (match) {
          processedLines.push(`<li class="mb-2">${match[1]}</li>`);
        }
      } else {
        // بستن لیست‌ها اگر باز باشند
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        if (inOrderedList) {
          processedLines.push('</ol>');
          inOrderedList = false;
        }
        
        // پردازش blockquote
        if (trimmedLine.startsWith('> ')) {
          processedLines.push(`<blockquote class="border-r-4 border-primary pr-4 py-2 my-4 bg-muted/50 rounded-r italic">${trimmedLine.substring(2)}</blockquote>`);
        }
        // خط افقی
        else if (trimmedLine.match(/^[\-\*]{3,}$/)) {
          processedLines.push('<hr class="my-8 border-border">');
        }
        // خطوط خالی
        else if (trimmedLine === '') {
          processedLines.push('<br>');
        } 
        // متن عادی
        else if (!trimmedLine.startsWith('<h') && !trimmedLine.startsWith('<blockquote')) {
          processedLines.push(`<p class="mb-4 leading-7 text-foreground/90">${line}</p>`);
        } else {
          processedLines.push(line);
        }
      }
    }
    
    // بستن لیست‌ها و جداول در انتها
    if (inList) {
      processedLines.push('</ul>');
    }
    if (inOrderedList) {
      processedLines.push('</ol>');
    }
    if (inTable) {
      processedLines.push(renderTable(tableHeaders, tableRows));
    }
    
    return processedLines.join('\n');
  };

  // تابع برای render کردن جدول
  const renderTable = (headers: string[], rows: string[][]) => {
    return `
      <div class="my-6 overflow-x-auto">
        <table class="w-full border-collapse border border-border rounded-lg">
          <thead class="bg-muted/50">
            <tr>
              ${headers.map(header => `<th class="border border-border px-4 py-2 text-right font-semibold">${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr class="hover:bg-muted/30">
                ${row.map(cell => `<td class="border border-border px-4 py-2 text-right">${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const renderCodeBlock = (code: string, language: string) => {
    return (
      <div className="relative bg-slate-900 rounded-lg p-4 my-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {language}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(code);
              toast({
                description: "کد کپی شد!",
                duration: 2000,
              });
            }}
            className="text-slate-400 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </Button>
        </div>
        <pre className="text-sm text-slate-300 overflow-x-auto" dir="ltr">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  // جدا کردن کدبلاک‌ها از محتوا
  const parseContent = (content: string) => {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // اضافه کردن محتوای قبل از کدبلاک
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index);
        parts.push({
          type: 'text',
          content: processMarkdown(textContent)
        });
      }
      
      // اضافه کردن کدبلاک
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim()
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // اضافه کردن باقی محتوا
    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex);
      parts.push({
        type: 'text',
        content: processMarkdown(textContent)
      });
    }
    
    return parts;
  };

  const contentParts = parseContent(content);

  return (
    <div className="animate-fade-in">
      {contentParts.map((part, index) => (
        <div key={index}>
          {part.type === 'text' ? (
            <div dangerouslySetInnerHTML={{ __html: part.content }} />
          ) : (
            renderCodeBlock(part.content, part.language)
          )}
        </div>
      ))}
    </div>
  );
};

export default MarkdownRenderer;
