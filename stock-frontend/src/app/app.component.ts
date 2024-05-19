import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

interface StockInfo {
  lastUpdatedTime: string;
  currentStockPrice: number;
  movingAverage: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,  CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  stockInfo: StockInfo | null = null;
  symbol: string = 'AAPL';
  error: string | null = null;

  constructor(private http: HttpClient) { }

  monitorStock(): void {

    console.log("symbool hereee", this.symbol);
    if (!this.symbol) {
      this.error = 'Please enter a stock symbol.';
      return;
    }
    console.log("symbool hereee again", this.symbol);
    this.http.put<{ message: string }>(`http://localhost:5027/stock/${this.symbol}`, {})
      .subscribe(
        response => {
          this.error = null;
          console.log(response.message);
          this.fetchStockInfo();
        },
        error => {
          console.error('Error monitoring stock:', error);
          this.error = 'Failed to monitor stock symbol. Please try again later.';
        }
      );
  }

  fetchStockInfo(): void {
    this.http.get<StockInfo>(`http://localhost:5027/stock/${this.symbol}`)
      .subscribe(
        data => this.stockInfo = data,
        error => {
          console.error('Error fetching stock info:', error);
          this.error = 'Failed to fetch stock information. Please try again later.';
        }
      );
  }

  // private readonly backendUrl = 'http://stockservice:3001'; // Backend URL


  // getStockData(symbol: string): Observable<any> {
  //   return this.http.get(`${this.backendUrl}/stock/${symbol}`);
  // }

  // monitorStock(symbol: string): Observable<any> {
  //   console.log("symbool hereee", this.symbol);
  //   return this.http.put(`${this.backendUrl}/stock/${symbol}`, {});
  // }
}