import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true
})
export class StockStatusPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 0) return '❌ Agotado';
    if (value < 5) return '⚠️ ¡Últimas piezas!';
    return '✅ Disponible';
  }
}