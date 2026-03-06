import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { EmergencyCategory } from "./EmergencyButtons";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface EmergencyMapProps {
  userLocation: { lat: number; lng: number } | null;
  activeCategory: EmergencyCategory | null;
}

const mockLocations: Record<string, { name: string; lat: number; lng: number; address: string }[]> = {
  medical: [
    { name: "Apollo Hospital", lat: 17.4455, lng: 78.3489, address: "Jubilee Hills, Hyderabad" },
    { name: "KIMS Hospital", lat: 17.4138, lng: 78.4538, address: "Secunderabad, Hyderabad" },
    { name: "Care Hospital", lat: 17.4375, lng: 78.4483, address: "Banjara Hills, Hyderabad" },
  ],
  fire: [
    { name: "Madhapur Fire Station", lat: 17.4486, lng: 78.3908, address: "Madhapur, Hyderabad" },
    { name: "Ameerpet Fire Station", lat: 17.4375, lng: 78.4483, address: "Ameerpet, Hyderabad" },
  ],
  police: [
    { name: "Madhapur Police Station", lat: 17.4440, lng: 78.3866, address: "Madhapur, Hyderabad" },
    { name: "Gachibowli Police Station", lat: 17.4401, lng: 78.3489, address: "Gachibowli, Hyderabad" },
  ],
  shelter: [
    { name: "Community Relief Center", lat: 17.4500, lng: 78.3800, address: "Hitech City, Hyderabad" },
    { name: "Government Safe Zone", lat: 17.4300, lng: 78.4200, address: "Kukatpally, Hyderabad" },
  ],
  blood: [
    { name: "Red Cross Blood Bank", lat: 17.4350, lng: 78.4450, address: "Narayanguda, Hyderabad" },
    { name: "Thalassemia Society", lat: 17.4280, lng: 78.4580, address: "Basheerbagh, Hyderabad" },
  ],
  disaster: [
    { name: "NDRF Unit", lat: 17.4600, lng: 78.3700, address: "Kondapur, Hyderabad" },
  ],
  ambulance: [
    { name: "108 Ambulance Hub", lat: 17.4450, lng: 78.3900, address: "Madhapur, Hyderabad" },
    { name: "GVK EMRI Center", lat: 17.4380, lng: 78.4100, address: "Jubilee Hills, Hyderabad" },
  ],
  accident: [],
};

const EmergencyMap = ({ userLocation, activeCategory }: EmergencyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const center = userLocation || { lat: 17.4435, lng: 78.3772 }; // Default: Hitech City

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current).setView([center.lat, center.lng], 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // User marker
    if (userLocation) {
      L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 10,
        color: "#dc2626",
        fillColor: "#dc2626",
        fillOpacity: 0.8,
      })
        .addTo(map)
        .bindPopup("<b>Your Location</b>");
    }

    // Emergency service markers
    if (activeCategory) {
      const locations = mockLocations[activeCategory.id] || [];
      locations.forEach((loc) => {
        L.marker([loc.lat, loc.lng])
          .addTo(map)
          .bindPopup(
            `<div style="min-width:150px"><b>${loc.name}</b><br/><small>${loc.address}</small><br/><a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" style="color:#dc2626;font-weight:600">Get Directions →</a></div>`
          );
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center.lat, center.lng, activeCategory?.id, userLocation]);

  return (
    <section className="py-16 section-container" id="map">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">
          {activeCategory ? `Nearby ${activeCategory.label}` : "Emergency Services Map"}
        </h2>
        <p className="text-muted-foreground text-lg">
          {activeCategory
            ? `Showing ${activeCategory.label.toLowerCase()} services near you`
            : "Select an emergency type above to see nearby services"}
        </p>
      </div>
      <div className="glass-card overflow-hidden">
        <div ref={mapRef} className="w-full h-[400px] sm:h-[500px] rounded-2xl" />
      </div>
      {activeCategory && (mockLocations[activeCategory.id]?.length ?? 0) > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockLocations[activeCategory.id]?.map((loc, i) => (
            <div key={i} className="glass-card p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{loc.name}</h4>
                <p className="text-sm text-muted-foreground">{loc.address}</p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold text-sm hover:underline whitespace-nowrap ml-4"
              >
                Directions →
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EmergencyMap;
