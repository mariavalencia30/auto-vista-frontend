
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Purchase, PaymentMethod, PurchaseStatus, UpdatePurchaseData } from '@/types/purchase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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

const updatePurchaseSchema = z.object({
  metodoPago: z.enum(['Tarjeta de Crédito', 'Efectivo', 'Transferencia Bancaria', 'Financiamiento'], {
    required_error: 'Por favor selecciona un método de pago',
  }),
  estado: z.enum(['pendiente', 'completada', 'cancelada'], {
    required_error: 'Por favor selecciona un estado',
  }),
});

type UpdatePurchaseFormProps = {
  purchase: Purchase;
  onSubmit: (data: UpdatePurchaseData) => void;
  isLoading: boolean;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  'Tarjeta de Crédito',
  'Efectivo',
  'Transferencia Bancaria',
  'Financiamiento',
];

const PURCHASE_STATUSES: PurchaseStatus[] = [
  'pendiente',
  'completada',
  'cancelada',
];

const UpdatePurchaseForm: React.FC<UpdatePurchaseFormProps> = ({
  purchase,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<UpdatePurchaseData>({
    resolver: zodResolver(updatePurchaseSchema),
    defaultValues: {
      metodoPago: purchase.metodoPago,
      estado: purchase.estado,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado de la Compra</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PURCHASE_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⟳</span> Actualizando...
            </>
          ) : (
            'Actualizar Compra'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdatePurchaseForm;
