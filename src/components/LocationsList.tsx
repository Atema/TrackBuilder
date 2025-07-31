import { downloadGpx } from "../state/export-gpx";
import { hoverLocation } from "../state/hover";
import { uploadGpx } from "../state/import-gpx";
import { locations } from "../state/locations";

import style from "./LocationsList.module.css";

export const LocationsList = () => (
  <div>
    <button onClick={downloadGpx}>Download</button>
    <button onClick={uploadGpx}>Upload</button>
    {locations.value.map((loc) => (
      <div
        class={style.location}
        key={loc.id}
        data-hover={loc.id == hoverLocation.value}
        onMouseEnter={() => {
          hoverLocation.value = loc.id;
        }}
        onMouseLeave={() => {
          hoverLocation.value = "";
        }}
      >
        {loc.lat}, {loc.lon}
      </div>
    ))}
  </div>
);
