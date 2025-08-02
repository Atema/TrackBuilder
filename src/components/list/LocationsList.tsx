import { downloadGpx } from "../../state/export-gpx";
import { uploadGpx } from "../../state/import-gpx";
import { locations } from "../../state/locations";
import { LocationItem } from "./LocationItem";
import { Virtuoso } from "react-virtuoso";
import style from "./LocationsList.module.css";
import { InserterItem } from "./InserterItem";

export const LocationsList = () => (
  <div class={style.sidepanel}>
    <div>
      <button onClick={downloadGpx}>Download</button>
      <button onClick={uploadGpx}>Upload</button>
    </div>
    <div class={style.list}>
      <Virtuoso
        totalCount={locations.value.length * 2 + 1}
        itemContent={(idx) =>
          idx % 2 == 1 ? (
            <LocationItem
              key={locations.value[(idx - 1) / 2].id}
              location={locations.value[(idx - 1) / 2]}
            />
          ) : (
            <InserterItem
              key={
                idx == 0 ? "i-start" : `i-${locations.value[(idx - 2) / 2].id}`
              }
              id={idx == 0 ? "start" : locations.value[(idx - 2) / 2].id}
            />
          )
        }
      />
    </div>
  </div>
);
