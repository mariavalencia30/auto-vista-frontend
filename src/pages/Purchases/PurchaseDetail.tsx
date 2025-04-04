
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import purchaseService from '@/services/purchaseService';
import { vehicleService } from '@/services/api';
import { Purchase } from '@/types/purchase';
import { Vehicle } from '@/types/vehicle';
import { formatCurrency } from '@/lib/formatters';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PurchaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const purchaseId = parseInt(id);
        const purchaseData = await purchaseService.getPurchaseById(purchaseId);
        setPurchase(purchaseData);
        
        // Cargar detalles del vehículo
        const vehicleData = await vehicleService.getVehicleById(purchaseData.vehicleId);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Error al cargar detalles de compra:', error);
        toast.error('No se pudieron cargar los detalles de la compra');
        navigate('/purchases/history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPurchaseDetails();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!purchase) return;
    
    try {
      setIsDeleting(true);
      await purchaseService.deletePurchase(purchase.id);
      toast.success('Compra eliminada con éxito');
      navigate('/purchases/history');
    } catch (error) {
      console.error('Error al eliminar compra:', error);
      toast.error('No se pudo eliminar la compra');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCompletePurchase = async () => {
    if (!purchase) return;
    
    try {
      setIsCompleting(true);
      await purchaseService.registerSale(purchase.id);
      toast.success('Venta registrada con éxito');
      
      // Actualizar los datos de la compra en la UI
      const updatedPurchase = await purchaseService.getPurchaseById(purchase.id);
      setPurchase(updatedPurchase);
    } catch (error) {
      console.error('Error al registrar venta:', error);
      toast.error('No se pudo registrar la venta');
    } finally {
      setIsCompleting(false);
      setShowCompleteDialog(false);
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
              <p>No se encontró la compra solicitada o no tienes permiso para verla.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/purchases/history')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al historial
              </Button>
            </CardFooter>
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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/purchases/history')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">Detalles de la Compra #{purchase.id}</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Detalles de la compra */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Información de la Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID de Compra:</p>
                    <p className="text-lg">{purchase.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado:</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      purchase.estado === 'completada' 
                        ? 'bg-green-100 text-green-800' 
                        : purchase.estado === 'cancelada'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {purchase.estado}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de Compra:</p>
                    <p>{new Date(purchase.fechaCompra).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Método de Pago:</p>
                    <p>{purchase.metodoPago}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Precio Total:</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(purchase.precioTotal)}</p>
                  </div>
                </div>
              </CardContent>
              {isAdmin && (
                <CardFooter className="flex justify-end space-x-2">
                  {purchase.estado !== 'completada' && (
                    <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Completada
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar registro de venta</DialogTitle>
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
                            onClick={handleCompletePurchase}
                            disabled={isCompleting}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isCompleting ? 'Procesando...' : 'Confirmar'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  <Button variant="outline" onClick={() => navigate(`/purchases/edit/${purchase.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </DialogTrigger>
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
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              )}
            </Card>
            
            {/* Información del vehículo */}
            {vehicle && (
              <Card>
                <CardHeader>
                  <CardTitle>Vehículo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marca y Modelo:</p>
                    <p className="text-lg font-semibold">{vehicle.marca} {vehicle.modelo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Año:</p>
                    <p>{vehicle.año}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Kilometraje:</p>
                    <p>{vehicle.kilometraje} km</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Precio:</p>
                    <p className="text-lg font-bold">{formatCurrency(vehicle.precio)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado:</p>
                    <p className={vehicle.vendido ? 'text-red-600' : 'text-green-600'}>
                      {vehicle.vendido ? 'Vendido' : 'Disponible'}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                    Ver Detalles del Vehículo
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PurchaseDetail;
