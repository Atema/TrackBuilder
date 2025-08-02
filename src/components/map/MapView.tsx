import "maplibre-gl/dist/maplibre-gl.css";
import {
  Layer,
  LngLat,
  Map,
  MapMouseEvent,
  NavigationControl,
  Source,
} from "react-map-gl/maplibre";

import { hoverLocation } from "../../state/hover";
import {
  addLocation,
  insertPosition,
  locationsGeoJson,
  locationsGeoJsonLine,
  removeLocation,
  updateLocation,
} from "../../state/locations";
import { bgMapStyle } from "./styles/bg-style";

const roundCoordinates = (lngLat: LngLat): [number, number] => [
  Math.round(lngLat.lng * 10000000) / 10000000,
  Math.round(lngLat.lat * 10000000) / 10000000,
];

const getEventLoc = (e: MapMouseEvent) => {
  if (e.features?.length && e.features[0].source == "locs") {
    return e.features[0].id as string;
  }
};

const onMapClick = (e: MapMouseEvent) => {
  const id = getEventLoc(e);
  if (id) {
    insertPosition.value = id;
    return;
  }

  addLocation({ coordinates: roundCoordinates(e.lngLat) });
};

const onMapRightClick = (e: MapMouseEvent) => {
  const id = getEventLoc(e);
  if (id) {
    removeLocation(id);
  }
};

const onMouseEnter = (e: MapMouseEvent) => {
  const id = getEventLoc(e);
  if (id) {
    hoverLocation.value = id;
    e.target.getCanvas().style.cursor = "pointer";
  }
};

const onMouseLeave = (e: MapMouseEvent) => {
  hoverLocation.value = "";
  e.target.getCanvas().style.cursor = "";
};

const onMouseDown = (e: MapMouseEvent) => {
  const id = getEventLoc(e);

  if (id && e.originalEvent.button == 1) {
    e.preventDefault();

    const onMove = (e: MapMouseEvent) => {
      updateLocation(id, { coordinates: roundCoordinates(e.lngLat) });
    };

    const onUp = () => {
      e.target.off("mousemove", onMove);
    };

    e.target.on("mousemove", onMove);
    e.target.once("mouseup", onUp);
    e.target.getCanvas().style.cursor = "grab";
  }
};

export const MapView = () => (
  <Map
    mapStyle={bgMapStyle}
    initialViewState={{
      latitude: 52.2,
      longitude: 5.3,
      zoom: 7.5,
    }}
    onClick={onMapClick}
    onContextMenu={onMapRightClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onMouseDown={onMouseDown}
    interactiveLayerIds={["loc-points"]}
  >
    <NavigationControl />

    <Source id="lines" type="geojson" data={locationsGeoJsonLine.value}>
      <Layer
        id="loc-line"
        type="line"
        filter={["!", ["has", "insert"]]}
        paint={{
          "line-width": 1.5,
        }}
      />

      <Layer
        id="loc-line-insert"
        type="line"
        filter={["has", "insert"]}
        paint={{
          "line-width": 2.5,
          "line-dasharray": ["literal", [3, 3]],
          "line-color": "#999",
        }}
      />
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
