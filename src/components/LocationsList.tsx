import { downloadGpx } from "../state/export-gpx";
import { locations } from "../state/locations";

export const LocationsList = () => (
  <div>
    <button onClick={() => downloadGpx()}>Download</button>
    {locations.value.map((loc) => (
      <div key={loc.id}>
        {loc.lat}, {loc.lon}
      </div>
    ))}
  </div>
);
