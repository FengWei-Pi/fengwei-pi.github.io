import { Button } from "components/common/Button";

import styles from "./NavHeader.module.scss";

// TODO add collapsing functionality for smaller screens
export const NavHeader = () => {
  return (
    <nav aria-label="Main">
      <ul className={styles.list}>
        <li className={styles.title}>
          <Button className={styles.button} type="text" href="/">FengWei Pi</Button>
        </li>
        <li>
          <Button className={styles.button} type="text" href="/">Journey</Button>
        </li>
        <li>
          <Button className={styles.button} type="text" href="/values">
            Values
          </Button>
        </li>
      </ul>
    </nav>
  );
};
