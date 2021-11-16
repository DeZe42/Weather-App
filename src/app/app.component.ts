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
  searchCtrl: FormControl = new FormControl('', Validators.required);
  darkMode: boolean = false;
  isMetric: boolean = false;
  ipSub: Subscription;
  weatherSub: Subscription;

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
    this.ipSub = this.apiService.getIp().subscribe((res: any) => {
      this.searchCtrl.setValue(res.city);
      this.getWeatherData(res.city);
    });
  }

  ngOnDestroy() {
    if (this.ipSub) this.ipSub.unsubscribe();
    if (this.weatherSub) this.weatherSub.unsubscribe();
  }

  getWeatherData(cityName: string) {
    this.weatherSub = this.apiService.getWeather('weather', cityName).subscribe(res => {
      this.currentWeatherData = res;
      console.log(res);
    });
  }

  putDarkMode(mode) {
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
}