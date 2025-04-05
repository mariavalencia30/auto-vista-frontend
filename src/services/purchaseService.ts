
import axios from 'axios';
import { toast } from 'sonner';
import { Purchase, PurchaseFormData, UpdatePurchaseData } from '@/types/purchase';

// Configuración base del servidor
const API_BASE = 'http://192.168.100.3';
const PURCHASES_PORT = '3310';
const PURCHASES_API = `${API_BASE}:${PURCHASES_PORT}/api/compras`;

// Cliente axios para el servicio de compras
const purchasesApi = axios.create({
  baseURL: PURCHASES_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las solicitudes
purchasesApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
purchasesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response);
    const errorMessage = error.response?.data?.message || 
                        'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Servicios de compras
export const purchaseService = {
  // Crear una nueva compra
  createPurchase: async (purchaseData: PurchaseFormData): Promise<Purchase> => {
    const response = await purchasesApi.post('/', purchaseData);
    return response.data;
  },

  // Obtener todas las compras de un usuario
  getUserPurchases: async (userId: number): Promise<Purchase[]> => {
    const response = await purchasesApi.get(`/user/${userId}`);
    return response.data;
  },

  // Obtener una compra por ID
  getPurchaseById: async (id: number): Promise<Purchase> => {
    const response = await purchasesApi.get(`/${id}`);
    return response.data;
  },

  // Actualizar una compra
  updatePurchase: async (id: number, purchaseData: UpdatePurchaseData): Promise<Purchase> => {
    const response = await purchasesApi.put(`/${id}`, purchaseData);
    return response.data;
  },

  // Eliminar una compra
  deletePurchase: async (id: number): Promise<void> => {
    await purchasesApi.delete(`/${id}`);
  },

  // Registrar una venta realizada
  registerSale: async (id: number): Promise<Purchase> => {
    const response = await purchasesApi.post(`/venta/${id}`);
    return response.data;
  }
};

export default purchaseService;
