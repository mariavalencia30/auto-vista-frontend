
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import purchaseService from '@/services/purchaseService';
import { Purchase } from '@/types/purchase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PurchaseList from '@/components/PurchaseList';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminPurchaseList: React.FC = () => {
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Verificar si el usuario es administrador y redirigir si no lo es
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/purchases/history');
    }
  }, [user, navigate]);

  // Usar React Query para cargar todas las compras
  const { 
    data: purchases = [], 
    isLoading,
    isError,
    error 
  } = useQuery({
    queryKey: ['admin-purchases'],
    queryFn: async () => {
      // En un sistema real, habría un endpoint específico para administradores
      // que devuelva todas las compras. Aquí usamos el endpoint existente como ejemplo.
      if (!user) throw new Error('Usuario no autenticado');
      
      const userId = parseInt(user.id);
      return purchaseService.getUserPurchases(userId);
    },
    enabled: !!user && user.role === 'admin'
  });

  // Mutación para eliminar una compra
  const deletePurchaseMutation = useMutation({
    mutationFn: (purchaseId: number) => purchaseService.deletePurchase(purchaseId),
    onSuccess: () => {
      toast.success('Compra eliminada con éxito');
      queryClient.invalidateQueries({ queryKey: ['admin-purchases'] });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      console.error('Error al eliminar compra:', error);
      toast.error('No se pudo eliminar la compra');
    }
  });

  // Mutación para completar una compra
  const completePurchaseMutation = useMutation({
    mutationFn: (purchaseId: number) => purchaseService.registerSale(purchaseId),
    onSuccess: () => {
      toast.success('Venta registrada con éxito');
      queryClient.invalidateQueries({ queryKey: ['admin-purchases'] });
      setShowCompleteDialog(false);
    },
    onError: (error) => {
      console.error('Error al registrar venta:', error);
      toast.error('No se pudo registrar la venta');
    }
  });

  const handleDeletePurchase = (id: number) => {
    setSelectedPurchaseId(id);
    setShowDeleteDialog(true);
  };

  const handleCompletePurchase = (id: number) => {
    setSelectedPurchaseId(id);
    setShowCompleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedPurchaseId) return;
    deletePurchaseMutation.mutate(selectedPurchaseId);
  };

  const confirmComplete = () => {
    if (!selectedPurchaseId) return;
    completePurchaseMutation.mutate(selectedPurchaseId);
  };

  // Mostrar mensaje de error si la carga falla
  if (isError) {
    console.error('Error al cargar compras:', error);
    toast.error('No se pudieron cargar las compras. Por favor, intente de nuevo más tarde.');
  }

  if (!user || user.role !== 'admin') {
    return null; // Redirección manejada en useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Administración de Compras</h1>
          
          <PurchaseList 
            purchases={purchases} 
            isLoading={isLoading}
            onDeletePurchase={handleDeletePurchase}
            onCompletePurchase={handleCompletePurchase}
          />
          
          {/* Diálogo de confirmación para eliminar compra */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar esta compra? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDelete}
                  disabled={deletePurchaseMutation.isPending}
                >
                  {deletePurchaseMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Diálogo de confirmación para completar compra */}
          <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar venta</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas marcar esta compra como completada? 
                  El vehículo será marcado como vendido.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmComplete}
                  disabled={completePurchaseMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {completePurchaseMutation.isPending ? 'Procesando...' : 'Confirmar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPurchaseList;
