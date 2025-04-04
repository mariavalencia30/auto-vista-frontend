
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Información de la empresa */}
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">AutoVista</h3>
            <p className="text-gray-400 mb-4">
              Tu concesionario de confianza para encontrar el vehículo perfecto. Ofrecemos la mejor selección de autos nuevos y usados.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vehicles" className="text-gray-400 hover:text-white transition-colors">Vehículos</Link>
              </li>
              <li>
                <Link to="/financing" className="text-gray-400 hover:text-white transition-colors">Financiamiento</Link>
              </li>
              <li>
                <Link to="/test-drive" className="text-gray-400 hover:text-white transition-colors">Prueba de manejo</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">Acerca de nosotros</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/maintenance" className="text-gray-400 hover:text-white transition-colors">Mantenimiento</Link>
              </li>
              <li>
                <Link to="/insurance" className="text-gray-400 hover:text-white transition-colors">Seguros</Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-400 hover:text-white transition-colors">Garantía</Link>
              </li>
              <li>
                <Link to="/parts" className="text-gray-400 hover:text-white transition-colors">Repuestos</Link>
              </li>
              <li>
                <Link to="/trade-in" className="text-gray-400 hover:text-white transition-colors">Trade-in</Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="text-primary mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Av. Principal 123, Ciudad Automotriz</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">info@autovista.com</span>
              </div>
              <div>
                <h5 className="font-medium mb-2 mt-4">Horario de atención</h5>
                <p className="text-gray-400">Lun - Vie: 9:00 - 19:00</p>
                <p className="text-gray-400">Sáb: 10:00 - 16:00</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AutoVista. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
              Política de privacidad
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
