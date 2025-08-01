import { XMLParser } from "fast-xml-parser";
import { DateTime } from "luxon";
import { addLocation } from "./locations";

const alwaysArray = ["gpx.trk", "gpx.trk.trkseg", "gpx.trk.trkseg.trkpt"];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "$",
  isArray: (_, jpath) => alwaysArray.includes(jpath),
});

export const parseGpx = (contents: string, filename?: string) => {
  try {
    const { gpx } = xmlParser.parse(contents);

    if (!gpx) {
      throw new Error("No gpx data found in file");
    }

    // const name: string = `${gpx?.metadata?.name}` || filename || "";
    // const author: string = `${gpx.metadata?.author?.name}` || "";

    const points = gpx.trk
      .flatMap((trk: any) => trk.trkseg || [])
      .flatMap((seg: any) => seg.trkpt || []);

    if (points.length == 0) {
      throw new Error("No track data found in file");
    }

    points.forEach((el: any) => {
      addLocation({
        coordinates: [el["$lon"], el["$lat"]],
        time: el.time ? DateTime.fromISO(el.time) : undefined,
        ele: el.ele,
      });
    });
  } catch (e) {
    window.alert(`${e}`);
  }
};

export const uploadGpx = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/gpx+xml";

  input.addEventListener("change", async () => {
    if (input.files?.length) {
      parseGpx(await input.files[0].text(), input.files[0].name);
    }
  });

  input.click();
};
