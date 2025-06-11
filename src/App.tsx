
import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DocsProvider } from "@/contexts/DocsContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DocsProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </DocsProvider>
    </QueryClientProvider>
  );
}

export default App;
