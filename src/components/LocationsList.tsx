import { locations } from "../state/locations";

export const LocationsList = () => (
  <div>
    {locations.value.map((loc) => (
      <div key={loc.id}>
        {loc.lat}, {loc.lon}
      </div>
    ))}
  </div>
);
