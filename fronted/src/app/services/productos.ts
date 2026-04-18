import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient); // Inject
  private url = 'http://localhost:3000/api/productos'; // Ruta del backend

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}