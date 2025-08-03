import { FunctionComponent } from "preact";
import style from "./MapControl.module.css";

export type MapControlProps = {
  title: string;
  buttonClass: string;
  onClick: () => void;
};

export const MapControl: FunctionComponent<MapControlProps> = ({
  title,
  buttonClass: buttonClass,
  onClick,
}) => (
  <button
    className={`${style.button} ${buttonClass}`}
    title={title}
    aria-label={title}
    onClick={onClick}
  >
    <span aria-hidden="true" />
  </button>
);
