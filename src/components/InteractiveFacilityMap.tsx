import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { HealthFacility } from '../types';
import { Navigation, ZoomIn, ZoomOut, Locate, Hospital, ShieldCheck } from 'lucide-react';

interface InteractiveFacilityMapProps {
  userLocation: { latitude: number; longitude: number };
  userCityName?: string;
  facilities: HealthFacility[];
  activeFacility: HealthFacility | null;
  onSelectFacility: (facility: HealthFacility) => void;
  onRecenter: () => void;
}

export const InteractiveFacilityMap: React.FC<InteractiveFacilityMapProps> = ({
  userLocation,
  userCityName = 'Your Location',
  facilities,
  activeFacility,
  onSelectFacility,
  onRecenter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const connectorLineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.latitude, userLocation.longitude],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // High-quality, clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: 'Leaflet | © OpenStreetMap' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Invalidate size on container resize
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, []);

  // Update Center, User Marker, Facility Markers & Connector
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const userLatLng: L.LatLngExpression = [userLocation.latitude, userLocation.longitude];

    // 1. User Location Pulse Marker
    if (!userMarkerRef.current) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></div>
            <div class="relative w-5 h-5 rounded-full bg-cyan-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-black">
              📍
            </div>
            <div class="absolute -bottom-6 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md pointer-events-none">
              ${userCityName}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      userMarkerRef.current = L.marker(userLatLng, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng(userLatLng);
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></div>
            <div class="relative w-5 h-5 rounded-full bg-cyan-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-black">
              📍
            </div>
            <div class="absolute -bottom-6 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md pointer-events-none">
              ${userCityName}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      userMarkerRef.current.setIcon(userIcon);
    }

    // 2. Clear previous and render new Facility Markers
    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();

      facilities.forEach((fac) => {
        const isSelected = activeFacility?.id === fac.id;
        const facLatLng: L.LatLngExpression = [fac.lat, fac.lng];

        // Determine pin colors and icons based on facility category
        let pinBg = 'bg-rose-600';
        let pinBorder = 'border-rose-300';
        let pinText = '🏥';
        let typeBadge = 'Government Hospital';
        const cat = fac.category?.toLowerCase() || '';

        if (cat.includes('phc') || cat.includes('primary')) {
          pinBg = 'bg-emerald-600';
          pinBorder = 'border-emerald-300';
          pinText = '🌱';
          typeBadge = 'PHC / Sub-Centre';
        } else if (cat.includes('chc') || cat.includes('community')) {
          pinBg = 'bg-teal-600';
          pinBorder = 'border-teal-300';
          pinText = '🌿';
          typeBadge = 'Community Health Centre';
        } else if (cat.includes('maternity') || fac.hasMaternityWard) {
          pinBg = 'bg-pink-600';
          pinBorder = 'border-pink-300';
          pinText = '🤱';
          typeBadge = 'Maternity Hospital';
        } else if (cat.includes('college') || cat.includes('institute')) {
          pinBg = 'bg-indigo-600';
          pinBorder = 'border-indigo-300';
          pinText = '🏛️';
          typeBadge = 'Govt Medical College';
        } else if (cat.includes('private')) {
          pinBg = 'bg-sky-600';
          pinBorder = 'border-sky-300';
          pinText = '🏢';
          typeBadge = 'Private Hospital';
        } else if (cat.includes('district')) {
          pinBg = 'bg-rose-700';
          pinBorder = 'border-rose-400';
          pinText = '🏥';
          typeBadge = 'District Hospital';
        }

        const markerHtml = `
          <div class="group relative cursor-pointer flex items-center justify-center transition-transform duration-200 ${
            isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-20'
          }">
            <div class="${pinBg} text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
          isSelected ? 'border-amber-300 ring-4 ring-rose-500/40' : 'border-white'
        }">
              <span class="text-xs">${pinText}</span>
            </div>
            ${
              isSelected
                ? `<div class="absolute -top-7 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap border border-slate-700 flex items-center gap-1 z-50">
                    <span>${fac.name.length > 20 ? fac.name.substring(0, 20) + '…' : fac.name}</span>
                    <span class="text-amber-300">(${fac.distanceKm} km)</span>
                   </div>`
                : ''
            }
          </div>
        `;

        const facIcon = L.divIcon({
          className: 'custom-fac-marker',
          html: markerHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(facLatLng, { icon: facIcon });

        // Popup HTML with details, Call and Directions
        const cleanPhone = fac.phone ? fac.phone.replace(/[^0-9+]/g, '') : '';
        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; min-width: 200px; max-width: 260px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 9999px;">
                ${typeBadge}
              </span>
              <span style="font-size: 11px; font-weight: 800; color: #e11d48;">
                ${fac.distanceKm} km away
              </span>
            </div>
            <h4 style="font-weight: 800; font-size: 13px; margin: 4px 0 2px 0; color: #0f172a; line-height: 1.25;">
              ${fac.name}
            </h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0; line-height: 1.3;">
              📍 ${fac.address}
            </p>
            ${fac.doctorInCharge ? `<p style="font-size: 10px; color: #475569; margin: 0 0 6px 0;"><strong>Doctor:</strong> ${fac.doctorInCharge}</p>` : ''}
            <div style="display: flex; gap: 6px; margin-top: 8px;">
              ${cleanPhone ? `<a href="tel:${cleanPhone}" style="flex: 1; text-align: center; background: #059669; color: white; padding: 5px 8px; border-radius: 8px; font-weight: 700; font-size: 11px; text-decoration: none;">📞 Call</a>` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${fac.lat},${fac.lng}" target="_blank" rel="noreferrer" style="flex: 1; text-align: center; background: #0f172a; color: white; padding: 5px 8px; border-radius: 8px; font-weight: 700; font-size: 11px; text-decoration: none;">➤ Directions</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { offset: [0, -10] });

        marker.on('click', () => {
          onSelectFacility(fac);
        });

        // Tooltip on hover
        marker.bindTooltip(
          `<div class="p-1 text-xs">
            <p class="font-bold text-slate-900">${fac.name}</p>
            <p class="text-slate-500 text-[10px]">${fac.category} • <strong class="text-rose-600">${fac.distanceKm} km away</strong></p>
          </div>`,
          { direction: 'top', offset: [0, -12], opacity: 0.95 }
        );

        markersGroupRef.current?.addLayer(marker);
      });
    }

    // 3. Connector Line between User & Selected Facility
    if (connectorLineRef.current) {
      map.removeLayer(connectorLineRef.current);
      connectorLineRef.current = null;
    }

    if (activeFacility) {
      const activeLatLng: L.LatLngExpression = [activeFacility.lat, activeFacility.lng];
      connectorLineRef.current = L.polyline([userLatLng, activeLatLng], {
        color: '#e11d48',
        weight: 2.5,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(map);

      // Smooth pan/zoom to focus on both user and selected facility
      const bounds = L.latLngBounds([userLatLng, activeLatLng]);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
        animate: true
      });
    } else if (facilities.length > 0) {
      // Auto-fit to include user location and nearest facilities
      const points: L.LatLngExpression[] = [userLatLng, ...facilities.slice(0, 8).map((f) => [f.lat, f.lng] as L.LatLngExpression)];
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
        animate: true
      });
    } else {
      // Pan to user location if no facility
      map.setView(userLatLng, 13, {
        animate: true
      });
    }
  }, [userLocation, userCityName, facilities, activeFacility]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterOnUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [userLocation.latitude, userLocation.longitude],
        13,
        { duration: 0.8 }
      );
    }
    onRecenter();
  };

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[560px] rounded-3xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 flex flex-col">
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* Floating Map Controls Top-Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <button
          type="button"
          onClick={handleCenterOnUser}
          title="Recenter on My Location"
          className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 border border-slate-200 shadow-md transition-all active:scale-95 flex items-center justify-center text-xs font-bold"
        >
          <Locate className="w-4 h-4 text-cyan-600" />
        </button>

        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2.5 hover:bg-slate-100 text-slate-800 transition border-b border-slate-200 flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2.5 hover:bg-slate-100 text-slate-800 transition flex items-center justify-center"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend Top-Left */}
      <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 shadow-md text-[11px] font-semibold text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
          <span>You</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          <span>Govt Hospital</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-600"></span>
          <span>Maternity Hub</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>PHC/CHC</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
          <span>Private/Other</span>
        </div>
      </div>

      {/* Bottom Live Geolocation Badge */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-semibold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            {userLocation.latitude.toFixed(4)}° N, {userLocation.longitude.toFixed(4)}° E • Auto-centered on Your Location
          </span>
        </div>
      </div>
    </div>
  );
};

