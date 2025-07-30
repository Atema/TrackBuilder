import { downloadGpx } from "../state/export-gpx";
import { uploadGpx } from "../state/import-gpx";
import { locations } from "../state/locations";

export const LocationsList = () => (
  <div>
    <button onClick={() => downloadGpx()}>Download</button>
    <button onClick={() => uploadGpx()}>Upload</button>
    {locations.value.map((loc) => (
      <div key={loc.id}>
        {loc.lat}, {loc.lon}
      </div>
    ))}
  </div>
);
