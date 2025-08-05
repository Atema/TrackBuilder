import { useRef } from "preact/hooks";
import { SettingsDialog } from "../../dialogs/SettingsDialog";
import { MapControl } from "./MapControl";
import style from "./MapControl.module.css";
import { DialogControl } from "../../dialogs/Dialog";
import { createPortal } from "preact/compat";

export const SettingsControl = () => {
  const dialogControlRef = useRef<DialogControl>(null);

  return (
    <>
      {createPortal(
        <SettingsDialog controlRef={dialogControlRef} />,
        document.getElementById("settings-dialog")!
      )}
      <MapControl
        title="Settings"
        iconClass={style.settings}
        onClick={() => {
          dialogControlRef.current?.open();
        }}
      />
    </>
  );
};
