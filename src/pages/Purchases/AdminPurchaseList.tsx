
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
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
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario es administrador y redirigir si no lo es
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/purchases/history');
    }
  }, [user, navigate]);

  // Cargar todas las compras
  useEffect(() => {
    const fetchAllPurchases = async () => {
      try {
        setIsLoading(true);
        
        // Aquí normalmente habría un endpoint para obtener todas las compras,
        // pero como no está en los requisitos, usamos el endpoint de usuario
        // con el ID del administrador actual
        if (user) {
          const userId = parseInt(user.id);
          const data = await purchaseService.getUserPurchases(userId);
          setPurchases(data);
        }
      } catch (error) {
        console.error('Error al cargar compras:', error);
        toast.error('No se pudieron cargar las compras');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchAllPurchases();
    }
  }, [user]);

  const handleDeletePurchase = (id: number) => {
    setSelectedPurchaseId(id);
    setShowDeleteDialog(true);
  };

  const handleCompletePurchase = (id: number) => {
    setSelectedPurchaseId(id);
    setShowCompleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedPurchaseId) return;
    
    try {
      setIsProcessing(true);
      await purchaseService.deletePurchase(selectedPurchaseId);
      toast.success('Compra eliminada con éxito');
      
      // Actualizar la lista de compras
      setPurchases(purchases.filter(p => p.id !== selectedPurchaseId));
    } catch (error) {
      console.error('Error al eliminar compra:', error);
      toast.error('No se pudo eliminar la compra');
    } finally {
      setIsProcessing(false);
      setShowDeleteDialog(false);
    }
  };

  const confirmComplete = async () => {
    if (!selectedPurchaseId) return;
    
    try {
      setIsProcessing(true);
      await purchaseService.registerSale(selectedPurchaseId);
      toast.success('Venta registrada con éxito');
      
      // Actualizar la lista de compras
      const updatedPurchases = [...purchases];
      const index = updatedPurchases.findIndex(p => p.id === selectedPurchaseId);
      if (index !== -1) {
        updatedPurchases[index] = {
          ...updatedPurchases[index],
          estado: 'completada'
        };
        setPurchases(updatedPurchases);
      }
    } catch (error) {
      console.error('Error al registrar venta:', error);
      toast.error('No se pudo registrar la venta');
    } finally {
      setIsProcessing(false);
      setShowCompleteDialog(false);
    }
  };

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
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Eliminando...' : 'Eliminar'}
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
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar'}
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
