import { canRedo, canUndo, redo, undo } from "../../../state/history";
import { MapControl } from "./MapControl";
import style from "./MapControl.module.css";
import { MapControlGroup } from "./MapControlGroup";

export const UndoControl = () => (
  <MapControl
    title="Undo"
    iconClass={style.undo}
    onClick={undo}
    disabled={!canUndo.value}
  />
);

export const RedoControl = () => (
  <MapControl
    title="Redo"
    iconClass={style.redo}
    onClick={redo}
    disabled={!canRedo.value}
  />
);

export const UndoRedoControls = () => (
  <MapControlGroup position="top-left">
    <UndoControl />
    <RedoControl />
  </MapControlGroup>
);
