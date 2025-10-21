import { DateTime } from "luxon";
import type { FunctionComponent, RefObject } from "preact";
import { useRef } from "preact/hooks";
import {
  addLocation,
  type Location,
  updateLocation,
} from "../../state/locations";
import { Dialog, type DialogControl } from "./Dialog";
import style from "./Dialog.module.css";
import { DialogInput } from "./DialogInput";

export type LocationDialogProps = {
  location?: Location;
  controlRef: RefObject<DialogControl>;
};

export const LocationDialog: FunctionComponent<LocationDialogProps> = ({
  location,
  controlRef,
}) => {
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const elevationRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog
      title={location ? "Edit location" : "Add location"}
      controlRef={controlRef}
    >
      <form
        class={style.dialogForm}
        onSubmit={(e) => {
          e.preventDefault();

          const data = {
            coordinates: [
              longitudeRef?.current?.valueAsNumber || 0,
              latitudeRef?.current?.valueAsNumber || 0,
            ] as [number, number],
            elevation: Number.isNaN(elevationRef?.current?.valueAsNumber ?? NaN)
              ? undefined
              : elevationRef?.current?.valueAsNumber,
            time: timeRef?.current?.value
              ? DateTime.fromISO(timeRef.current.value)
              : undefined,
          };

          if (location) {
            updateLocation(location.id, data);
          } else {
            addLocation(data);
          }

          controlRef?.current?.close();
        }}
      >
        <DialogInput
          label="Latitude"
          ref={latitudeRef}
          type="number"
          step="any"
          value={location?.coordinates[1]}
        />

        <DialogInput
          label="Longitude"
          ref={longitudeRef}
          type="number"
          step="any"
          value={location?.coordinates[0]}
        />

        <DialogInput
          label="Elevation"
          ref={elevationRef}
          type="number"
          step="any"
          value={location?.elevation}
        />

        <DialogInput
          label="Date & time"
          ref={timeRef}
          type="datetime-local"
          step="0.001"
          value={location?.time?.toISO({ includeOffset: false }) || undefined}
        />

        <button class={style.dialogButton}>Save</button>
      </form>
    </Dialog>
  );
};
