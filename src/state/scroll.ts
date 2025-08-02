import { signal } from "@preact/signals";
import { locations } from "./locations";

export const scrollListTo = signal({
  pos: -1,
});

export const scrollMapTo = signal<[number, number]>();

export const scrollListToLocation = (id: string) => {
  const index = locations.value.findIndex((l) => l.id == id);

  if (index != -1) {
    scrollListTo.value = {
      pos: 2 * index + 1,
    };
  }
};

export const scrollMapToLocation = (lng: number, lat: number) => {
  scrollMapTo.value = [lng, lat];
};
