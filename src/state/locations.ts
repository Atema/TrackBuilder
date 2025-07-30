import { computed, signal } from "@preact/signals";
import { FeatureCollection, LineString, Point } from "geojson";

type Loc = {
  type: "loc";
  id: `${string}-${string}-${string}-${string}-${string}`;
  lat: number;
  lon: number;
};

type Cursor = {
  type: "cursor";
  insert: "above" | "below";
};

export const locations = signal<Loc[]>([]);

export const locationsGeoJson = computed<FeatureCollection<Point>>(() => ({
  type: "FeatureCollection",
  features: locations.value.map((loc) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [loc.lon, loc.lat],
    },
    properties: {
      id: loc.id,
    },
  })),
}));

export const locationsGeoJsonLine = computed<FeatureCollection<LineString>>(
  () => ({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: locations.value.map((loc) => [loc.lon, loc.lat]),
        },
        properties: {},
      },
    ],
  })
);

export const addLocation = (lon: number, lat: number) => {
  locations.value = [
    ...locations.value,
    {
      type: "loc",
      id: crypto.randomUUID(),
      lat,
      lon,
    },
  ];
};
