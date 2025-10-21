import { XMLParser } from "fast-xml-parser";
import { DateTime } from "luxon";
import { addLocation, fileAuthor, fileName, locations } from "./locations";
import { scrollListToLocation } from "./scroll";

const alwaysArray = ["gpx.trk", "gpx.trk.trkseg", "gpx.trk.trkseg.trkpt"];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "$",
  isArray: (_, jpath) => alwaysArray.includes(jpath),
});

type GpxXml = {
  gpx?: {
    metadata?: {
      name?: string;
      author?: {
        name?: string;
      };
    };
    trk?: {
      trkseg?: {
        trkpt?: {
          $lon: string;
          $lat: string;
          time: string;
          ele?: number;
        }[];
      }[];
    }[];
  };
};

export const parseGpx = (contents: string, filename?: string) => {
  try {
    const { gpx } = xmlParser.parse(contents) as GpxXml;

    if (!gpx || !gpx.trk) {
      throw new Error("No gpx data found in file");
    }

    if (!fileName.value) {
      fileName.value = gpx.metadata?.name || filename || "";
    }

    if (!fileAuthor.value) {
      fileAuthor.value = gpx.metadata?.author?.name || "";
    }

    const points = (gpx.trk || [])
      .flatMap((trk) => trk.trkseg || [])
      .flatMap((seg) => seg.trkpt || []);

    if (points.length === 0) {
      throw new Error("No track data found in file");
    }

    let id: string = "";

    for (const point of points) {
      id = addLocation({
        coordinates: [parseFloat(point.$lon), parseFloat(point.$lat)],
        time: point.time ? DateTime.fromISO(point.time) : undefined,
        elevation: point.ele,
      });
    }

    scrollListToLocation(id);
  } catch (e) {
    window.alert(`${e}`);
  }
};

export const uploadGpx = () =>
  new Promise<void>((resolve, reject) => {
    if (
      locations.value.length > 0 &&
      !window.confirm(
        "Are you sure? This will insert the locations in the current position.",
      )
    ) {
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/gpx+xml";

    input.addEventListener("change", async () => {
      if (input.files?.length) {
        parseGpx(await input.files[0].text(), input.files[0].name);
        resolve();
      }
      reject();
    });

    input.click();
  });
