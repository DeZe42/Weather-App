import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

  isLoading: boolean = false;
  map: any;
  @Input('lat') lat: any;
  @Input('lon') lon: any;
  @Input('change') change: any;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    if (this.lat && this.lon) {
      this.initMap();
    }
  }

  ngOnChanges() {
    if (this.lat && this.lon) {
      if (this.map && this.change) {
        this.map.off();
        this.map.remove();
        this.initMap();
      } else {
        if (this.map) {
          this.map.off();
          this.map.remove();
        }
        this.initMap();
      }
    }
  }

  initMap() {
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      zoom: 13
    });
    console.log(this.map)
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.dragging.disable();
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      minZoom: 3,
      attribution: "&copu; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
    });
    tiles.addTo(this.map);
  }
}