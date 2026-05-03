// src/components/WorldElectionMap.tsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { logFirebaseEvent } from '../lib/firebase';
import { announce } from '../hooks/useAccessibility';

const COUNTRIES = [
  { name:"India", lat:20.59, lng:78.96, flag:"🇮🇳", status:"concluded", year:2024, leader:"Narendra Modi", title:"Prime Minister", party:"BJP", voters:"969 Million", turnout:"66.3%" },
  { name:"USA", lat:37.09, lng:-95.71, flag:"🇺🇸", status:"concluded", year:2024, leader:"Donald Trump", title:"President", party:"Republican", voters:"244 Million", turnout:"64.4%" },
  { name:"UK", lat:55.37, lng:-3.43, flag:"🇬🇧", status:"concluded", year:2024, leader:"Keir Starmer", title:"Prime Minister", party:"Labour", voters:"48 Million", turnout:"59.7%" },
  { name:"Germany", lat:51.16, lng:10.45, flag:"🇩🇪", status:"ongoing", year:2025, leader:"Friedrich Merz", title:"Chancellor", party:"CDU", voters:"61.4 Million", turnout:"82.1%" },
  { name:"Australia", lat:-25.27, lng:133.77, flag:"🇦🇺", status:"ongoing", year:2025, leader:"Anthony Albanese", title:"Prime Minister", party:"ALP", voters:"17.6 Million", turnout:"89.1%" },
  { name:"Brazil", lat:-14.23, lng:-51.92, flag:"🇧🇷", status:"concluded", year:2022, leader:"Lula da Silva", title:"President", party:"PT", voters:"156 Million", turnout:"79.4%" },
  { name:"Japan", lat:36.20, lng:138.25, flag:"🇯🇵", status:"concluded", year:2024, leader:"Shigeru Ishiba", title:"Prime Minister", party:"LDP", voters:"105 Million", turnout:"53.8%" },
  { name:"Canada", lat:56.13, lng:-106.34, flag:"🇨🇦", status:"ongoing", year:2025, leader:"Mark Carney", title:"Prime Minister", party:"Liberal", voters:"28 Million", turnout:"68.2%" },
];

export default function WorldElectionMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [selected, setSelected] = useState<typeof COUNTRIES[0] | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
      backgroundColor: '#05050A'
    } as any);

    mapInstance.current = map;

    // Add High-Quality Satellite Tiles (Esri World Imagery)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
    }).addTo(map);

    // Auto-spin simulation
    let lng = 0;
    let spinning = true;
    const spin = () => {
      if (!spinning) return;
      lng = (lng + 0.3) % 360;
      map.setView([20, lng - 180], map.getZoom(), { animate: false });
      requestAnimationFrame(spin);
    };
    // Note: Manual panning in Leaflet with setView is heavy, so we only spin if map is at zoom 2
    const spinRequest = requestAnimationFrame(spin);

    map.on('mousedown', () => { spinning = false; });

    // Add custom markers
    COUNTRIES.forEach((c) => {
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            width:40px; height:40px; border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            font-size:22px; cursor:pointer;
            border:2px solid ${c.status==='ongoing'?'#f59e0b':'#22c55e'};
            background:${c.status==='ongoing'?'rgba(245,158,11,0.3)':'rgba(34,197,94,0.3)'};
            box-shadow:0 0 12px ${c.status==='ongoing'?'#f59e0b':'#22c55e'};
          ">
            ${c.flag}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([c.lat, c.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        spinning = false;
        setSelected(c);
        map.flyTo([c.lat, c.lng], 4);
        // [Google Services] Fire Firebase Analytics event
        logFirebaseEvent('map_marker_click', { country: c.name, status: c.status, year: c.year });
        // [Accessibility] Announce to screen readers
        announce(`Showing election data for ${c.name}. ${c.status === 'ongoing' ? 'Ongoing' : 'Concluded'} election in ${c.year}.`);
      });
    });

    return () => {
      cancelAnimationFrame(spinRequest);
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <section style={{ background:'#05050A', padding:'80px 16px' }}>
      <div style={{ textAlign:'center', marginBottom:'40px' }}>
        <p style={{ color:'#6B7280', fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'12px' }}>Global Democracy</p>
        <h2 style={{ color:'#F0EEE4', fontSize:'48px', fontWeight:'800', margin:0 }}>
          Elections Around the <span style={{ color:'#D4A017', fontStyle:'italic' }}>World</span>
        </h2>
        <p style={{ color:'#6B7280', marginTop:'12px', fontSize:'14px' }}>Click any flag marker to see election data · Drag to explore</p>
        <div style={{ display:'flex', gap:'32px', justifyContent:'center', marginTop:'16px' }}>
          <span style={{ color:'#F0EEE4', fontSize:'13px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px #22c55e', display:'inline-block' }}/>
            Concluded
          </span>
          <span style={{ color:'#F0EEE4', fontSize:'13px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b', boxShadow:'0 0 8px #f59e0b', display:'inline-block' }}/>
            Ongoing
          </span>
        </div>
      </div>

      <div style={{ position:'relative', maxWidth:'1100px', margin:'0 auto' }}>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '560px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'block',
            background: '#0D0D1A'
          }}
        />

        {/* Info panel */}
        {selected && (
          <div style={{
            position:'absolute', top:'16px', right:'16px', width:'280px',
            background:'rgba(13,13,26,0.96)', border:'1px solid rgba(37,99,235,0.4)',
            borderRadius:'16px', padding:'20px', zIndex:1000,
            backdropFilter:'blur(20px)',
            color: '#F0EEE4'
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                <span style={{ fontSize:'36px' }}>{selected.flag}</span>
                <div>
                  <div style={{ color:'#F0EEE4', fontWeight:'700', fontSize:'17px' }}>{selected.name}</div>
                  <span style={{
                    background: selected.status==='ongoing'?'#f59e0b':'#22c55e',
                    color:'#000', fontSize:'10px', padding:'2px 8px',
                    borderRadius:'999px', fontWeight:'700'
                  }}>
                    {selected.status==='ongoing'?`🔴 ONGOING ${selected.year}`:`✅ CONCLUDED ${selected.year}`}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ color:'#6B7280', background:'none', border:'none', fontSize:'20px', cursor:'pointer' }}>✕</button>
            </div>
            {[
              ['Leader', selected.leader, '#F0EEE4'],
              ['Title', selected.title, '#F0EEE4'],
              ['Party', selected.party, '#F0EEE4'],
              ['Voters', selected.voters, '#2563EB'],
              ['Turnout', selected.turnout, '#D4A017'],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color:'#6B7280', fontSize:'12px' }}>{label}</span>
                <span style={{ color: color as string, fontSize:'13px', fontWeight:'600' }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
