
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService } from '@/services/api';
import { Vehicle } from '@/types/vehicle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Edit, Trash2, ShoppingCart, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const VehicleDetail = () => {
  const { id } = useParams();
  const vehicleId = parseInt(id as string);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAsSold, setIsMarkingAsSold] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const data = await vehicleService.getVehicleById(vehicleId);
        setVehicle(data);
      } catch (error) {
        console.error('Error al cargar el vehículo:', error);
        toast.error('No se pudo cargar el vehículo solicitado.');
        navigate('/vehicles');
      } finally {
        setIsLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId, navigate]);

  const handleDelete = async () => {
    try {
      await vehicleService.deleteVehicle(vehicleId);
      toast.success('Vehículo eliminado correctamente');
      navigate('/vehicles');
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      toast.error('No se pudo eliminar el vehículo. Por favor, intente de nuevo.');
    }
  };

  const handleMarkAsSold = async () => {
    try {
      setIsMarkingAsSold(true);
      await vehicleService.markAsSold(vehicleId);
      toast.success('Vehículo marcado como vendido correctamente');
      
      // Actualizar el vehículo en la UI
      setVehicle(prev => prev ? { ...prev, vendido: true } : null);
    } catch (error) {
      console.error('Error al marcar el vehículo como vendido:', error);
      toast.error('No se pudo marcar el vehículo como vendido. Por favor, intente de nuevo.');
    } finally {
      setIsMarkingAsSold(false);
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
          <Button 
            variant="ghost" 
            onClick={() => navigate('/vehicles')} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a vehículos
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{vehicle.marca} {vehicle.modelo}</h1>
                  <p className="text-gray-500 text-lg">Año: {vehicle.año}</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatCurrency(vehicle.precio)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${vehicle.vendido ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {vehicle.vendido ? 'Vendido' : 'Disponible'}
                  </span>
                </div>
              </div>

              <div className="border-t my-6 pt-6">
                <h2 className="text-xl font-semibold mb-4">Detalles del vehículo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Marca</p>
                    <p className="font-medium">{vehicle.marca}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Modelo</p>
                    <p className="font-medium">{vehicle.modelo}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Año</p>
                    <p className="font-medium">{vehicle.año}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Kilometraje</p>
                    <p className="font-medium">{vehicle.kilometraje.toLocaleString()} km</p>
                  </div>
                </div>
              </div>

              {vehicle.vendido && (
                <Alert className="mt-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Vehículo vendido</AlertTitle>
                  <AlertDescription>
                    Este vehículo ya ha sido vendido y no está disponible para compra.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-3 justify-end mt-6 pt-6 border-t">
                {isAdmin && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el vehículo {vehicle.marca} {vehicle.modelo} de la base de datos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Sí, eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                
                {!vehicle.vendido && (
                  <Button 
                    onClick={handleMarkAsSold} 
                    disabled={isMarkingAsSold}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isMarkingAsSold ? "Procesando..." : "Marcar como vendido"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VehicleDetail;
