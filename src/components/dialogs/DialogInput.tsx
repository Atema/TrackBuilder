import { ComponentProps, FunctionComponent, RefObject } from "preact";
import { forwardRef } from "preact/compat";
import { useId, useImperativeHandle, useRef } from "preact/hooks";
import style from "./Dialog.module.css";

export type DialogInputProps = {
  label: string;
} & Omit<ComponentProps<"input">, "ref">;

export const DialogInput = forwardRef<HTMLInputElement, DialogInputProps>(
  ({ label, ...props }, ref) => (
    <label class={style.dialogInput}>
      <span>{label}</span>
      <input ref={ref} {...props} />
    </label>
  )
);
