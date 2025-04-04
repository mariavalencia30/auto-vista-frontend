
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EyeIcon, EyeOffIcon, User, Key, ShieldAlert, Clock, Car } from 'lucide-react';

// Definir el esquema de validación para el perfil
const profileSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Número de teléfono inválido'),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
});

// Definir el esquema de validación para la contraseña
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const UserProfile = () => {
  const { user, updateUser, loading } = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formulario de perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      zipCode: user?.zipCode || ''
    },
  });

  // Formulario de contraseña
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Manejador de envío del formulario de perfil
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setUpdateLoading(true);
    try {
      await updateUser(data);
      toast.success('Perfil actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil. Por favor, intenta de nuevo.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Manejador de envío del formulario de contraseña
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordLoading(true);
    try {
      // Aquí implementarías la llamada a la API para cambiar la contraseña
      // Por ahora simulamos una actualización exitosa
      setTimeout(() => {
        toast.success('Contraseña actualizada con éxito');
        passwordForm.reset();
        setPasswordLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      toast.error('Error al cambiar la contraseña. Por favor, intenta de nuevo.');
      setPasswordLoading(false);
    }
  };

  // Función para alternar la visibilidad de las contraseñas
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') setShowCurrentPassword(!showCurrentPassword);
    if (field === 'new') setShowNewPassword(!showNewPassword);
    if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sidebar / Info del usuario */}
              <div className="md:col-span-4 space-y-4">
                <Card>
                  <CardHeader className="pb-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-center">{user?.name}</CardTitle>
                    <CardDescription className="text-center">{user?.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center mb-2">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        <span>Rol: {user?.role === 'customer' ? 'Cliente' : user?.role}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Miembro desde: Abril 2023</span>
                      </div>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        <span>Vehículos: 0</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Car className="mr-2 h-4 w-4" />
                        Mis Vehículos
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="mr-2 h-4 w-4" />
                        Historial de Compras
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Contenido principal */}
              <div className="md:col-span-8">
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Información Personal</TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                  </TabsList>
                  
                  {/* Tab de Información Personal */}
                  <TabsContent value="profile" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>
                          Actualiza tu información personal para mantener tu perfil al día.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nombre completo</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Tu nombre completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="email" 
                                        placeholder="tucorreo@ejemplo.com" 
                                        {...field} 
                                        disabled 
                                        title="El email no se puede modificar"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={profileForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Teléfono</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+1 (555) 123-4567" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dirección</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tu dirección" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={profileForm.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Tu ciudad" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="zipCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Código postal</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Código postal" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex justify-end pt-2">
                              <Button type="submit" disabled={updateLoading}>
                                {updateLoading ? "Guardando..." : "Guardar cambios"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Tab de Seguridad */}
                  <TabsContent value="security" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                        <CardDescription>
                          Actualiza tu contraseña para mantener segura tu cuenta.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contraseña actual</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input 
                                        type={showCurrentPassword ? "text" : "password"} 
                                        placeholder="Tu contraseña actual" 
                                        {...field} 
                                      />
                                      <button 
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() => togglePasswordVisibility('current')}
                                      >
                                        {showCurrentPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                      </button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nueva contraseña</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input 
                                        type={showNewPassword ? "text" : "password"} 
                                        placeholder="Tu nueva contraseña" 
                                        {...field} 
                                      />
                                      <button 
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() => togglePasswordVisibility('new')}
                                      >
                                        {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                      </button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirmar nueva contraseña</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="Confirma tu nueva contraseña" 
                                        {...field} 
                                      />
                                      <button 
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                      >
                                        {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                      </button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end pt-2">
                              <Button type="submit" disabled={passwordLoading}>
                                {passwordLoading ? "Actualizando..." : "Cambiar contraseña"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                        
                        <Separator className="my-6" />
                        
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            <Key className="mr-2 h-5 w-5 text-gray-500" />
                            Seguridad de la cuenta
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 mb-4">
                            Configuraciones adicionales para mantener tu cuenta segura.
                          </p>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Autenticación de dos factores</h4>
                                <p className="text-sm text-gray-500">Agrega una capa extra de seguridad a tu cuenta.</p>
                              </div>
                              <Button variant="outline">Configurar</Button>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Sesiones activas</h4>
                                <p className="text-sm text-gray-500">Gestiona dónde has iniciado sesión.</p>
                              </div>
                              <Button variant="outline">Ver sesiones</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
