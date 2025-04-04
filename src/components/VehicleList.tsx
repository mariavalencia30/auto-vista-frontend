
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Vehicle } from '@/types/vehicle';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, ShoppingCart } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onDelete?: (id: number) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, isLoading, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="w-full overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mt-4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center p-10">
        <h3 className="text-xl font-medium">No hay vehículos disponibles</h3>
        <p className="text-gray-500 mt-2">No se encontraron vehículos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className={vehicle.vendido ? 'opacity-70' : ''}>
          <div className="relative">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img 
                src="/placeholder.svg" 
                alt={`${vehicle.marca} ${vehicle.modelo}`} 
                className="max-h-full object-contain p-4"
              />
            </div>
            {vehicle.vendido && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                VENDIDO
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">
              {vehicle.marca} {vehicle.modelo}
            </h3>
            <p className="text-gray-500 mb-2">{vehicle.año}</p>
            
            <div className="space-y-1">
              <p><span className="font-medium">Kilometraje:</span> {vehicle.kilometraje} km</p>
              <p className="text-xl font-bold text-primary mt-2">
                {formatCurrency(vehicle.precio)}
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/vehicles/${vehicle.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver detalles
            </Button>
            
            {!vehicle.vendido && isLoggedIn && (
              <Button 
                size="sm"
                onClick={() => navigate(`/purchases/new/${vehicle.id}`)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Comprar
              </Button>
            )}
            
            {isAdmin && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                
                {onDelete && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600"
                    onClick={() => onDelete(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default VehicleList;
