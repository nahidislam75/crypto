import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  // Keep BehaviorSubject for backward compatibility
  private selectedCurrency$ = new BehaviorSubject<string>('BDT');

  // Add signal-based approach (Angular 19 feature)
  readonly currency = signal<string>('BDT');

  getCurrency(): Observable<string> {
    return this.selectedCurrency$.asObservable();
  }

  setCurrency(currency: string): void {
    this.selectedCurrency$.next(currency);
    this.currency.set(currency); // Update signal too
  }
}
