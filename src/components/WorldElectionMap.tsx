import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const COUNTRIES = [
  { name: "India", lat: 20.59, lng: 78.96, flag: "🇮🇳",
    status: "concluded", year: 2024, leader: "Narendra Modi",
    title: "Prime Minister", party: "BJP", voters: "969 Million", turnout: "66.3%" },
  { name: "USA", lat: 37.09, lng: -95.71, flag: "🇺🇸",
    status: "concluded", year: 2024, leader: "Donald Trump",
    title: "President", party: "Republican", voters: "244 Million", turnout: "64.4%" },
  { name: "UK", lat: 55.37, lng: -3.43, flag: "🇬🇧",
    status: "concluded", year: 2024, leader: "Keir Starmer",
    title: "Prime Minister", party: "Labour", voters: "48 Million", turnout: "59.7%" },
  { name: "France", lat: 46.22, lng: 2.21, flag: "🇫🇷",
    status: "concluded", year: 2022, leader: "Emmanuel Macron",
    title: "President", party: "En Marche", voters: "48.7 Million", turnout: "73.7%" },
  { name: "Germany", lat: 51.16, lng: 10.45, flag: "🇩🇪",
    status: "ongoing", year: 2025, leader: "Friedrich Merz",
    title: "Chancellor", party: "CDU", voters: "61.4 Million", turnout: "82.1%" },
  { name: "Brazil", lat: -14.23, lng: -51.92, flag: "🇧🇷",
    status: "concluded", year: 2022, leader: "Lula da Silva",
    title: "President", party: "PT", voters: "156 Million", turnout: "79.4%" },
  { name: "Australia", lat: -25.27, lng: 133.77, flag: "🇦🇺",
    status: "ongoing", year: 2025, leader: "Anthony Albanese",
    title: "Prime Minister", party: "ALP", voters: "17.6 Million", turnout: "89.1%" },
  { name: "Canada", lat: 56.13, lng: -106.34, flag: "🇨🇦",
    status: "ongoing", year: 2025, leader: "Mark Carney",
    title: "Prime Minister", party: "Liberal", voters: "28 Million", turnout: "68.2%" },
  { name: "Japan", lat: 36.20, lng: 138.25, flag: "🇯🇵",
    status: "concluded", year: 2024, leader: "Shigeru Ishiba",
    title: "Prime Minister", party: "LDP", voters: "105 Million", turnout: "53.8%" },
  { name: "Indonesia", lat: -0.78, lng: 113.92, flag: "🇮🇩",
    status: "concluded", year: 2024, leader: "Prabowo Subianto",
    title: "President", party: "Gerindra", voters: "204 Million", turnout: "81.8%" },
  { name: "Mexico", lat: 23.63, lng: -102.55, flag: "🇲🇽",
    status: "concluded", year: 2024, leader: "Claudia Sheinbaum",
    title: "President", party: "Morena", voters: "98 Million", turnout: "61%" },
  { name: "South Africa", lat: -30.55, lng: 22.93, flag: "🇿🇦",
    status: "concluded", year: 2024, leader: "Cyril Ramaphosa",
    title: "President", party: "ANC", voters: "27.8 Million", turnout: "58.6%" },
];

