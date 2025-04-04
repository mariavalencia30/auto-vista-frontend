
import { Vehicle } from './vehicle';

export type PaymentMethod = 'Tarjeta de Crédito' | 'Efectivo' | 'Transferencia Bancaria' | 'Financiamiento';
export type PurchaseStatus = 'pendiente' | 'completada' | 'cancelada';

export interface Purchase {
  id: number;
  userId: number;
  vehicleId: number;
  precioTotal: number;
  metodoPago: PaymentMethod;
  estado: PurchaseStatus;
  fechaCompra: string;
  vehicle?: Vehicle;
}

export interface PurchaseFormData {
  vehicleId: number;
  precioTotal: number;
  metodoPago: PaymentMethod;
}

export interface UpdatePurchaseData {
  metodoPago?: PaymentMethod;
  estado?: PurchaseStatus;
}
