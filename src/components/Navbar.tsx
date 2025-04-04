
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LogIn, UserCircle, LogOut, Menu, X, Car, ClipboardList } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary">
            AutoConcesionaria
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/vehicles" className="text-gray-700 hover:text-primary transition-colors">
              Vehículos
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/purchases/history" className="text-gray-700 hover:text-primary transition-colors">
                  Mis Compras
                </Link>
                {isAdmin && (
                  <Link to="/admin/purchases" className="text-gray-700 hover:text-primary transition-colors">
                    Admin Compras
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Auth buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" onClick={() => navigate('/profile')}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Ingresar
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Registrarse
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4">
                <SheetClose asChild>
                  <Link to="/" className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors">
                    Inicio
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/vehicles" className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors">
                    <Car className="h-4 w-4 mr-2" />
                    Vehículos
                  </Link>
                </SheetClose>
                
                {isAuthenticated && (
                  <>
                    <SheetClose asChild>
                      <Link to="/purchases/history" className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Mis Compras
                      </Link>
                    </SheetClose>
                    
                    {isAdmin && (
                      <SheetClose asChild>
                        <Link to="/admin/purchases" className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Admin Compras
                        </Link>
                      </SheetClose>
                    )}
                    
                    <SheetClose asChild>
                      <Link to="/profile" className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors">
                        <UserCircle className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </SheetClose>
                  </>
                )}
                
                {!isAuthenticated && (
                  <>
                    <SheetClose asChild>
                      <Link to="/login" className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors">
                        <LogIn className="h-4 w-4 mr-2" />
                        Ingresar
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/register" className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors">
                        Registrarse
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
