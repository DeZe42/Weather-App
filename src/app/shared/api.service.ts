import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getWeather(apiName: string, cityName: string) {
    let options = {
      params: {
        'q': cityName,
        'appid': environment.apiWeatherKey,
        'units': 'metric'
      }
    }
    return this.http.get(environment.apiWeather + apiName, options);
  }

  getIp() {
    let options = {
      params: {
        'token': environment.apiIpKey
      }
    }
    return this.http.get(environment.apiIp, options);
  }
}