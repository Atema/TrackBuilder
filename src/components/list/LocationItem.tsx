import { DateTime } from "luxon";
import { FunctionComponent } from "preact";
import { useMemo, useRef } from "preact/hooks";
import { hoverLocation } from "../../state/hover";
import { Location, removeLocation, timeZone } from "../../state/locations";
import { scrollMapToLocation } from "../../state/scroll";
import { DialogControl } from "../dialogs/Dialog";
import { LocationDialog } from "../dialogs/LocationDialog";
import style from "./LocationItem.module.css";

const timeToStrings = (dt: DateTime) => {
  const [time, zone] = dt
    .toLocaleString(
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: timeZone.value,
        // @ts-ignore
        fractionalSecondDigits: 3,
        timeZoneName: "shortOffset",
      },
      { locale: "en-GB" }
    )
    .split(" ");

  return {
    date: dt.toLocaleString(
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: timeZone.value,
      },
      { locale: "en-GB" }
    ),
    time,
    zone,
  };
};

export type LocationProps = {
  location: Location;
};

export const LocationItem: FunctionComponent<LocationProps> = ({
  location,
}) => {
  const dialogControlRef = useRef<DialogControl>(null);
  const timeStrings = useMemo(
    () => location.time && timeToStrings(location.time),
    [location.time]
  );

  return (
    <>
      <div
        class={style.location}
        data-hover={location.id == hoverLocation.value}
        onMouseEnter={() => {
          hoverLocation.value = location.id;
        }}
        onMouseLeave={() => {
          hoverLocation.value = "";
        }}
      >
        <div
          class={style.locationInfo}
          onClick={() => {
            scrollMapToLocation(...location.coordinates);
          }}
        >
          {timeStrings ? (
            <>
              <div class={style.date}>{timeStrings.date}</div>
              <div class={style.time}>
                {timeStrings.time}{" "}
                <span class={style.timezone}>{timeStrings.zone}</span>
              </div>
            </>
          ) : (
            <>
              <div class={style.date}>No date</div>
              <div class={style.time}>No time</div>
            </>
          )}
          <div class={style.coordinates}>
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

        <div class={style.buttons}>
          <div
            class={style.button}
            onClick={() => {
              dialogControlRef?.current?.open();
            }}
          >
            <div class={style.editButton} />
          </div>

          <div
            class={style.button}
            onClick={() => {
              removeLocation(location.id);
            }}
          >
            <div class={style.deleteButton} />
          </div>
        </div>
      </div>

      <LocationDialog location={location} controlRef={dialogControlRef} />
    </>
  );
};
