import React from "react";
import type { HTMLAttributes } from "react";

import styles from "./Button.module.scss";

export enum ButtonType {
  Filled,
  Outline,
  Text
}

// Passing `ref` as prop causes errors; custom ref prop needs different name than `ref`.
export const Button = React.forwardRef<any, {
  className?: string;
  children?: React.ReactNode;
  href?: string;
  /**
   * Changes the appearance and emphasis of button.
   * ButtonType.Filled is high emphasis, ButtonType.Outline is medium, ButtonType.Text is low.
   * Defaults to outline.
   */
  type?: ButtonType,
  } & HTMLAttributes<HTMLElement>
>((props, ref) => {
  const { className, children, href, type, ...rest } = props;

  let Root: React.ElementType = "button";
  if (href) Root = "a";

  let typeStyle = styles.outline;
  if (type === ButtonType.Filled) typeStyle = styles.filled;
  else if (type === ButtonType.Text) typeStyle = styles.text;

  return (
    <Root 
      className={`${typeStyle} ${styles.container} ${className}`}
      href={href}
      type="button"
      ref={ref}
      {...rest}
    >
      {children}
    </Root>
  );
}
);
