import React, { useState, useEffect } from 'react';
import documentService, { Document } from '../services/documentService';

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const fetchedDocuments = await documentService.getAllDocuments();
        setDocuments(fetchedDocuments);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch documents');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Documents</h2>
      {documents.length === 0 ? (
        <p>No documents found. Start by uploading a new document.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                  <p className="text-sm text-gray-500">{doc.category}</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentList;