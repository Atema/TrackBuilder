import { useSignalEffect } from "@preact/signals";
import { useRef } from "preact/hooks";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { locations } from "../../state/locations";
import { scrollListTo } from "../../state/scroll";
import { InserterItem } from "./InserterItem";
import { LocationItem } from "./LocationItem";
import style from "./LocationsList.module.css";

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
    <div class={style.list}>
      <Virtuoso
        ref={virtRef}
        totalCount={locations.value.length * 2 + 1}
        defaultItemHeight={45}
        itemContent={(idx) =>
          idx % 2 === 1 ? (
            <LocationItem
              key={locations.value[(idx - 1) / 2].id}
              location={locations.value[(idx - 1) / 2]}
            />
          ) : (
            <InserterItem
              key={
                idx === 0 ? "i-start" : `i-${locations.value[(idx - 2) / 2].id}`
              }
              id={idx === 0 ? "start" : locations.value[(idx - 2) / 2].id}
            />
          )
        }
      />
    </div>
  );
};
