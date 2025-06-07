
import { useDocs } from "@/contexts/DocsContext";

const Breadcrumb = () => {
  const { activeTab, activePage } = useDocs();

  const getTabLabel = (tab: string) => {
    const labels: Record<string, string> = {
      program: 'برنامه',
      api: 'API',
      app: 'اپلیکیشن'
    };
    return labels[tab] || tab;
  };

  const getPageLabel = (page: string) => {
    const labels: Record<string, string> = {
      intro: 'مقدمه',
      'quick-start': 'شروع سریع',
      iterator: 'تکرارگر',
      conditions: 'شرط‌ها',
      variables: 'متغیرها'
    };
    return labels[page] || page;
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <span className="text-foreground font-medium">مستندات</span>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="text-foreground font-medium">{getTabLabel(activeTab)}</span>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>{getPageLabel(activePage)}</span>
    </nav>
  );
};

export default Breadcrumb;
