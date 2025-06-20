
import { useDocs } from "@/contexts/DocsContext";
import Breadcrumb from "./Breadcrumb";
import BlockNoteEditor from "./BlockNoteEditor";
import { useEffect, useState } from "react";

const ContentArea = () => {
  const { 
    activePage, 
    pageContents, 
    updatePageContent, 
    isEditMode 
  } = useDocs();

  const [editorKey, setEditorKey] = useState(0);

  const currentPage = pageContents[activePage];

  // وقتی صفحه فعال تغییر کند، editor را به‌روزرسانی کن
  useEffect(() => {
    setEditorKey(prev => prev + 1);
  }, [activePage, isEditMode]);

  const handleContentChange = (content: string) => {
    updatePageContent(activePage, content);
  };

  const handleTitleChange = (title: string) => {
    updatePageContent(activePage, currentPage?.content || "", title);
  };

  // اگر صفحه‌ای پیدا نشد، محتوای پیش‌فرض نمایش دهیم
  const pageContent = currentPage?.content || `# صفحه ${activePage}

محتوای این صفحه هنوز آماده نیست. لطفاً بعداً مراجعه کنید.

## در حال توسعه

این بخش از مستندات در حال تکمیل است.`;

  const pageTitle = currentPage?.title || `صفحه ${activePage}`;

  return (
    <main className="flex-1 overflow-auto" dir="rtl">
      <div className="max-w-4xl mx-auto p-6">
        {!isEditMode && (
          <div className="mb-6">
            <Breadcrumb />
          </div>
        )}
        
        <BlockNoteEditor
          key={editorKey}
          content={pageContent}
          onChange={handleContentChange}
          title={pageTitle}
          onTitleChange={handleTitleChange}
          readonly={!isEditMode}
        />
      </div>
    </main>
  );
};

export default ContentArea;
