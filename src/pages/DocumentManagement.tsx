import React from 'react';
import DocumentList from '../components/DocumentList';
import DocumentUpload from '../components/DocumentUpload';

const DocumentManagement: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Document Management</h1>
      <DocumentUpload />
      <DocumentList />
    </div>
  );
};

export default DocumentManagement;