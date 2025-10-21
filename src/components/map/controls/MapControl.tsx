import type { FunctionComponent } from "preact";
import style from "./MapControl.module.css";

export type MapControlProps = {
  title: string;
  iconClass: string;
  disabled?: boolean;
  onClick: () => void;
};

export const MapControl: FunctionComponent<MapControlProps> = ({
  title,
  iconClass,
  disabled,
  onClick,
}) => (
  <button
    class={style.button}
    title={title}
    aria-label={title}
    disabled={disabled}
    onClick={onClick}
  >
    <div class={`${style.icon} ${iconClass}`} />
  </button>
);
