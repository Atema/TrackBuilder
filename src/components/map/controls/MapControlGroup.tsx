import { Signal, useSignal } from "@preact/signals";
import { FunctionalComponent } from "preact";
import { createPortal } from "preact/compat";
import { ControlPosition, IControl, useControl } from "react-map-gl/maplibre";

class Control implements IControl {
  #container: Signal<HTMLElement | undefined>;

  constructor(container: Signal<HTMLElement | undefined>) {
    this.#container = container;
  }

  onAdd() {
    const container = document.createElement("div");
    container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    this.#container.value = container;
    return container;
  }

  onRemove(): void {
    this.#container.value?.remove();
    this.#container.value = undefined;
  }
}

export type MapControlGroupProps = {
  position: ControlPosition;
};

export const MapControlGroup: FunctionalComponent<MapControlGroupProps> = ({
  children,
  position,
}) => {
  const container = useSignal<HTMLElement>();

  useControl(() => new Control(container), {
    position,
  });

  if (!container.value) return null;

  return createPortal(children, container.value);
};
