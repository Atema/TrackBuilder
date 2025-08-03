import { batch, computed, signal } from "@preact/signals";
import { distance } from "@turf/distance";
import { featureCollection, lineString, point } from "@turf/helpers";
import { DateTime } from "luxon";
import { bbox } from "@turf/bbox";

export type Location = {
  id: string;
  coordinates: [number, number];
  time?: DateTime;
  elevation?: number;
};

export const locations = signal<Location[]>([]);

export const locationsGeoJson = computed(() =>
  featureCollection(
    locations.value.map(({ id, coordinates }) => point(coordinates, { id }))
  )
);

export const locationsBounds = computed(
  () => bbox(locationsGeoJson.value) as [number, number, number, number]
);

export const locationsGeoJsonLine = computed(() => {
  const before = locations.value
    .slice(0, insertIndex.value)
    .map((loc) => loc.coordinates);
  const insert = locations.value
    .slice(insertIndex.value - 1, insertIndex.value + 1)
    .map((loc) => loc.coordinates);
  const after = locations.value
    .slice(insertIndex.value)
    .map((loc) => loc.coordinates);

  return featureCollection([
    ...(before.length > 1 ? [lineString(before)] : []),
    ...(insert.length > 1 ? [lineString(insert, { insert: true })] : []),
    ...(after.length > 1 ? [lineString(after)] : []),
  ]);
});

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

export const clearLocations = () => {
  if (window.confirm("Are you sure to clear all locations?")) {
    insertPosition.value = "start";
    locations.value = [];
  }
};

export const calculateTimes = () => {
  const locs = locations.value;

  for (let i = 0; i < locs.length - 1; i++) {
    if (!locs[i].time || locs[i + 1].time) {
      continue;
    }

    const startIdx = i;
    let endIdx = i;
    let totalDist = 0;

    for (let j = i + 1; j < locs.length; j++) {
      totalDist += distance(locs[j].coordinates, locs[j - 1].coordinates);

      if (locs[j].time) {
        endIdx = j;
        break;
      }
    }

    const timeDiff = locs[endIdx].time!.diff(locs[startIdx].time!).toMillis();

    for (let j = startIdx + 1; j < endIdx; j++) {
      locs[j] = {
        ...locs[j],
        time: locs[j - 1].time!.plus(
          Math.round(
            (timeDiff / totalDist) *
              distance(locs[j].coordinates, locs[j - 1].coordinates)
          )
        ),
      };

      console.log(locs[j].time);
    }

    i = endIdx;
  }

  locations.value = [...locs];
};
