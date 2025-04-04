
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
import { ShoppingCart } from 'lucide-react';

const PurchaseHistory: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);
        const userId = parseInt(user.id);
        const data = await purchaseService.getUserPurchases(userId);
        setPurchases(data);
      } catch (error) {
        console.error('Error al cargar historial de compras:', error);
        toast.error('No se pudo cargar tu historial de compras');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Mi Historial de Compras</h1>
            
            <Button onClick={() => navigate('/vehicles')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ver Vehículos Disponibles
            </Button>
          </div>
          
          <PurchaseList 
            purchases={purchases} 
            isLoading={isLoading} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PurchaseHistory;
