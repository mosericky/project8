import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in bundlers
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  position: [number, number];
  onChange: (pos: [number, number]) => void;
}

const ClickHandler = ({ onChange }: { onChange: (p: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const DeliveryMap = ({ position, onChange }: Props) => {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  const pinIcon = L.divIcon({
    className: "delivery-pin-icon",
    html: `<div class="delivery-pin"></div>`,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
  });

  if (!ready) return <div className="map-container" />;
  return (
    <div className="map-container">
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={pinIcon} />
        <ClickHandler onChange={onChange} />
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;
