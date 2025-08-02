import { batch, computed, signal } from "@preact/signals";
import { FeatureCollection, LineString, Point } from "geojson";
import { DateTime } from "luxon";

export type Location = {
  id: string;
  coordinates: [number, number];
  time?: DateTime;
  elevation?: number;
};

export const locations = signal<Location[]>([]);

export const locationsGeoJson = computed<FeatureCollection<Point>>(() => ({
  type: "FeatureCollection",
  features: locations.value.map(({ id, coordinates }) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates,
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
          coordinates: locations.value
            .slice(0, insertIndex.value)
            .map((loc) => loc.coordinates),
        },
        properties: {},
      },

      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: locations.value
            .slice(insertIndex.value - 1, insertIndex.value + 1)
            .map((loc) => loc.coordinates),
        },
        properties: {
          insert: true,
        },
      },

      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: locations.value
            .slice(insertIndex.value)
            .map((loc) => loc.coordinates),
        },
        properties: {},
      },
    ],
  })
);

export const addLocation = (location: Omit<Location, "id">) => {
  const id = crypto.randomUUID();

  batch(() => {
    locations.value = [
      ...locations.value.slice(0, insertIndex.value),
      {
        id,
        ...location,
      },
      ...locations.value.slice(insertIndex.value),
    ];

    insertPosition.value = id;
  });

  return id;
};

export const removeLocation = (id: string) => {
  batch(() => {
    if (insertPosition.value == id) {
      insertPosition.value =
        locations.value[insertIndex.value - 2]?.id || "start";
    }

    locations.value = locations.value.filter((loc) => loc.id != id);
  });
};

export const updateLocation = (id: string, location: Partial<Location>) => {
  locations.value = locations.value.map((loc) =>
    loc.id == id
      ? {
          ...loc,
          ...location,
        }
      : loc
  );
};

export const timeZone = signal(DateTime.now().zoneName);

export const insertPosition = signal("start");

const insertIndex = computed(
  () => locations.value.findIndex((loc) => loc.id == insertPosition.value) + 1
);

export const setInsertPosition = (id: string) => {
  insertPosition.value = id;
};
