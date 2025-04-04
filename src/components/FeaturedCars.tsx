
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tag, Clock, Info, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Datos de ejemplo de coches destacados
const featuredCars = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    price: 25990,
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1000&auto=format&fit=crop',
    status: 'Nuevo',
    fuelType: 'Gasolina',
    transmission: 'Automática'
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 24990,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop',
    status: 'Nuevo',
    fuelType: 'Gasolina',
    transmission: 'Automática'
  },
  {
    id: '3',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2022,
    price: 29990,
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1000&auto=format&fit=crop',
    status: 'Poco uso',
    fuelType: 'Gasolina',
    transmission: 'Automática'
  },
  {
    id: '4',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 46990,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000&auto=format&fit=crop',
    status: 'Nuevo',
    fuelType: 'Eléctrico',
    transmission: 'Automática'
  }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
};

const FeaturedCars = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Vehículos destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora nuestra selección de vehículos destacados con las mejores condiciones del mercado.
          </p>
        </div>

        {/* Tarjetas de coches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map((car) => (
            <Card key={car.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="aspect-video relative overflow-hidden group">
                <img 
                  src={car.image} 
                  alt={`${car.brand} ${car.model}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {car.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                    <Tag size={14} className="mr-1" />
                    {formatPrice(car.price)}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                    <p className="text-gray-500 text-sm flex items-center mt-1">
                      <Calendar size={14} className="mr-1" />
                      {car.year}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    {car.transmission}
                  </div>
                  <div className="flex items-center">
                    <Info size={14} className="mr-1 text-gray-400" />
                    {car.fuelType}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Link to={`/vehicles/${car.id}`} className="w-full">
                  <Button variant="outline" className="w-full group">
                    <span>Ver detalles</span>
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Botón para ver todos */}
        <div className="mt-12 text-center">
          <Link to="/vehicles">
            <Button size="lg">
              <span>Ver todos los vehículos</span>
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
