import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  map!: Map;

  levels = {
    level1: 12,
    level2: 6,
    level3: 3,
  };

  stats = {
    saved: 85,
    toRescue: 12,
    injured: 4,
    emergency: 2,
  };

  savedUsers = [
    'Alice Waters', 'Brian Lee', 'Carla Gomez', 'David Kim', 'Ella Singh', 'Frank Howard',
    'Grace Lin', 'Henry Zhao', 'Isla Cheng', 'Jack Ryan', 'Kara Hope', 'Leo Fang', 'Maya Tan',
    'Nina Patel', 'Owen Brooks', 'Penny Yu', 'Quincy Nash', 'Rachel Zane', 'Steve Holt', 'Tina Fey',
    'Uma Grant', 'Victor Shaw', 'Wendy Wu', 'Xander Lane', 'Yara Bell', 'Zack Fox'
  ];
  
  onCallUsers = [
    'Agent Nova', 'Agent Blaze', 'Agent Echo', 'Agent Frost', 'Agent Orion',
    'Agent Phantom', 'Agent Storm', 'Agent Titan', 'Agent Vortex', 'Agent Zenith'
  ];
  

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.initThreatChart();
    this.initCaseChart();
    this.cdRef.detectChanges();
  }

  private initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: [],
      view: new View({
        center: fromLonLat([145.0581, -37.9035]),
        zoom: 13,
      }),
    });

    const locations = [
      { coords: [-37.9035, 145.0581], label: 'Melbourne' },
      { coords: [-37.912, 145.06], label: 'Nearby Place 1' },
      { coords: [-37.895, 145.05], label: 'Nearby Place 2' },
      { coords: [-37.9, 145.07], label: 'Nearby Place 3' },
    ];

    const features = locations.map((loc) => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([loc.coords[1], loc.coords[0]])),
      });
      marker.set('label', loc.label);
      return marker;
    });

    const vectorSource = new VectorSource({ features });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: 0.7,
        }),
      }),
    });

    this.map.addLayer(vectorLayer);
  }

  private initThreatChart(): void {
    const ctx = document.getElementById('threatChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Level 1', 'Level 2', 'Level 3'],
        datasets: [
          {
            label: 'Threat Level',
            data: [
              this.levels.level1,
              this.levels.level2,
              this.levels.level3,
            ],
            backgroundColor: ['#4caf50', '#ffc107', '#f44336'],
            barThickness: 30
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#fff' },
            grid: { color: '#444' },
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: '#444' },
          },
        },
      },
    });
  }

  private initCaseChart(): void {
    const ctx = document.getElementById('caseChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Day 1',
          'Day 2',
          'Day 3',
          'Day 4',
          'Day 5',
          'Day 6',
          'Today',
        ],
        datasets: [
          {
            label: 'Total Cases',
            data: [32, 24, 18, 12, 10, 7, 2],
            borderColor: '#03a9f4',
            backgroundColor: 'rgba(3, 169, 244, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#03a9f4',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#fff' },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#fff' },
            grid: { color: '#444' },
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: '#444' },
          },
        },
      },
    });
  }
}
