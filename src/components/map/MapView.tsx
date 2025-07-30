import "maplibre-gl/dist/maplibre-gl.css";
import {
  Layer,
  Map,
  MapMouseEvent,
  MapRef,
  NavigationControl,
  Source,
} from "react-map-gl/maplibre";

import { useRef } from "preact/hooks";
import {
  addLocation,
  locationsGeoJson,
  locationsGeoJsonLine,
} from "../../state/locations";
import { bgMapStyle } from "./styles/bg-style";

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
      interactiveLayerIds={["loc-points"]}
    >
      <NavigationControl />

      <Source id="lines" type="geojson" data={locationsGeoJsonLine.value}>
        <Layer id="loc-line" type="line" />
      </Source>

      <Source
        id="locs"
        type="geojson"
        promoteId="id"
        data={locationsGeoJson.value}
      >
        <Layer id="loc-points" type="circle" />
      </Source>
    </Map>
  );
};
