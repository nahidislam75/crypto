import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from './service/currency.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private currencyService = inject(CurrencyService);
  private router = inject(Router);

  selectedCurrency = signal<string>('BDT');

  constructor() {
    effect(() => {
      const value = this.currencyService.currency();
      this.selectedCurrency.set(value);
    });
  }

  sendCurrency(event: string): void {
    this.selectedCurrency.set(event);
    this.currencyService.setCurrency(event);
  }

  gotohome(): void {
    this.router.navigate(['coin-list']);
  }
}
