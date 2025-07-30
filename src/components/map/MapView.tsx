import "maplibre-gl/dist/maplibre-gl.css";
import {
  Map,
  MapMouseEvent,
  MapRef,
  NavigationControl,
} from "react-map-gl/maplibre";

import { useRef } from "preact/hooks";
import { bgMapStyle } from "./styles/bg-style";
import { addLocation } from "../../state/locations";

const onMapClick = (e: MapMouseEvent) => {
  addLocation(e.lngLat.lng, e.lngLat.lat);
};

export const MapView = () => {
  const mapRef = useRef<MapRef>(null);

  return (
    <Map
      ref={mapRef}
      mapStyle={bgMapStyle}
      initialViewState={{
        latitude: 52.2,
        longitude: 5.3,
        zoom: 7.5,
      }}
      onClick={onMapClick}
    >
      <NavigationControl />
    </Map>
  );
};
