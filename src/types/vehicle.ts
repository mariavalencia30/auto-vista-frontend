
export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  kilometraje: number;
  vendido?: boolean;
}

export interface VehicleFormData {
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  kilometraje: number;
}
