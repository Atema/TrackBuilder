import { ComponentChildren, FunctionComponent, Ref } from "preact";
import { useImperativeHandle, useRef } from "preact/hooks";
import style from "./Dialog.module.css";

export type DialogControl = {
  open: () => void;
};

export type DialogProps = {
  title: string;
  children: ComponentChildren;
  controlRef: Ref<DialogControl>;
};

export const Dialog: FunctionComponent<DialogProps> = ({
  title,
  children,
  controlRef,
}) => {
  const innerRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(controlRef, () => ({
    open: () => {
      innerRef?.current?.showModal();
    },
  }));

  return (
    <dialog closedBy="any" class={style.dialog} ref={innerRef}>
      <div class={style.header}>
        <div class={style.title}>{title}</div>
      </div>
      <div class={style.content}>{children}</div>
    </dialog>
  );
};
