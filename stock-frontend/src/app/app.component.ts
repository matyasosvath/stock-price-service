import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface StockInfo {
  lastUpdatedTime?: string;
  currentStockPrice?: number;
  movingAverage?: number;
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
      console.log("Fetched latest stock information.");
  }


}