import { forwardRef } from "react";
import type { HTMLAttributes, ElementType, ReactNode } from "react";
import Link from "next/link";

import styles from "./Button.module.scss";

export type ButtonType = "filled" | "outline" | "text";

export const Button = forwardRef<HTMLElement, {
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

  let Root: ElementType = "button";
  if (href) {
    if (!href.startsWith("http")) {
      // Relative path
      Root = Link;
    } else {
      // Absolute path
      Root = "a";
    }
  }

  let typeStyle = styles.outline;
  if (type === "filled") typeStyle = styles.filled;
  else if (type === "text") typeStyle = styles.text;

  return (
    <Root 
      className={`${typeStyle} ${styles.container} ${className}`}
      href={href}
      type="button"
      ref={ref}
      {
        // Open absolute links in new tab
        ...(Root === "a" ? { target: "_blank" } : {})
      }
      {...rest}
    >
      {children}
    </Root>
  );
});

Button.displayName = "Button";
