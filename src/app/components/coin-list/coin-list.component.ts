import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../service/api.service';
import { CurrencyService } from '../../service/currency.service';

@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './coin-list.component.html',
  styleUrl: './coin-list.component.css',
})
export class CoinListComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private currencyService = inject(CurrencyService);

  bannerData = signal<any[]>([]);
  currency = signal<string>('BDT');
  dataSource = signal<MatTableDataSource<any>>(new MatTableDataSource());
  displayedColumns: string[] = [
    'symbol',
    'current_price',
    'price_change_percentage_24h',
    'market_cap',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.currencyService
      .getCurrency()
      .pipe(takeUntilDestroyed())
      .subscribe((val) => {
        this.currency.set(val);
        this.getAllData();
        this.getBannerData();
      });
  }

  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();
  }

  getBannerData(): void {
    this.api.getTrendingCurrency(this.currency()).subscribe({
      next: (res) => {
        this.bannerData.set(res);
      },
      error: (err) => {
        console.error('Error fetching banner data:', err);
      },
    });
  }

  getAllData(): void {
    this.api.getCurrency(this.currency()).subscribe({
      next: (res) => {
        const dataSource = new MatTableDataSource(res);
        dataSource.paginator = this.paginator;
        dataSource.sort = this.sort;
        this.dataSource.set(dataSource);
      },
      error: (err) => {
        console.error('Error fetching currency data:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const currentDataSource = this.dataSource();
    currentDataSource.filter = filterValue.trim().toLowerCase();

    if (currentDataSource.paginator) {
      currentDataSource.paginator.firstPage();
    }
  }

  gotoDetails(row: any): void {
    this.router.navigate(['coin-detail', row.id]);
  }
}
