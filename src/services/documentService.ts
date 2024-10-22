import axios from 'axios';

const API_URL = 'http://localhost:3000/api/documents';

export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const documentService = {
  getAllDocuments: async (): Promise<Document[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getDocument: async (id: string): Promise<Document> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createDocument: async (document: Partial<Document>): Promise<Document> => {
    const response = await axios.post(API_URL, document);
    return response.data;
  },

  updateDocument: async (id: string, document: Partial<Document>): Promise<Document> => {
    const response = await axios.put(`${API_URL}/${id}`, document);
    return response.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  analyzeDocument: async (id: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/${id}/analyze`);
    return response.data;
  }
};

export default documentService;