import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

export interface User {
  id: string;
  email: string;
  companyName: string;
  kvkNumber: string;
  vatNumber: string;
  role: 'user' | 'admin';
}

const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await axios.post(`${API_URL}/change-password`, { oldPassword, newPassword });
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axios.delete(`${API_URL}/${userId}`);
  }
};

export default userService;