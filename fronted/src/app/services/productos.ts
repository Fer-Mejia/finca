import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient); // Inject
  private url = 'https://finca-sho6.onrender.com'; 

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}