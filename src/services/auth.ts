import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Update this with your actual API URL

export interface User {
  id: string;
  email: string;
  companyName: string;
  kvkNumber: string;
  vatNumber: string;
  role: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  companyName: string;
  kvkNumber: string;
  vatNumber: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('sessionToken', response.data.sessionToken);
    return response.data.user;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('sessionToken', response.data.sessionToken);
    return response.data.user;
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    const sessionToken = localStorage.getItem('sessionToken');
    if (token && sessionToken) {
      try {
        await axios.post(`${API_URL}/auth/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Session-Token': sessionToken
          }
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('sessionToken');
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('token');
    const sessionToken = localStorage.getItem('sessionToken');
    if (!token || !sessionToken) return null;

    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Session-Token': sessionToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
};

export default authService;