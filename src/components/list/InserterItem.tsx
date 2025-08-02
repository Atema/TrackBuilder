import { FunctionComponent } from "preact";
import { insertPosition, setInsertPosition } from "../../state/locations";
import style from "./InserterItem.module.css";

export type InserterItemProps = {
  id: string;
};

export const InserterItem: FunctionComponent<InserterItemProps> = ({ id }) => {
  if (insertPosition.value != id) {
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
  return <div class={style.insert}>Inserting here</div>;
};
