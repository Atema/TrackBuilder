import { FunctionComponent } from "preact";
import style from "./MapControl.module.css";

export type MapControlProps = {
  title: string;
  iconClass: string;
  onClick: () => void;
};

export const MapControl: FunctionComponent<MapControlProps> = ({
  title,
  iconClass,
  onClick,
}) => (
  <button
    class={style.button}
    title={title}
    aria-label={title}
    onClick={onClick}
  >
    <span aria-hidden="true" class={iconClass} />
  </button>
);
