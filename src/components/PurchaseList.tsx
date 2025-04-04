
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Purchase } from '@/types/purchase';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Pencil, Trash2, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PurchaseListProps {
  purchases: Purchase[];
  isLoading: boolean;
  onDeletePurchase?: (id: number) => void;
  onCompletePurchase?: (id: number) => void;
}

const PurchaseList: React.FC<PurchaseListProps> = ({ 
  purchases, 
  isLoading, 
  onDeletePurchase,
  onCompletePurchase
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <h3 className="text-lg font-medium">No hay compras registradas</h3>
            <p className="text-muted-foreground mt-2">
              {isAdmin 
                ? "No se han realizado compras en el sistema." 
                : "No has realizado ninguna compra aún."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Vehículo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Método de Pago</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">{purchase.id}</TableCell>
              <TableCell>
                {purchase.vehicle 
                  ? `${purchase.vehicle.marca} ${purchase.vehicle.modelo} (${purchase.vehicle.año})` 
                  : `Vehículo #${purchase.vehicleId}`}
              </TableCell>
              <TableCell>{formatCurrency(purchase.precioTotal)}</TableCell>
              <TableCell>{purchase.metodoPago}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  purchase.estado === 'completada' 
                    ? 'bg-green-100 text-green-800' 
                    : purchase.estado === 'cancelada'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {purchase.estado}
                </span>
              </TableCell>
              <TableCell>{new Date(purchase.fechaCompra).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/purchases/${purchase.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/purchases/edit/${purchase.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      {purchase.estado !== 'completada' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600"
                          onClick={() => onCompletePurchase && onCompletePurchase(purchase.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => onDeletePurchase && onDeletePurchase(purchase.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseList;
