import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; 
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
  // RUTAS PÚBLICAS
  { path: '', component: Inicio },
  { path: 'productos', component: Productos },
  { path: 'producto/:id', component: DetalleProducto },
  { path: 'contacto', component: Contacto },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'historial', component: HistorialComponent },

  // RUTAS PROTEGIDAS (Solo con Login)
  { 
    path: 'carrito', 
    component: CarritoComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'admin', 
    component: Admin, 
    canActivate: [authGuard] 
  },

  // RUTA DE ERROR
  { path: '**', component: NotFound }
];