export default function WorldElectionMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const spinRef = useRef<number>(0);
  const lngRef = useRef<number>(0);
  const isSpinning = useRef<boolean>(true);
  const [selected, setSelected] = useState<typeof COUNTRIES[0] | null>(null);

  useEffect(() => {
    const loadMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
        backgroundColor: '#05050A',
        mapId: 'DEMO_MAP_ID',
      });

      mapInstance.current = map;

      // Spin animation
      const spin = () => {
        if (!isSpinning.current) return;
        lngRef.current = (lngRef.current + 0.2) % 360;
        const center = map.getCenter();
        if (center) {
          map.setCenter({ lat: center.lat(), lng: lngRef.current - 180 });
        }
        spinRef.current = requestAnimationFrame(spin);
      };
      spinRef.current = requestAnimationFrame(spin);

      // Stop spinning on drag
      map.addListener('dragstart', () => {
        isSpinning.current = false;
        cancelAnimationFrame(spinRef.current);
      });

      // Add markers
      COUNTRIES.forEach((country) => {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          border: 2.5px solid ${country.status === 'ongoing' ? '#f59e0b' : '#22c55e'};
          background: ${country.status === 'ongoing' ? 'rgba(245,158,11,0.25)' : 'rgba(34,197,94,0.25)'};
          box-shadow: 0 0 14px ${country.status === 'ongoing' ? '#f59e0b' : '#22c55e'};
          transition: transform 0.2s;
        `;
        el.innerText = country.flag;
        el.title = country.name;

        el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.3)'; });
        el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
        el.addEventListener('click', () => {
          isSpinning.current = false;
          cancelAnimationFrame(spinRef.current);
          setSelected(country);
          map.panTo({ lat: country.lat, lng: country.lng });
          map.setZoom(4);
        });

        new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: country.lat, lng: country.lng },
          content: el,
          title: country.name,
        });
      });
    };

    // If Google Maps already loaded
    if (window.google?.maps) {
      loadMap();
    } else {
      window.initMap = loadMap;
    }

    return () => cancelAnimationFrame(spinRef.current);
  }, []);

  return (
    <section className="bg-[#05050A] py-20 px-4">
      {/* Section Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.2em] text-[#6B7280] uppercase mb-3">Global Democracy</p>
        <h2 className="text-5xl font-bold text-[#F0EEE4] font-[Syne]">
          Elections <em className="font-[Playfair_Display] text-[#D4A017] not-italic">Around the World</em>
        </h2>
        <p className="text-[#6B7280] mt-3 text-sm">Click any flag to see live election data · Drag to explore</p>
        <div className="flex gap-8 justify-center mt-5 text-sm text-[#F0EEE4]">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] inline-block" />
            Election Concluded
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] inline-block animate-pulse" />
            Election Ongoing
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative max-w-6xl mx-auto">
        <div ref={mapRef} className="w-full h-[560px] rounded-2xl overflow-hidden border border-white/10" />

        {/* Info Panel — slides in from right on marker click */}
        {selected && (
          <div className="absolute top-4 right-4 w-72 rounded-2xl overflow-hidden
            border border-[#2563EB]/40 bg-[#0D0D1A]/95 backdrop-blur-xl shadow-2xl z-10
            animate-in slide-in-from-right duration-300">
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selected.flag}</span>
                  <div>
                    <h3 className="text-[#F0EEE4] font-bold text-lg font-[Syne]">{selected.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                      ${selected.status === 'ongoing'
                        ? 'bg-[#f59e0b] text-black'
                        : 'bg-[#22c55e] text-black'}`}>
                      {selected.status === 'ongoing' ? '🔴 ONGOING ' + selected.year : '✅ CONCLUDED ' + selected.year}
                    </span>
                  </div>
                </div>
                <button onClick={() => { setSelected(null); isSpinning.current = true; spinRef.current = requestAnimationFrame(() => {}); }}
                  className="text-[#6B7280] hover:text-white text-xl leading-none">✕</button>
              </div>

              {/* Data rows */}
              {[
                { label: 'Leader', value: selected.leader, color: '#F0EEE4' },
                { label: 'Title', value: selected.title, color: '#F0EEE4' },
                { label: 'Party', value: selected.party, color: '#F0EEE4' },
                { label: 'Registered Voters', value: selected.voters, color: '#2563EB' },
                { label: 'Voter Turnout', value: selected.turnout, color: '#D4A017' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center py-2
                  border-b border-white/5 last:border-0">
                  <span className="text-[#6B7280] text-xs uppercase tracking-wide">{label}</span>
                  <span className="text-sm font-semibold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
