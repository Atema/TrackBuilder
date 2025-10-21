import type { FunctionComponent } from "preact";
import { useRef } from "preact/hooks";
import { insertPosition, setInsertPosition } from "../../state/locations";
import type { DialogControl } from "../dialogs/Dialog";
import { LocationDialog } from "../dialogs/LocationDialog";
import style from "./InserterItem.module.css";

export type InserterItemProps = {
  id: string;
};

export const InserterItem: FunctionComponent<InserterItemProps> = ({ id }) => {
  if (insertPosition.value !== id) {
    return (
      <div
        class={style.empty}
        role="button"
        onClick={() => setInsertPosition(id)}
      >
        Insert here
      </div>
    );
  }

  const dialogControlRef = useRef<DialogControl>(null);

  return (
    <>
      <LocationDialog controlRef={dialogControlRef} />
      <div
        class={style.insert}
        role="button"
        onClick={() => dialogControlRef?.current?.open()}
      >
        Inserting here
      </div>
    </>
  );
};
