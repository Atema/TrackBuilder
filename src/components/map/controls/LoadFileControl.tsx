import { useMap } from "react-map-gl/maplibre";
import { uploadGpx } from "../../../state/import-gpx";
import { locationsBounds } from "../../../state/locations";
import { MapControl } from "./MapControl";
import style from "./MapControl.module.css";

export const LoadFileControl = () => {
  const map = useMap();
  return (
    <MapControl
      title="Load file"
      iconClass={style.loadFile}
      onClick={async () => {
        await uploadGpx();
        map.current?.fitBounds(locationsBounds.value, { padding: 50 });
      }}
    />
  );
};
