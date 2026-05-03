import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
  const google: any;
}

const ELECTION_DATA = [
  { country: "India", lat: 20.5937, lng: 78.9629, flag: "🇮🇳", status: "concluded", color: "#22c55e",
    leader: "Narendra Modi", title: "Prime Minister", party: "BJP", voters: "969M", year: 2024, turnout: "66.3%" },
  { country: "USA", lat: 37.0902, lng: -95.7129, flag: "🇺🇸", status: "concluded", color: "#22c55e",
    leader: "Donald Trump", title: "President", party: "Republican", voters: "244M", year: 2024, turnout: "64.4%" },
  { country: "UK", lat: 55.3781, lng: -3.4360, flag: "🇬🇧", status: "concluded", color: "#22c55e",
    leader: "Keir Starmer", title: "Prime Minister", party: "Labour", voters: "48M", year: 2024, turnout: "59.7%" },
  { country: "France", lat: 46.2276, lng: 2.2137, flag: "🇫🇷", status: "concluded", color: "#22c55e",
    leader: "Emmanuel Macron", title: "President", party: "En Marche", voters: "48.7M", year: 2022, turnout: "73.7%" },
  { country: "Germany", lat: 51.1657, lng: 10.4515, flag: "🇩🇪", status: "ongoing", color: "#f59e0b",
    leader: "Friedrich Merz", title: "Chancellor", party: "CDU", voters: "61.4M", year: 2025, turnout: "82.1%" },
  { country: "Brazil", lat: -14.2350, lng: -51.9253, flag: "🇧🇷", status: "concluded", color: "#22c55e",
    leader: "Luiz Lula da Silva", title: "President", party: "PT", voters: "156M", year: 2022, turnout: "79.4%" },
  { country: "Australia", lat: -25.2744, lng: 133.7751, flag: "🇦🇺", status: "ongoing", color: "#f59e0b",
    leader: "Anthony Albanese", title: "Prime Minister", party: "ALP", voters: "17.6M", year: 2025, turnout: "89.1%" },
  { country: "Canada", lat: 56.1304, lng: -106.3468, flag: "🇨🇦", status: "ongoing", color: "#f59e0b",
    leader: "Mark Carney", title: "Prime Minister", party: "Liberal", voters: "28M", year: 2025, turnout: "68.2%" },
  { country: "Japan", lat: 36.2048, lng: 138.2529, flag: "🇯🇵", status: "concluded", color: "#22c55e",
    leader: "Shigeru Ishiba", title: "Prime Minister", party: "LDP", voters: "105M", year: 2024, turnout: "53.8%" },
  { country: "South Africa", lat: -30.5595, lng: 22.9375, flag: "🇿🇦", status: "concluded", color: "#22c55e",
    leader: "Cyril Ramaphosa", title: "President", party: "ANC", voters: "27.8M", year: 2024, turnout: "58.6%" },
  { country: "Mexico", lat: 23.6345, lng: -102.5528, flag: "🇲🇽", status: "concluded", color: "#22c55e",
    leader: "Claudia Sheinbaum", title: "President", party: "Morena", voters: "98M", year: 2024, turnout: "61%" },
  { country: "Indonesia", lat: -0.7893, lng: 113.9213, flag: "🇮🇩", status: "concluded", color: "#22c55e",
    leader: "Prabowo Subianto", title: "President", party: "Gerindra", voters: "204M", year: 2024, turnout: "81.8%" },
];

