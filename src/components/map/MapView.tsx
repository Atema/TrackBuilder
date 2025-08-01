import "maplibre-gl/dist/maplibre-gl.css";
import {
  Layer,
  Map,
  MapMouseEvent,
  NavigationControl,
  Source,
} from "react-map-gl/maplibre";

import { signal } from "@preact/signals";
import { hoverLocation } from "../../state/hover";
import {
  addLocation,
  locationsGeoJson,
  locationsGeoJsonLine,
  removeLocation,
  updateLocationCoord,
} from "../../state/locations";
import { bgMapStyle } from "./styles/bg-style";

const dragItem = signal<string>();

const getEventLoc = (e: MapMouseEvent) => {
  if (e.features?.length && e.features[0].source == "locs") {
    return e.features[0].id as string;
  }
};

const onMapClick = (e: MapMouseEvent) => {
  if (getEventLoc(e) || dragItem.value) {
    return;
  }

  addLocation({ coord: e.lngLat });
};

const onMapRightClick = (e: MapMouseEvent) => {
  const id = getEventLoc(e);
  if (id) {
    removeLocation(id);
  }
};

const onMouseMove = (e: MapMouseEvent) => {
  if (dragItem.value) {
    updateLocationCoord(dragItem.value, { coord: e.lngLat });
    return;
  }

  const id = getEventLoc(e);
  if (id) {
    hoverLocation.value = id;
    e.target.getCanvas().style.cursor = "pointer";
  } else {
    hoverLocation.value = "";
    e.target.getCanvas().style.cursor = "";
  }
};

const onMouseDown = (e: MapMouseEvent) => {
  const id = getEventLoc(e);

  if (id && e.originalEvent.button == 1) {
    dragItem.value = id;
    e.preventDefault();
    e.target.once("mouseup", onMouseUp);
    e.target.getCanvas().style.cursor = "grab";
  }
};

const onMouseUp = () => {
  dragItem.value = undefined;
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
    onMouseMove={onMouseMove}
    onMouseDown={onMouseDown}
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
