
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserProfile from "./pages/Profile/UserProfile";
import VehiclesPage from "./pages/Vehicles/VehiclesPage";
import VehicleDetail from "./pages/Vehicles/VehicleDetail";
import AddVehicle from "./pages/Vehicles/AddVehicle";
import EditVehicle from "./pages/Vehicles/EditVehicle";
import CreatePurchase from "./pages/Purchases/CreatePurchase";
import PurchaseHistory from "./pages/Purchases/PurchaseHistory";
import PurchaseDetail from "./pages/Purchases/PurchaseDetail";
import EditPurchase from "./pages/Purchases/EditPurchase";
import AdminPurchaseList from "./pages/Purchases/AdminPurchaseList";

const queryClient = new QueryClient();

// Componente ProtectedRoute para verificar autenticación
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente AdminRoute para verificar si es administrador
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Componente AppRoutes para utilizar el hook useAuth dentro del AuthProvider
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />

      {/* Rutas de vehículos */}
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/vehicles/:id" element={<VehicleDetail />} />
      <Route path="/vehicles/new" element={
        <AdminRoute>
          <AddVehicle />
        </AdminRoute>
      } />
      <Route path="/vehicles/edit/:id" element={
        <AdminRoute>
          <EditVehicle />
        </AdminRoute>
      } />
      
      {/* Rutas de compras */}
      <Route path="/purchases/new" element={
        <ProtectedRoute>
          <CreatePurchase />
        </ProtectedRoute>
      } />
      <Route path="/purchases/new/:vehicleId" element={
        <ProtectedRoute>
          <CreatePurchase />
        </ProtectedRoute>
      } />
      <Route path="/purchases/history" element={
        <ProtectedRoute>
          <PurchaseHistory />
        </ProtectedRoute>
      } />
      <Route path="/purchases/:id" element={
        <ProtectedRoute>
          <PurchaseDetail />
        </ProtectedRoute>
      } />
      <Route path="/purchases/edit/:id" element={
        <AdminRoute>
          <EditPurchase />
        </AdminRoute>
      } />
      <Route path="/admin/purchases" element={
        <AdminRoute>
          <AdminPurchaseList />
        </AdminRoute>
      } />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
