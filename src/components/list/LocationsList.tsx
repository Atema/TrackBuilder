import { downloadGpx } from "../../state/export-gpx";
import { uploadGpx } from "../../state/import-gpx";
import { locations } from "../../state/locations";
import { LocationItem } from "./LocationItem";
import "./LocationsList.module.css";

export const LocationsList = () => (
  <div>
    <button onClick={downloadGpx}>Download</button>
    <button onClick={uploadGpx}>Upload</button>
    {locations.value.map((location) => (
      <LocationItem location={location} />
    ))}
  </div>
);
