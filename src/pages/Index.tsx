
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedCars from '@/components/FeaturedCars';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Car, Clock, DollarSign, Award, Headphones } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Cars */}
        <FeaturedCars />
        
        {/* Por qué elegirnos */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir AutoVista?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nos dedicamos a brindar la mejor experiencia de compra de vehículos con un servicio personalizado y de calidad.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Ventaja 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Garantía extendida</h3>
                <p className="text-gray-600">
                  Todos nuestros vehículos incluyen garantía extendida de hasta 5 años para tu tranquilidad.
                </p>
              </div>
              
              {/* Ventaja 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Car className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Amplia selección</h3>
                <p className="text-gray-600">
                  Más de 500 vehículos disponibles entre nuevos y seminuevos de todas las marcas.
                </p>
              </div>
              
              {/* Ventaja 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proceso rápido</h3>
                <p className="text-gray-600">
                  Agilizamos todos los trámites para que puedas conducir tu nuevo vehículo lo antes posible.
                </p>
              </div>
              
              {/* Ventaja 4 */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Financiamiento flexible</h3>
                <p className="text-gray-600">
                  Opciones de financiamiento personalizadas con las tasas más competitivas del mercado.
                </p>
              </div>
              
              {/* Ventaja 5 */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Calidad certificada</h3>
                <p className="text-gray-600">
                  Todos nuestros vehículos pasan por rigurosas inspecciones de calidad antes de su venta.
                </p>
              </div>
              
              {/* Ventaja 6 */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Headphones className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Atención personalizada</h3>
                <p className="text-gray-600">
                  Asesores especializados para guiarte en todo el proceso de compra de tu vehículo.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para encontrar tu vehículo ideal?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Nuestros asesores están disponibles para ayudarte a encontrar el vehículo que mejor se adapte a tus necesidades y presupuesto.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary">Agendar cita</Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Contactar asesor
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
