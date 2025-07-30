import { XMLBuilder } from "fast-xml-parser";
import { locations } from "./locations";

const gpxBuilder = new XMLBuilder({
  format: true,
  ignoreAttributes: false,
  attributeNamePrefix: "$",
});

export const generateGpx = () => {
  return gpxBuilder.build({
    "?xml": {
      $version: "1.0",
      $encoding: "UTF-8",
      $standalone: "yes",
    },
    gpx: {
      $creator: "TrackBuilder by Atema",
      $version: "1.1",
      $xmlns: "http://www.topografix.com/GPX/1/1",
      "$xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "$xsi:schemaLocation":
        "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",

      metadata: {
        name: "File name",
      },

      trk: {
        name: "Track name",
        trkseg: {
          trkpt: locations.peek().map((loc) => ({
            $lat: loc.lat,
            $lon: loc.lon,
          })),
        },
      },
    },
  });
};

export const downloadGpx = () => {
  const gpxData = generateGpx();

  const blob = new Blob([gpxData], { type: "application/gpx+xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Download.gpx";
  link.click();
};
