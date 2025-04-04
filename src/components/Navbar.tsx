
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold gradient-text">AutoVista</Link>

          {/* Menu de navegación para desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/vehicles" className="text-gray-700 hover:text-primary transition-colors">
              Vehículos
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  Servicios <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link to="/financing" className="w-full">Financiamiento</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/test-drive" className="w-full">Prueba de manejo</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Contacto
            </Link>
            
            {/* Botones de autenticación */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {user?.name?.split(' ')[0] || 'Usuario'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Mi perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/purchases" className="w-full">Mis compras</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline">Iniciar sesión</Button>
                </Link>
                <Link to="/register">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="pt-4 pb-3 space-y-3 md:hidden">
            <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={toggleMenu}>
              Inicio
            </Link>
            <Link to="/vehicles" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={toggleMenu}>
              Vehículos
            </Link>
            <Link to="/financing" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={toggleMenu}>
              Financiamiento
            </Link>
            <Link to="/test-drive" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={toggleMenu}>
              Prueba de manejo
            </Link>
            <Link to="/contact" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={toggleMenu}>
              Contacto
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={toggleMenu}>
                  Mi perfil
                </Link>
                <Link to="/purchases" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={toggleMenu}>
                  Mis compras
                </Link>
                <button onClick={() => { logout(); toggleMenu(); }} className="w-full text-left py-2 px-4 text-red-500 hover:bg-gray-100 rounded">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link to="/login" className="block w-full" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Iniciar sesión</Button>
                </Link>
                <Link to="/register" className="block w-full" onClick={toggleMenu}>
                  <Button className="w-full">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
