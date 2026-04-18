import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; 
import { adminGuard } from './guards/admin';
import { Inicio } from './pages/inicio/inicio';
import { Productos } from './pages/productos/productos';
import { DetalleProducto } from './pages/detalle-producto/detalle-producto';
import { Contacto } from './pages/contacto/contacto';
import { Admin } from './pages/admin/admin';
import { CarritoComponent } from './pages/carrito/carrito'; 
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro'; 
import { NotFound } from './pages/not-found/not-found';
import { HistorialComponent } from './pages/historial/historial';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  { path: '', component: Inicio },
  { path: 'productos', component: Productos },
  { path: 'producto/:id', component: DetalleProducto },
  { path: 'contacto', component: Contacto },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // --- RUTAS PROTEGIDAS (Solo Clientes Logueados) ---
  { 
    path: 'carrito', 
    component: CarritoComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'historial', 
    component: HistorialComponent,
    canActivate: [authGuard] // Para que extraños no vean compras ajenas
  },

  // --- RUTA DE ADMINISTRACIÓN (Doble Candado) ---
  { 
    path: 'admin', 
    component: Admin, 
    // Usamos ambos guards: primero que esté logueado, luego que sea admin
    canActivate: [authGuard, adminGuard] 
  },

  // --- RUTA DE ERROR ---
  { path: '**', component: NotFound }
];