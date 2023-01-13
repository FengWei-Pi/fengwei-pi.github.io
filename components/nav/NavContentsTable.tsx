import type { HTMLAttributes } from "react";

import { Button } from "components/common/Button";
import styles from "./NavContentsTable.module.scss";

/** Table of contents for an article. */
export const NavContentsTable = (props: {
  /**
   * The link index that is highlighted. Should typically correspond
   * to section of article that is visible on screen.
   */
  activeIndex?: number;
  className?: string;
  links: Array<{
    label: string;
    url: string;
  }>;
  title: string;
} & HTMLAttributes<HTMLDivElement>) => {
  const { activeIndex, title, links, className, ...rest } = props;
  
  return (
    <div className={`${styles.container} ${props.className}`} {...rest}>
      <div id="title" className={styles.title}>{title}</div>
      <nav aria-labelledby="title">
        <ul className={styles.list}>
          {links.map((link, index) => (
            <li key={link.label}>
              <Button
                type="text"
                href={link.url}
                className={styles.button}
                aria-current={activeIndex === index}
                tabIndex={0}
              >
                {link.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
