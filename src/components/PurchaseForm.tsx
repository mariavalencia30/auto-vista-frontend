
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PurchaseFormData, PaymentMethod } from '@/types/purchase';
import { Vehicle } from '@/types/vehicle';
import { formatCurrency } from '@/lib/formatters';
import { vehicleService } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const purchaseSchema = z.object({
  vehicleId: z.number({
    required_error: 'Por favor selecciona un vehículo',
  }),
  metodoPago: z.enum(['Tarjeta de Crédito', 'Efectivo', 'Transferencia Bancaria', 'Financiamiento'], {
    required_error: 'Por favor selecciona un método de pago',
  }),
});

type PurchaseFormProps = {
  onSubmit: (data: PurchaseFormData) => void;
  vehicleIdPreselected?: number;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  'Tarjeta de Crédito',
  'Efectivo',
  'Transferencia Bancaria',
  'Financiamiento',
];

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSubmit, vehicleIdPreselected }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      vehicleId: vehicleIdPreselected || 0,
      metodoPago: 'Tarjeta de Crédito',
    },
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const data = await vehicleService.getAllVehicles();
        // Filtrar vehículos que no estén marcados como vendidos
        const availableVehicles = data.filter(vehicle => !vehicle.vendido);
        setVehicles(availableVehicles);
        
        // Si hay un vehículo preseleccionado, buscar sus detalles
        if (vehicleIdPreselected) {
          const preselectedVehicle = data.find(v => v.id === vehicleIdPreselected);
          if (preselectedVehicle && !preselectedVehicle.vendido) {
            setSelectedVehicle(preselectedVehicle);
            form.setValue('vehicleId', preselectedVehicle.id);
          } else if (preselectedVehicle?.vendido) {
            toast.error('El vehículo seleccionado ya no está disponible');
          }
        }
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
        toast.error('No se pudieron cargar los vehículos disponibles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [vehicleIdPreselected, form]);

  // Actualizar el vehículo seleccionado cuando cambia la selección
  const handleVehicleSelect = (vehicleId: string) => {
    const selectedId = parseInt(vehicleId, 10);
    const vehicle = vehicles.find(v => v.id === selectedId) || null;
    setSelectedVehicle(vehicle);
    form.setValue('vehicleId', selectedId);
    
    if (vehicle) {
      // Actualizar el precio total con el precio del vehículo
      form.setValue('precioTotal', vehicle.precio);
    }
  };

  const handleSubmit = (data: z.infer<typeof purchaseSchema>) => {
    // Asegurarse de que hay un vehículo seleccionado
    if (!selectedVehicle) {
      toast.error('Debes seleccionar un vehículo');
      return;
    }

    // Crear el objeto de datos de compra - asegurarse que vehicleId es siempre un número
    const purchaseData: PurchaseFormData = {
      vehicleId: data.vehicleId,  // Asegurarse de que este es un número válido
      metodoPago: data.metodoPago,
      precioTotal: selectedVehicle.precio,
    };

    onSubmit(purchaseData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Selección de vehículo */}
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehículo</FormLabel>
              <Select
                disabled={!!vehicleIdPreselected}
                onValueChange={handleVehicleSelect}
                defaultValue={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un vehículo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                        {vehicle.marca} {vehicle.modelo} ({vehicle.año}) - {formatCurrency(vehicle.precio)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-vehicles" disabled>
                      No hay vehículos disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mostrar detalles del vehículo seleccionado */}
        {selectedVehicle && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detalles del vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Marca:</p>
                  <p>{selectedVehicle.marca}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Modelo:</p>
                  <p>{selectedVehicle.modelo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Año:</p>
                  <p>{selectedVehicle.año}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Kilometraje:</p>
                  <p>{selectedVehicle.kilometraje} km</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Precio:</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(selectedVehicle.precio)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Método de pago */}
        <FormField
          control={form.control}
          name="metodoPago"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pago</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona método de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Selecciona cómo deseas pagar por este vehículo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={!selectedVehicle || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⟳</span> Procesando...
            </>
          ) : (
            'Completar Compra'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PurchaseForm;
