
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import { DocsProvider } from "@/contexts/DocsContext";

const DocsLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <DocsProvider>
      <div className="min-h-screen mesh-background">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar isOpen={isSidebarOpen} />
          <ContentArea />
        </div>
      </div>
    </DocsProvider>
  );
};

export default DocsLayout;
