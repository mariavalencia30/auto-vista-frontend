
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import purchaseService from '@/services/purchaseService';
import { Purchase, UpdatePurchaseData } from '@/types/purchase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UpdatePurchaseForm from '@/components/UpdatePurchaseForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const EditPurchase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario es administrador
    if (user && user.role !== 'admin') {
      toast.error('No tienes permisos para editar compras');
      navigate('/purchases/history');
      return;
    }

    const fetchPurchase = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const purchaseId = parseInt(id);
        const purchaseData = await purchaseService.getPurchaseById(purchaseId);
        setPurchase(purchaseData);
      } catch (error) {
        console.error('Error al cargar los datos de la compra:', error);
        toast.error('No se pudieron cargar los datos de la compra');
        navigate(`/purchases/${id}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPurchase();
  }, [id, navigate, user]);

  const handleUpdatePurchase = async (data: UpdatePurchaseData) => {
    if (!purchase || !id) return;
    
    try {
      setIsSubmitting(true);
      const purchaseId = parseInt(id);
      await purchaseService.updatePurchase(purchaseId, data);
      toast.success('Compra actualizada con éxito');
      navigate(`/purchases/${id}`);
    } catch (error) {
      console.error('Error al actualizar la compra:', error);
      toast.error('No se pudo actualizar la compra');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Compra no encontrada</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No se encontró la compra solicitada o no tienes permiso para editarla.</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => navigate('/purchases/history')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al historial
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/purchases/${id}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">Editar Compra #{purchase.id}</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Información de la Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdatePurchaseForm 
                purchase={purchase}
                onSubmit={handleUpdatePurchase}
                isLoading={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditPurchase;
