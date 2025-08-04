import { useSignalEffect } from "@preact/signals";
import { round } from "@turf/helpers";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef } from "preact/hooks";
import {
  Layer,
  Map,
  MapMouseEvent,
  MapRef,
  NavigationControl,
  Source,
} from "react-map-gl/maplibre";
import { hoverLocation } from "../../state/hover";
import {
  addLocation,
  locationsGeoJson,
  locationsGeoJsonLine,
  removeLocation,
  updateLocation,
} from "../../state/locations";
import { scrollListToLocation, scrollMapTo } from "../../state/scroll";
import { CalculateTimesControl } from "./controls/CalculateTimesControl";
import { ClearLocationsControl } from "./controls/ClearLocationsControl";
import { LoadFileControl } from "./controls/LoadFileControl";
import { MapControlGroup } from "./controls/MapControlGroup";
import { SaveFileControl } from "./controls/SaveFileControl";
import { ZoomDataControl } from "./controls/ZoomDataControl";
import { bgMapStyle } from "./styles/bg-style";

const getEventLoc = (e: MapMouseEvent) => {
  if (e.features?.length && e.features[0].source == "locs") {
    return e.features[0].id as string;
  }
};

const onMapClick = (e: MapMouseEvent) => {
  const id = getEventLoc(e);
  if (id) {
    return scrollListToLocation(id);
  }

  const addedId = addLocation({
    coordinates: [round(e.lngLat.lng, 7), round(e.lngLat.lat, 7)],
  });
  scrollListToLocation(addedId);
  hoverLocation.value = addedId;
  e.target.getCanvas().style.cursor = "pointer";
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
      updateLocation(id, {
        coordinates: [round(e.lngLat.lng, 7), round(e.lngLat.lat, 7)],
      });
    };

    const onUp = () => {
      e.target.off("mousemove", onMove);
    };

    e.target.on("mousemove", onMove);
    e.target.once("mouseup", onUp);
    e.target.getCanvas().style.cursor = "grab";
  }
};

export const MapView = () => {
  const mapRef = useRef<MapRef>(null);

  useSignalEffect(() => {
    if (scrollMapTo.value) {
      mapRef.current?.easeTo({ center: scrollMapTo.value });
    }
  });

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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      interactiveLayerIds={["loc-points"]}
    >
      <NavigationControl />

      <MapControlGroup position="top-right">
        <ZoomDataControl />
      </MapControlGroup>

      <MapControlGroup position="top-left">
        <LoadFileControl />
        <SaveFileControl />
        <ClearLocationsControl />
      </MapControlGroup>

      <MapControlGroup position="top-left">
        <CalculateTimesControl />
      </MapControlGroup>

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
              2,
              8,
              5,
              10,
              7,
            ],
            "circle-color": [
              "case",
              ["==", ["get", "id"], hoverLocation.value],
              "#999",
              "#000",
            ],
          }}
        />
      </Source>
    </Map>
  );
};
