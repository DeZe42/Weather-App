import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from './shared/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
 
  currentWeatherData: any;
  filteredCurrentWeatherData: any;
  fullForeCastData: any;
  foreCastData: any[] = [];
  chartData: any[] = [];
  containerWidth: any;
  searchCtrl: FormControl = new FormControl('', Validators.required);
  darkMode: boolean = false;
  isMetric: boolean = true;
  isLoading: boolean = false;
  currentIndex: number = 0;
  ipSub: Subscription;
  weatherSub: Subscription;
  foreCastSub: Subscription;
  isMetricSub: Subscription;

  constructor(
    private apiService: ApiService
  ) {
    if (localStorage.getItem('darkMode') == null || (localStorage.getItem('darkMode') == 'false')) {
      this.darkMode = false;
    } else {
      this.darkMode = true;
    }
  }

  ngOnInit() {
    this.isLoading = true;
    this.containerWidth = document.getElementById('container')?.offsetWidth;
    this.isMetricSub = this.apiService.isMetric$.subscribe(data => {
      this.isMetric = data;
    });
    this.ipSub = this.apiService.getIp().subscribe((res: any) => {
      this.searchCtrl.setValue(res.city);
      this.getWeatherData(res.city);
      this.getForeCastData(res.city);
    });
  }

  ngOnDestroy() {
    if (this.ipSub) this.ipSub.unsubscribe();
    if (this.weatherSub) this.weatherSub.unsubscribe();
  }

  searchCity(event) {
    if (event.keyCode == 13 ) {
      this.isLoading = true;
      this.getWeatherData(this.searchCtrl.value);
      this.getForeCastData(this.searchCtrl.value);
    }
  }

  getWeatherData(cityName: string) {
    this.weatherSub = this.apiService.getWeather('weather', cityName).subscribe(res => {
      this.currentWeatherData = res;
      this.filteredCurrentWeatherData = this.currentWeatherData;
    });
  }

  getForeCastData(cityName: string) {
    this.foreCastSub = this.apiService.getWeather('forecast', cityName).subscribe((res: any) => {
      this.fullForeCastData = res;
      this.chartData = [];
      this.foreCastData = [];
      for (let i = 0; i < 8; i++) {
        this.chartData.push({ label: res.list[i].dt_txt, x: i, temp: res.list[i].main.temp });
      }
      for(let i = 0; i < res.list.length; i = i + 8) {
        this.foreCastData.push(res.list[i]);
      }
      this.isLoading = false;
    });
  }

  putDarkMode(mode) {
    this.darkMode = mode;
    localStorage.setItem('darkMode', mode);
  }

  round(num: number, celsius: boolean) {
    if (celsius) {
      return Math.round(num);
    } else {
      return Math.round(num * 1.8 + 32);
    }
  }

  toKmh(num: number) {
    return Number(num * 3.6).toFixed(0);
  }

  filterChartData(date, i) {
    this.isLoading = true;
    this.chartData = [];
    let index = 0;
    this.currentIndex = i;
    if (i == 0) {
      this.filteredCurrentWeatherData = this.currentWeatherData;
      for (let i = 0; i < 9; i++) {
        this.chartData.push({ label: this.fullForeCastData.list[i].dt_txt, x: i, temp: this.fullForeCastData.list[i].main.temp });
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } else {
      this.fullForeCastData.list.forEach(e => {
        if (e.dt_txt.startsWith(date.split(' ')[0])) {
          this.chartData.push({ label: e.dt_txt, x: index, temp: e.main.temp });
          index ++;
        }
        if (e.dt_txt.startsWith(date)) {
          this.filteredCurrentWeatherData = e;
          this.filteredCurrentWeatherData.name = this.currentWeatherData.name;
        }
      });
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  }

  changeUnits(mode: boolean) {
    this.apiService.isMetric$.next(mode);
  }
}