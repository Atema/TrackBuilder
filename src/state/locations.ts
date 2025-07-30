import { signal } from "@preact/signals";

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
