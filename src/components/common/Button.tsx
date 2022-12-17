import { forwardRef, useRef } from "react";
import type { HTMLAttributes, ElementType, ReactNode } from "react";

import styles from "./Button.module.scss";

export type ButtonType = "filled" | "outline" | "text";

// Passing `ref` as prop causes errors; custom ref prop needs different name than `ref`.
export const Button = forwardRef<any, {
  className?: string;
  children?: ReactNode;
  href?: string;
  /**
   * Changes the appearance and emphasis of button. 'filled' is high emphasis,
   * 'outline' is medium, and 'text' is low. Defaults to outline.
   */
  type?: ButtonType,
  } & HTMLAttributes<HTMLElement>
>((props, ref) => {
  const { className, children, href, type, ...rest } = props;

  const localRef = useRef<HTMLElement | null>(null);

  let Root: ElementType = "button";
  if (href) Root = "a";

  let typeStyle = styles.outline;
  if (type === "filled") typeStyle = styles.filled;
  else if (type === "text") typeStyle = styles.text;

  return (
    <Root 
      className={`${typeStyle} ${styles.container} ${className}`}
      href={href}
      type="button"
      ref={(el) => {
        localRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref !== null) ref.current = ref;
      }}
      {...rest}
    >
      {children}
    </Root>
  );
}
);
