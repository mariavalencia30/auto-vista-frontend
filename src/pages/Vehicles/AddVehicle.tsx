
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService } from '@/services/api';
import { VehicleFormData } from '@/types/vehicle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleForm from '@/components/VehicleForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AddVehicle = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirigir si no es admin
  if (user?.role !== 'admin') {
    navigate('/vehicles');
    toast.error('No tienes permisos para agregar vehículos.');
  }

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      setIsSubmitting(true);
      await vehicleService.createVehicle(data);
      toast.success('Vehículo agregado correctamente');
      navigate('/vehicles');
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      toast.error('No se pudo agregar el vehículo. Por favor, intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/vehicles')} 
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a vehículos
            </Button>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h1 className="text-2xl font-bold mb-6">Agregar nuevo vehículo</h1>
              <VehicleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddVehicle;
