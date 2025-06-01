import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  map!: Map; // Store the map instance

  levels = {
    level1: 12,
    level2: 6,
    level3: 3
  };

  stats = {
    saved: 85,
    toRescue: 12,
    injured: 4,
    emergency: 2
  };

  responders = [
    { name: "Agent Nova", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Agent Blaze", image: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Agent Echo", image: "https://randomuser.me/api/portraits/men/47.jpg" }
  ];

  constructor(private cdRef: ChangeDetectorRef) {} // Inject ChangeDetectorRef

  ngOnInit(): void {
    // Map initialization is moved to ngAfterViewInit
  }

  ngAfterViewInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        // OpenStreetMap Tile Layer
        new TileLayer({
          source: new OSM(),
        }),
      ],
      // Hide default attribution control
      controls: [],
      view: new View({
        center: fromLonLat([145.0581, -37.9035]), // OpenLayers uses [longitude, latitude]
        zoom: 13,
      }),
    });
    const locations = [
      { coords: [-37.9035, 145.0581], label: 'Melbourne' },
      { coords: [-37.912, 145.060], label: 'Nearby Place 1' },
      { coords: [-37.895, 145.050], label: 'Nearby Place 2' },
      { coords: [-37.900, 145.070], label: 'Nearby Place 3' },
    ];

    const features = locations.map((loc) => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([loc.coords[1], loc.coords[0]])), // OpenLayers uses [longitude, latitude]
      });
      marker.set('label', loc.label);
      return marker;
    });

    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png', // Replace with your marker image URL
          scale: 0.7, // Adjust marker size
        }),
      }),
    });

    this.map.addLayer(vectorLayer);

    locations.forEach((loc) => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([loc.coords[1], loc.coords[0]])), // OpenLayers uses [longitude, latitude]
      });
    });
    this.cdRef.detectChanges(); // Manually trigger change detection
  }
}
