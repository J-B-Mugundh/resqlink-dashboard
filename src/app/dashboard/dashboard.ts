import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  map!: L.Map; // Store the map instance

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
    this.map = L.map('map').setView([-37.9035, 145.0581] as L.LatLngTuple, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    const locations = [
      { coords: [-37.9035, 145.0581], label: 'Melbourne' },
      { coords: [-37.912, 145.060], label: 'Nearby Place 1' },
      { coords: [-37.895, 145.050], label: 'Nearby Place 2' },
      { coords: [-37.900, 145.070], label: 'Nearby Place 3' },
    ];

    locations.forEach((loc) => {
      L.marker(loc.coords as L.LatLngTuple).addTo(this.map).bindPopup(`<b>${loc.label}</b>`);
    });

    // Call invalidateSize after the view has been initialized and detect changes
    this.map.invalidateSize();
    this.cdRef.detectChanges(); // Manually trigger change detection
  }
}
