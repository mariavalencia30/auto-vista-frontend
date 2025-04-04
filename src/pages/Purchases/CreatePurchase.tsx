
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import purchaseService from '@/services/purchaseService';
import { PurchaseFormData } from '@/types/purchase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PurchaseForm from '@/components/PurchaseForm';

const CreatePurchase: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicleId } = useParams<{ vehicleId?: string }>();
  
  // Convertir el parámetro vehicleId a número si existe
  const selectedVehicleId = vehicleId ? parseInt(vehicleId, 10) : undefined;

  const handleCreatePurchase = async (formData: PurchaseFormData) => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Agregar userId al formData
      const purchaseData = {
        ...formData,
        userId: parseInt(user.id),
      };
      
      await purchaseService.createPurchase(purchaseData);
      toast.success('¡Compra registrada con éxito!');
      
      // Navegar al historial de compras del usuario
      navigate('/purchases/history');
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      toast.error('No se pudo registrar la compra. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Comprar Vehículo</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <PurchaseForm 
              onSubmit={handleCreatePurchase}
              vehicleIdPreselected={selectedVehicleId}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatePurchase;
