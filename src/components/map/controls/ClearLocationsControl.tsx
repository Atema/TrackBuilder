import { clearLocations } from "../../../state/locations";
import { MapControl } from "./MapControl";
import style from "./MapControl.module.css";

export const ClearLocationsControl = () => (
  <MapControl
    title="Clear locations"
    iconClass={style.clearLocations}
    onClick={clearLocations}
  />
);
