import { calculateTimes } from "../../../state/locations";
import { MapControl } from "./MapControl";
import style from "./MapControl.module.css";

export const CalculateTimesControl = () => (
  <MapControl
    title="Calculate times"
    iconClass={style.calculateTimes}
    onClick={calculateTimes}
  />
);
