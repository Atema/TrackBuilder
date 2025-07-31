import "maplibre-gl/dist/maplibre-gl.css";
import {
  Layer,
  Map,
  MapMouseEvent,
  MapRef,
  NavigationControl,
  Source,
} from "react-map-gl/maplibre";

import { useRef, useEffect, useCallback } from "preact/hooks";
import { hoverLocation } from "../../state/hover";
import {
  addLocation,
  locationsGeoJson,
  locationsGeoJsonLine,
  removeLocation,
} from "../../state/locations";
import { bgMapStyle } from "./styles/bg-style";

const onMapClick = (e: MapMouseEvent) => {
  addLocation(e.lngLat.lng, e.lngLat.lat);
};

const onMapRightClick = (e: MapMouseEvent) => {
  if (e.features?.length && e.features[0].source == "locs") {
    removeLocation(e.features[0].id as string);
  }
};

const onMapHover = (e: MapMouseEvent, map: MapRef) => {
  if (e.features?.length && e.features[0].source == "locs") {
    hoverLocation.value = e.features[0].id as string;
    map.getCanvas()!.style.cursor = "pointer";
  } else {
    hoverLocation.value = "";
    map.getCanvas()!.style.cursor = "";
  }
};

export const MapView = () => {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    console.log(mapRef.current?.getLayer("loc-points"));
  }, [mapRef.current]);

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
      onContextMenu={onMapRightClick}
      onMouseMove={useCallback(
        (e: MapMouseEvent) => onMapHover(e, mapRef.current!),
        [mapRef.current]
      )}
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
        <Layer
          id="loc-points"
          type="circle"
          paint={{
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              5,
              0,
              7,
              5,
              10,
              7,
            ],
            "circle-color": [
              "case",
              ["==", ["get", "id"], hoverLocation.value],
              "#f00",
              "#000",
            ],
          }}
        />
      </Source>
    </Map>
  );
};
