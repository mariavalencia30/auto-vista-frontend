
import React from 'react';
import { Vehicle } from '@/types/vehicle';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { Eye } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

const VehicleList = ({ vehicles, isLoading }: VehicleListProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="w-full py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">No hay vehículos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Kilometraje</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">{vehicle.marca}</TableCell>
              <TableCell>{vehicle.modelo}</TableCell>
              <TableCell>{vehicle.año}</TableCell>
              <TableCell>{formatCurrency(vehicle.precio)}</TableCell>
              <TableCell>{vehicle.kilometraje.toLocaleString()} km</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.vendido ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {vehicle.vendido ? 'Vendido' : 'Disponible'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleList;
