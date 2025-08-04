import { downloadGpx } from "../../../state/export-gpx";
import { MapControl } from "./MapControl";
import style from "./MapControl.module.css";

export const SaveFileControl = () => (
  <MapControl
    title="Save file"
    iconClass={style.saveFile}
    onClick={downloadGpx}
  />
);
