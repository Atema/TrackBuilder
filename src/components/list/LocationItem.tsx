import { FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";
import { hoverLocation } from "../../state/hover";
import { Location } from "../../state/locations";
import style from "./LocationItem.module.css";

export type LocationProps = {
  location: Location;
};

export const LocationItem: FunctionComponent<LocationProps> = ({
  location,
}) => (
  <div
    class={style.location}
    key={location.id}
    data-hover={location.id == hoverLocation.value}
    onMouseEnter={useCallback(() => {
      hoverLocation.value = location.id;
    }, [location.id])}
    onMouseLeave={useCallback(() => {
      hoverLocation.value = "";
    }, [])}
  >
    <div>{location.lat}</div>
    <div>{location.lon}</div>
  </div>
);
