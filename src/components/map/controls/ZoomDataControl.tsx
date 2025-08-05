import { useMap } from "react-map-gl/maplibre";
import { locationsBounds } from "../../../state/locations";
import { MapControl } from "./MapControl";
import style from "./MapControl.module.css";

export const ZoomDataControl = () => {
  const map = useMap();
  return (
    <MapControl
      title="Zoom to data"
      iconClass={style.zoomData}
      disabled={!locationsBounds.value}
      onClick={() => {
        map.current?.fitBounds(locationsBounds.value!, { padding: 50 });
      }}
    />
  );
};
