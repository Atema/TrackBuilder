import { downloadGpx } from "../../state/export-gpx";
import { uploadGpx } from "../../state/import-gpx";
import { locations } from "../../state/locations";
import { LocationItem } from "./LocationItem";
import { Virtuoso } from "react-virtuoso";
import style from "./LocationsList.module.css";

export const LocationsList = () => (
  <div class={style.sidepanel}>
    <div>
      <button onClick={downloadGpx}>Download</button>
      <button onClick={uploadGpx}>Upload</button>
    </div>
    <div class={style.list}>
      <Virtuoso
        data={locations.value}
        itemContent={(_, loc) => <LocationItem key={loc.id} location={loc} />}
      />
    </div>
  </div>
);
