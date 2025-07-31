import { computed, signal } from "@preact/signals";
import { FeatureCollection, LineString, Point } from "geojson";

export type Location = {
  type: "loc";
  id: string;
  lat: number;
  lon: number;
};

export const locations = signal<Location[]>([]);

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

const roundCoord = (num: number) => Math.round(num * 100000000) / 100000000;

export const addLocation = (lon: number, lat: number) => {
  locations.value = [
    ...locations.value,
    {
      type: "loc",
      id: crypto.randomUUID(),
      lat: roundCoord(lat),
      lon: roundCoord(lon),
    },
  ];
};

export const removeLocation = (id: string) => {
  locations.value = locations.value.filter((loc) => loc.id != id);
};
