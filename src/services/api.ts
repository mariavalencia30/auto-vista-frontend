
import axios from 'axios';
import { toast } from 'sonner';

// Configuración base del servidor
const API_BASE = 'http://102.168.100.3';
const USERS_PORT = '3309';
const VEHICLES_PORT = '3303';
const PURCHASES_PORT = '3310';

// Endpoints base para cada microservicio
const USERS_API = `${API_BASE}:${USERS_PORT}/api/users`;

// Cliente axios para el servicio de usuarios
const usersApi = axios.create({
  baseURL: USERS_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las solicitudes
usersApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
usersApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response);
    
    // Mensaje de error personalizado basado en el código de estado
    const errorMessage = error.response?.data?.message || 
                         'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
    
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

// Servicios de autenticación y usuarios
export const authService = {
  register: async (userData: any) => {
    const response = await usersApi.post('/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await usersApi.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
  },
  
  getCurrentUser: async () => {
    const response = await usersApi.get('/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await usersApi.put('/profile', userData);
    return response.data;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

export default {
  users: usersApi,
  auth: authService
};
