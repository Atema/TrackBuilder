import { IANAZone } from "luxon";
import type { FunctionComponent, RefObject } from "preact";
import { useRef } from "preact/hooks";
import { fileAuthor, fileName, timeZone } from "../../state/locations";
import { Dialog, type DialogControl } from "./Dialog";
import style from "./Dialog.module.css";
import { DialogInput } from "./DialogInput";

export type SettingsDialogProps = {
  controlRef: RefObject<DialogControl>;
};

export const SettingsDialog: FunctionComponent<SettingsDialogProps> = ({
  controlRef,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const tzRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog title="Settings" controlRef={controlRef}>
      <form
        class={style.dialogForm}
        onSubmit={(e) => {
          e.preventDefault();

          fileName.value = nameRef?.current?.value || "";
          fileAuthor.value = authorRef?.current?.value || "";

          if (tzRef.current && IANAZone.isValidZone(tzRef.current.value)) {
            timeZone.value = tzRef.current.value;
          }

          controlRef?.current?.close();
        }}
      >
        <DialogInput
          type="text"
          label="Name"
          value={fileName.value}
          ref={nameRef}
        />
        <DialogInput
          type="text"
          label="Author"
          value={fileAuthor.value}
          ref={authorRef}
        />
        <DialogInput
          type="text"
          label="Timezone"
          value={timeZone.value}
          ref={tzRef}
        />
        <button class={style.dialogButton}>Save</button>
      </form>
    </Dialog>
  );
};
