
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DocsContextType } from '@/types/docs';
import { mockPageContents, mockNavigationData } from '@/data/mockData';
import { useDocsActions } from '@/hooks/useDocsActions';

const DocsContext = createContext<DocsContextType | undefined>(undefined);

interface DocsProviderProps {
  children: ReactNode;
}

export const DocsProvider: React.FC<DocsProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('program');
  const [activeVersion, setActiveVersion] = useState('v1');
  const [activePage, setActivePage] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pageContents, setPageContents] = useState(mockPageContents);
  const [navigationData, setNavigationData] = useState(mockNavigationData);

  const { updatePageContent, createNewPage, deletePage } = useDocsActions(
    pageContents,
    setPageContents,
    navigationData,
    setNavigationData,
    activePage,
    setActivePage
  );

  const value: DocsContextType = {
    activeTab,
    setActiveTab,
    activeVersion,
    setActiveVersion,
    activePage,
    setActivePage,
    searchQuery,
    setSearchQuery,
    navigationData,
    setNavigationData,
    isLoading,
    isEditMode,
    setIsEditMode,
    pageContents,
    updatePageContent,
    createNewPage,
    deletePage
  };

  return (
    <DocsContext.Provider value={value}>
      {children}
    </DocsContext.Provider>
  );
};

export const useDocs = () => {
  const context = useContext(DocsContext);
  if (context === undefined) {
    throw new Error('useDocs must be used within a DocsProvider');
  }
  return context;
};
