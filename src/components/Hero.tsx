import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/vehiculos/buscar', {
        params: { query: searchQuery },
      });
      console.log('Search results:', response.data);
      // Handle the search results (e.g., navigate to a results page or display them)
    } catch (error) {
      console.error('Error searching vehicles:', error);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido del hero */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block">Encuentra tu</span>
              <span className="gradient-text">vehículo ideal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Descubre nuestra amplia selección de autos de calidad con las mejores condiciones de financiamiento y atención personalizada.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link to="/vehicles">
                <Button size="lg" className="w-full sm:w-auto">
                  Ver vehículos
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/test-drive">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Agendar prueba de manejo
                </Button>
              </Link>
            </div>

            {/* Buscador rápido */}
            <div className="bg-white p-4 rounded-lg shadow-md mt-8">
              <div className="flex items-center space-x-2">
                <Search className="text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Busca por marca, modelo o año..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none focus:outline-none text-gray-700"
                />
                <Button size="sm" onClick={handleSearch}>Buscar</Button>
              </div>
            </div>
          </div>
          
          {/* Imagen del héroe */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop" 
                alt="Automóvil moderno" 
                className="w-full h-auto object-cover rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </div>
            
            {/* Insignias */}
            <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Garantía</p>
                  <p className="text-sm font-semibold">5 años</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-5 -right-5 bg-white p-3 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Entrega</p>
                  <p className="text-sm font-semibold">Inmediata</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
