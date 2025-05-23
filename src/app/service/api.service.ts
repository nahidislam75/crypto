import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private headers = new HttpHeaders({
    'x-cg-demo-api-key': environment.apiKey,
  });

  getCurrency(currency: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=false`,
      { headers: this.headers }
    );
  }

  getTrendingCurrency(currency: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
      { headers: this.headers }
    );
  }

  getGrpahicalCurrencyData(
    coinId: string,
    currency: string,
    days: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
      { headers: this.headers }
    );
  }

  getCurrencyById(coinId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/coins/${coinId}`, {
      headers: this.headers,
    });
  }
}
