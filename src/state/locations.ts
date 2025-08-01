import { computed, signal } from "@preact/signals";
import { FeatureCollection, LineString, Point } from "geojson";
import { LngLat } from "maplibre-gl";
import { DateTime } from "luxon";

export type Location = {
  id: string;
  coord: LngLat;
  time?: DateTime;
};

export const locations = signal<Location[]>([]);

export const locationsGeoJson = computed<FeatureCollection<Point>>(() => ({
  type: "FeatureCollection",
  features: locations.value.map(({ id, coord }) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: coord.toArray(),
    },
    properties: {
      id,
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
          coordinates: locations.value.map((loc) => loc.coord.toArray()),
        },
        properties: {},
      },
    ],
  })
);

export const addLocation = (location: Omit<Location, "id">) => {
  locations.value = [
    ...locations.value,
    {
      id: crypto.randomUUID(),
      ...location,
    },
  ];
};

export const removeLocation = (id: string) => {
  locations.value = locations.value.filter((loc) => loc.id != id);
};

export const updateLocationCoord = (
  id: string,
  location: Partial<Location>
) => {
  locations.value = locations.value.map((loc) =>
    loc.id == id
      ? {
          ...loc,
          ...location,
        }
      : loc
  );
};
