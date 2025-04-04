import axios from 'axios';
import { toast } from 'sonner';

// Configuración base del servidor
const API_BASE = 'http://localhost';
const USERS_PORT = '3309';
const VEHICLES_PORT = '3303';
const PURCHASES_PORT = '3310';

// Endpoints base para cada microservicio
const USERS_API = `${API_BASE}:${USERS_PORT}/api/usuarios`;
const VEHICLES_API = `${API_BASE}:${VEHICLES_PORT}/api/vehiculos`;

// Cliente axios para el servicio de usuarios
const usersApi = axios.create({
  baseURL: USERS_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente axios para el servicio de vehículos
const vehiclesApi = axios.create({
  baseURL: VEHICLES_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las solicitudes
const addAuthToken = (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Interceptor para manejar errores
const handleApiError = (error) => {
  console.error('API Error:', error.response);
  
  // Mensaje de error personalizado basado en el código de estado
  const errorMessage = error.response?.data?.message || 
                      'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
  
  toast.error(errorMessage);
  
  return Promise.reject(error);
};

// Aplicar interceptores al cliente de usuarios
usersApi.interceptors.request.use(addAuthToken, error => Promise.reject(error));
usersApi.interceptors.response.use(response => response, handleApiError);

// Aplicar interceptores al cliente de vehículos
vehiclesApi.interceptors.request.use(addAuthToken, error => Promise.reject(error));
vehiclesApi.interceptors.response.use(response => response, handleApiError);

// Servicios de autenticación y usuarios
export const authService = {
  register: async (userData: any) => {
    const { name, email, phone, password, ...rest } = userData;
    
    // Adaptar al formato esperado por la API
    const requestData = {
      nombre: name,
      email: email,
      telefono: phone,
      contraseña: password,
      ...rest
    };
    
    const response = await usersApi.post('/register', requestData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    // Adaptar al formato esperado por la API
    const requestData = {
      email: credentials.email,
      contraseña: credentials.password
    };
    
    const response = await usersApi.post('/login', requestData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
  },
  
  getCurrentUser: async () => {
    // Obtener el ID del usuario del token o del almacenamiento local
    // Esto puede variar según cómo se maneje en tu sistema
    // Por ahora, asumimos que la API tiene un endpoint para obtener el usuario actual
    const response = await usersApi.get('/profile');
    
    // Adaptar el formato recibido al formato esperado por la aplicación
    const userData = response.data;
    return {
      id: userData.id,
      name: userData.nombre,
      email: userData.email,
      phone: userData.telefono,
      role: userData.role || 'customer',
      // Otros campos si están disponibles
    };
  },
  
  updateProfile: async (userData: any) => {
    const { id, name, email, phone, ...rest } = userData;
    
    // Adaptar al formato esperado por la API
    const requestData = {
      nombre: name,
      email: email,
      telefono: phone,
      ...rest
    };
    
    const userId = id || 'me'; // Usar 'me' si no hay ID o el ID del usuario si está disponible
    const response = await usersApi.put(`/${userId}`, requestData);
    
    // Adaptar el formato recibido al formato esperado por la aplicación
    const updatedUserData = response.data;
    return {
      id: updatedUserData.id,
      name: updatedUserData.nombre,
      email: updatedUserData.email,
      phone: updatedUserData.telefono,
      role: updatedUserData.role || 'customer',
      address: updatedUserData.address,
      city: updatedUserData.city,
      zipCode: updatedUserData.zipCode,
      // Otros campos si están disponibles
    };
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

// Servicios de vehículos
export const vehicleService = {
  // Obtener todos los vehículos
  getAllVehicles: async () => {
    const response = await vehiclesApi.get('/');
    return response.data;
  },
  
  // Obtener un vehículo por ID
  getVehicleById: async (id) => {
    const response = await vehiclesApi.get(`/${id}`);
    return response.data;
  },
  
  // Crear un nuevo vehículo (admin)
  createVehicle: async (vehicleData) => {
    const response = await vehiclesApi.post('/', vehicleData);
    return response.data;
  },
  
  // Actualizar un vehículo (admin)
  updateVehicle: async (id, vehicleData) => {
    const response = await vehiclesApi.put(`/${id}`, vehicleData);
    return response.data;
  },
  
  // Eliminar un vehículo (admin)
  deleteVehicle: async (id) => {
    const response = await vehiclesApi.delete(`/${id}`);
    return response.data;
  },
  
  // Marcar un vehículo como vendido
  markAsSold: async (id) => {
    const response = await vehiclesApi.post(`/venta/${id}`);
    return response.data;
  }
};

export default {
  users: usersApi,
  vehicles: vehiclesApi,
  auth: authService,
  vehicle: vehicleService
};
