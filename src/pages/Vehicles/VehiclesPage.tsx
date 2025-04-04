
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService } from '@/services/api';
import { Vehicle } from '@/types/vehicle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleList from '@/components/VehicleList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  // Cargar los vehículos cuando se monta el componente
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const data = await vehicleService.getAllVehicles();
        setVehicles(data);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
        toast.error('No se pudieron cargar los vehículos. Por favor, intente de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Vehículos disponibles</h1>
            
            {isAdmin && (
              <Button onClick={() => navigate('/vehicles/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo vehículo
              </Button>
            )}
          </div>
          
          <VehicleList vehicles={vehicles} isLoading={isLoading} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VehiclesPage;
