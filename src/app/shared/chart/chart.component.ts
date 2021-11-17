import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() data;
  @Input() width: number;
  @Input() height: number;
  @Input() precision: number;
  
  fontSize;
  maximumXFromData;
  maximumYFromData;
  digits;
  padding;
  chartWidth;
  chartHeight;
  
  pointsXValue;
  
  pointsYValue;
  
  tempValues;

  verticalGuidePoints: string[] = [];
  numberOfVerticalGuides: number = 9;
  
  horizontalGuidePoints: string[] = [];
  numberOfHorizontalGuides: number = 6;

  xLabelPoints: any[] = [];

  yLabelPoints: any[] = [];

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.fontSize = null;
    this.maximumXFromData = null;
    this.maximumYFromData = null;
    this.digits = null;
    this.padding = null;
    this.chartWidth = null;
    this.chartHeight = null;
    this.pointsXValue = null;
    this.pointsYValue = null;
    this.tempValues = null;
    this.verticalGuidePoints = [];
    this.horizontalGuidePoints = [];
    this.xLabelPoints = [];
    this.yLabelPoints = [];
    this.calculateAttributes();
    this.getXPoints();
    this.getYPoints();
    this.getTemp();
    this.getVerticalGuidePoints();
    this.getHorizontalGuidePoints();
    this.getXLabels();
    this.getYLabels();
    console.log(this.chartWidth)
  }

  calculateAttributes() {
    this.fontSize = this.width / 80;
    this.maximumXFromData = Math.max(...this.data.map((e) => e.x));
    this.maximumYFromData = Math.max(...this.data.map((e) => e.temp));
    this.digits = parseFloat(this.maximumYFromData.toString()).toFixed(this.precision).length + 1;
    this.padding = (this.fontSize + this.digits) * 3;
    this.chartWidth = this.width - this.padding * 2;
    this.chartHeight = this.height - this.padding * 2;
  }

  getXPoints() {
    this.pointsXValue = `${this.padding}, ${this.height - this.padding} ${this.width - this.padding}, ${this.height - this.padding}`;
  }

  getYPoints() {
    this.pointsYValue = `${this.padding}, ${this.padding} ${this.padding}, ${this.height - this.padding}`;
  }

  getTemp() {
    this.tempValues = this.data.map((element) => {
      const pX = (element.x / this.maximumXFromData) * this.chartWidth + this.padding;
      const pY = this.chartHeight - (element.temp / this.maximumYFromData) * this.chartHeight + this.padding;
      return `${pX}, ${pY}`;
    }).join(' ');
  }

  getVerticalGuidePoints() {
    this.verticalGuidePoints = [];
    for(let i = 0; i < this.numberOfVerticalGuides; i++) {
      const startY = this.padding;
      const endY = this.height - this.padding;
      const ratio = (i + 1) / this.numberOfVerticalGuides;
      const xCoordinate = this.padding + ratio * (this.width - this.padding * 2);
      this.verticalGuidePoints.push(`${xCoordinate}, ${startY} ${xCoordinate}, ${endY}`);
    }
  }

  getHorizontalGuidePoints() {
    this.horizontalGuidePoints = [];
    for(let i = 0; i < this.numberOfHorizontalGuides; i++) {
      const startX = this.padding;
      const endY = this.width - this.padding;
      const ratio = (i + 1) / this.numberOfHorizontalGuides;
      const yCoordinate = this.chartHeight - this.chartHeight * ratio + this.padding;
      this.horizontalGuidePoints.push(`${startX}, ${yCoordinate} ${endY}, ${yCoordinate}`);
    }
  }

  getXLabels() {
    this.xLabelPoints = [];
    for (let i = 0; i < this.data.length; i = i + Math.round(this.data.length / this.numberOfVerticalGuides)) {
      const y = this.height - this.padding + this.fontSize * 2;
      const x = (this.data[i].x / this.maximumXFromData) * this.chartWidth + this.padding - this.fontSize / 2;
      this.xLabelPoints.push({x: x, y: y, label: this.data[i].label});  
    }
  }

  getYLabels() {
    this.yLabelPoints = [];
    for (let i = 0; i < this.data.length; i++) {
      const x = this.fontSize;
      const ratio = i / this.numberOfHorizontalGuides;
      const yCoordinate = this.chartHeight - this.chartHeight * ratio + this.padding + this.fontSize / 2;
      this.yLabelPoints.push({x: x, y: yCoordinate, label: parseFloat((this.maximumYFromData * (i / this.numberOfHorizontalGuides)).toString()).toFixed(this.precision)});  
    }
  }
}