export const ElectionGlobe = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let spinId: number;

    const initMap = () => {
      if (!mapRef.current) return;
      
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2.4,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        backgroundColor: '#05050A',
        restriction: { latLngBounds: { north: 85, south: -85, west: -180, east: 180 }, strictBounds: false },
        styles: [
          { elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'administrative.country', elementType: 'geometry.stroke',
            stylers: [{ color: '#2563EB' }, { weight: 0.8 }, { visibility: 'on' }] },
        ],
      });

      // Auto-spin the map
      let heading = 0;
      const spin = () => {
        heading = (heading + 0.015) % 360;
        map.setCenter({ lat: 20, lng: heading - 180 });
        spinId = requestAnimationFrame(spin);
      };
      spinId = requestAnimationFrame(spin);

      // Stop spinning on user interaction
      map.addListener('mousedown', () => cancelAnimationFrame(spinId));
      map.addListener('dragstart', () => cancelAnimationFrame(spinId));

      // Add markers for each country
      ELECTION_DATA.forEach((data) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: data.lat, lng: data.lng },
          title: data.country,
          content: (() => {
            const el = document.createElement('div');
            el.innerHTML = `
              <div style="
                background: ${data.status === 'ongoing' ? 'rgba(245,158,11,0.9)' : 'rgba(37,99,235,0.9)'};
                border: 2px solid ${data.color};
                border-radius: 50%;
                width: 36px; height: 36px;
                display: flex; align-items: center; justify-content: center;
                font-size: 18px; cursor: pointer;
                box-shadow: 0 0 16px ${data.color}, 0 0 32px ${data.color}40;
              " class="pulse-marker">${data.flag}</div>
            `;
            return el;
          })(),
        });

        // Info window on click
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="background:#0D0D1A;border:1px solid #2563EB;border-radius:12px;padding:16px;min-width:240px;font-family:Inter,sans-serif;color:#F0EEE4;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                <span style="font-size:28px">${data.flag}</span>
                <div>
                  <div style="font-weight:700;font-size:16px">${data.country}</div>
                  <span style="background:${data.status==='ongoing'?'#f59e0b':'#22c55e'};color:#000;
                    font-size:10px;padding:2px 8px;border-radius:999px;font-weight:600">
                    ${data.status === 'ongoing' ? '🔴 ELECTION ONGOING' : '✅ CONCLUDED ' + data.year}
                  </span>
                </div>
              </div>
              <div style="border-top:1px solid #ffffff15;padding-top:12px;display:grid;gap:8px">
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#6B7280;font-size:12px">Leader</span>
                  <span style="font-size:13px;font-weight:600;color:#F0EEE4">${data.leader}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#6B7280;font-size:12px">Title</span>
                  <span style="font-size:13px;color:#F0EEE4">${data.title}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#6B7280;font-size:12px">Party</span>
                  <span style="font-size:13px;color:#F0EEE4">${data.party}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#6B7280;font-size:12px">Registered Voters</span>
                  <span style="font-size:13px;color:#2563EB;font-weight:700">${data.voters}</span>
                </div>
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#6B7280;font-size:12px">Voter Turnout</span>
                  <span style="font-size:13px;color:#D4A017;font-weight:700">${data.turnout}</span>
                </div>
              </div>
            </div>`,
          pixelOffset: new google.maps.Size(0, -20),
        });

        marker.addListener('click', () => {
          cancelAnimationFrame(spinId);
          infoWindow.open(map, marker);
        });
      });
    };

    if (window.google) {
      initMap();
    } else {
      // Poll for google maps to load if script is slow
      const checkGoogle = setInterval(() => {
        if (window.google) {
          initMap();
          clearInterval(checkGoogle);
        }
      }, 100);
      return () => clearInterval(checkGoogle);
    }

    return () => cancelAnimationFrame(spinId);
  }, []);

  return (
    <section className="bg-[#05050A] py-20">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.2em] text-[#6B7280] uppercase mb-2">Global Democracy</p>
        <h2 className="text-5xl font-bold text-[#F0EEE4] font-[Syne]">
          Elections <em className="font-[Playfair_Display] text-[#D4A017] not-italic">Around the World</em>
        </h2>
        <p className="text-[#6B7280] mt-3">Click any flag marker to see live election data</p>
        <div className="flex gap-6 justify-center mt-4 text-sm">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22c55e] inline-block"/>Election Concluded</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block animate-pulse"/>Election Ongoing</span>
        </div>
      </div>
      <div ref={mapRef} className="w-full h-[600px] rounded-2xl overflow-hidden border border-white/10" />
    </section>
  );
};

export default ElectionGlobe;
