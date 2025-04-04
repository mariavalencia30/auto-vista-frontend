
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService } from '@/services/api';
import { Vehicle, VehicleFormData } from '@/types/vehicle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleForm from '@/components/VehicleForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EditVehicle = () => {
  const { id } = useParams();
  const vehicleId = parseInt(id as string);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirigir si no es admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/vehicles');
      toast.error('No tienes permisos para editar vehículos.');
    }
  }, [user, navigate]);

  // Cargar el vehículo
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const data = await vehicleService.getVehicleById(vehicleId);
        setVehicle(data);
      } catch (error) {
        console.error('Error al cargar el vehículo:', error);
        toast.error('No se pudo cargar el vehículo para editar.');
        navigate('/vehicles');
      } finally {
        setIsLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId, navigate]);

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      setIsSubmitting(true);
      await vehicleService.updateVehicle(vehicleId, data);
      toast.success('Vehículo actualizado correctamente');
      navigate(`/vehicles/${vehicleId}`);
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      toast.error('No se pudo actualizar el vehículo. Por favor, intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Cargando información del vehículo...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Vehículo no encontrado.</p>
            <Button 
              onClick={() => navigate('/vehicles')} 
              className="mt-4"
            >
              Volver a vehículos
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/vehicles/${vehicleId}`)} 
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al detalle
            </Button>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h1 className="text-2xl font-bold mb-6">Editar vehículo</h1>
              <VehicleForm 
                initialData={vehicle} 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditVehicle;
