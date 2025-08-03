import { useMap } from "react-map-gl/maplibre";
import { MapControl } from "./MapControl";
import style from "./MapControl.module.css";
import { locationsBounds } from "../../../state/locations";

export const ZoomDataControl = () => {
  const map = useMap();
  return (
    <MapControl
      title="Zoom to data"
      buttonClass={style.zoomData}
      onClick={() => {
        console.log(locationsBounds.value);
        map.current?.fitBounds(locationsBounds.value, { padding: 50 });
      }}
    />
  );
};
