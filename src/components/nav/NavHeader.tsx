import { useHistory } from "react-router-dom";

import { Button } from "components/common/Button";

import styles from "./NavHeader.module.scss";

// TODO add collapsing functionality for smaller screens
export const NavHeader = () => {
  const history = useHistory();

  return (
    <nav aria-label="Main">
      <ul className={styles.list}>
        <li className={styles.title}>
          <Button className={styles.button} type="text" onClick={() => history.push("/")}>FengWei Pi</Button>
        </li>
        <li>
          <Button className={styles.button} type="text" onClick={() => history.push("/")}>Journey</Button>
        </li>
        <li>
          <Button className={styles.button} type="text" onClick={() => history.push("/values")}>
            Values
          </Button>
        </li>
      </ul>
    </nav>
  );
};