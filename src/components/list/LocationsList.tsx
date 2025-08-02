import { downloadGpx } from "../../state/export-gpx";
import { uploadGpx } from "../../state/import-gpx";
import { locations } from "../../state/locations";
import { LocationItem } from "./LocationItem";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import style from "./LocationsList.module.css";
import { InserterItem } from "./InserterItem";
import { useRef } from "preact/hooks";
import { useSignalEffect } from "@preact/signals";
import { scrollListTo } from "../../state/scroll";

export const LocationsList = () => {
  const virtRef = useRef<VirtuosoHandle>(null);

  useSignalEffect(() => {
    virtRef.current?.scrollToIndex({
      index: scrollListTo.value.pos,
      align: "center",
      offset: 45,
    });
  });

  return (
    <div class={style.sidepanel}>
      <div>
        <button onClick={downloadGpx}>Download</button>
        <button onClick={uploadGpx}>Upload</button>
      </div>
      <div class={style.list}>
        <Virtuoso
          ref={virtRef}
          totalCount={locations.value.length * 2 + 1}
          defaultItemHeight={45}
          itemContent={(idx) =>
            idx % 2 == 1 ? (
              <LocationItem
                key={locations.value[(idx - 1) / 2].id}
                location={locations.value[(idx - 1) / 2]}
              />
            ) : (
              <InserterItem
                key={
                  idx == 0
                    ? "i-start"
                    : `i-${locations.value[(idx - 2) / 2].id}`
                }
                id={idx == 0 ? "start" : locations.value[(idx - 2) / 2].id}
              />
            )
          }
        />
      </div>
    </div>
  );
};
