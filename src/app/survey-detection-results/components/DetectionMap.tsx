'use client';

import React, { useEffect, useRef } from 'react';
import type { Detection } from '@/data/mockData';

// Backend integration point: replace mock coordinates with real geotag data from API

const CLASS_COLORS: Record<string, string> = {
  'Shipwreck': '#065A82',
  'Pipe': '#1C7293',
  'Cylinder': '#B14C15',
  'Entangled Net': '#1C8C5A',
  'Unknown Object': '#6B7280',
};

interface DetectionMapProps {
  detections: Detection[];
  selectedId: string | null;
  hoveredId: string | null;
  onPinClick: (id: string) => void;
}

export default function DetectionMap({ detections, selectedId, hoveredId, onPinClick }: DetectionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    // Dynamically import leaflet
    import('leaflet').then((L) => {
      // Fix leaflet default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapRef.current || mapInstanceRef.current) return;

      // Center on the cluster of detections
      const map = L.map(mapRef.current, {
        center: [-38.195, 144.63],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add markers
      detections.forEach((det) => {
        const color = CLASS_COLORS[det.classification] ?? '#6B7280';
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: 28px; height: 28px; border-radius: 50%;
              background: ${color}; border: 2.5px solid white;
              display: flex; align-items: center; justify-content: center;
              font-size: 11px; font-weight: 700; color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
              cursor: pointer;
              transition: transform 150ms ease, box-shadow 150ms ease;
              font-family: var(--font-dm-sans, sans-serif);
            ">${det.index}</div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([det.lat, det.lng], { icon })
          .addTo(map)
          .bindTooltip(
            `<div style="font-family:sans-serif;font-size:12px;font-weight:600;color:#17242E;">
              #${det.index} ${det.classification}<br/>
              <span style="font-weight:400;color:#4A6572;">Confidence: ${det.confidence}%</span>
            </div>`,
            { direction: 'top', offset: [0, -16] }
          )
          .on('click', () => onPinClick(det.id));

        markersRef.current.set(det.id, marker);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  // Highlight selected/hovered marker
  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then((L) => {
      markersRef.current.forEach((marker, id) => {
        const det = detections.find((d) => d.id === id);
        if (!det) return;
        const color = CLASS_COLORS[det.classification] ?? '#6B7280';
        const isActive = id === selectedId || id === hoveredId;
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: ${isActive ? 34 : 28}px; height: ${isActive ? 34 : 28}px; border-radius: 50%;
              background: ${color}; border: ${isActive ? '3px' : '2.5px'} solid white;
              display: flex; align-items: center; justify-content: center;
              font-size: 11px; font-weight: 700; color: white;
              box-shadow: ${isActive ? '0 4px 16px rgba(0,0,0,0.45)' : '0 2px 8px rgba(0,0,0,0.35)'};
              cursor: pointer;
              transform: ${isActive ? 'scale(1.15)' : 'scale(1)'};
              transition: all 150ms ease;
              font-family: var(--font-dm-sans, sans-serif);
            ">${det.index}</div>
          `,
          iconSize: [isActive ? 34 : 28, isActive ? 34 : 28],
          iconAnchor: [isActive ? 17 : 14, isActive ? 17 : 14],
        });
        marker.setIcon(icon);
      });

      // Pan to selected
      if (selectedId) {
        const det = detections.find((d) => d.id === selectedId);
        if (det && mapInstanceRef.current) {
          mapInstanceRef.current.panTo([det.lat, det.lng], { animate: true, duration: 0.4 });
        }
      }
    });
  }, [selectedId, hoveredId, detections]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: 400 }} />
    </>
  );
}