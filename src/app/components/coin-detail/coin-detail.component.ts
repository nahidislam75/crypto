import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyService } from '../../service/currency.service';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './coin-detail.component.html',
  styleUrl: './coin-detail.component.css',
})
export class CoinDetailComponent implements OnInit {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private currencyService = inject(CurrencyService);

  coinData = signal<any>(null);
  coinId = signal<string>('');
  days = signal<number>(30);
  currency = signal<string>('BDT');
  loading = signal<boolean>(false);

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
    },
  };

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  constructor() {
    this.currencyService
      .getCurrency()
      .pipe(takeUntilDestroyed())
      .subscribe((val) => {
        this.currency.set(val);
        this.getGraphData(this.days());
        this.getCoinData();
      });

    this.activatedRoute.params.pipe(takeUntilDestroyed()).subscribe((val) => {
      this.coinId.set(val['id']);
      this.getCoinData();
      this.getGraphData(this.days());
    });
  }

  ngOnInit(): void {}

  getCoinData(): void {
    if (!this.coinId()) return;

    this.loading.set(true);
    this.api.getCurrencyById(this.coinId()).subscribe({
      next: (res) => {
        if (this.currency() === 'USD') {
          res.market_data.current_price.bdt = res.market_data.current_price.usd;
          res.market_data.market_cap.bdt = res.market_data.market_cap.usd;
        }
        this.coinData.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching coin data:', err);
        this.loading.set(false);
      },
    });
  }

  getGraphData(days: number): void {
    if (!this.coinId()) return;

    this.days.set(days);
    this.loading.set(true);

    this.api
      .getGrpahicalCurrencyData(this.coinId(), this.currency(), days)
      .subscribe({
        next: (res) => {
          this.lineChartData.datasets[0].data = res.prices.map(
            (a: any) => a[1]
          );
          this.lineChartData.labels = res.prices.map((a: any) => {
            let date = new Date(a[0]);
            let time =
              date.getHours() > 12
                ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                : `${date.getHours()}:${date.getMinutes()} AM`;
            return days === 1 ? time : date.toLocaleDateString();
          });

          setTimeout(() => {
            this.myLineChart?.chart?.update();
            this.loading.set(false);
          }, 200);
        },
        error: (err) => {
          console.error('Error fetching graph data:', err);
          this.loading.set(false);
        },
      });
  }
}
