import { FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";
import { hoverLocation } from "../../state/hover";
import { Location, timeZone } from "../../state/locations";
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
    {location.time ? (
      <>
        <div class={style.date}>
          {location.time.toLocaleString(
            {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: timeZone.value,
            },
            { locale: "en-GB" }
          )}
        </div>
        <div class={style.time}>
          {location.time.toLocaleString(
            {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
              timeZone: timeZone.value,
            },
            { locale: "en-GB" }
          )}{" "}
          <span class={style.timezone}>
            {
              location.time
                .toLocaleString(
                  {
                    day: "numeric",
                    timeZone: timeZone.value,
                    timeZoneName: "shortOffset",
                  },
                  { locale: "en-GB" }
                )
                .split(", ")[1]
            }
          </span>
        </div>
      </>
    ) : (
      <div class={style.time}>No time</div>
    )}
    <div
      class={style.coordinates}
      onClick={useCallback(() => {
        window.navigator.clipboard.writeText(
          `${location.coordinates[1]}, ${location.coordinates[0]}`
        );
      }, [])}
    >
      {location.coordinates[1]}
      <span class={style.unit}>°</span>, {location.coordinates[0]}
      <span class={style.unit}>°</span>
      {location.elevation && (
        <>
          , {location.elevation}
          <span class={style.unit}>m↑</span>
        </>
      )}
    </div>
  </div>
);
