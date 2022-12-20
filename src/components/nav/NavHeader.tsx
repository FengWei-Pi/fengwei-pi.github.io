import { useHistory, useLocation } from "react-router-dom";

import { Button } from "components/common/Button";

import styles from "./NavHeader.module.scss";

// TODO add collapsing functionality for smaller screens
export const NavHeader = () => {
  const history = useHistory();
  const location = useLocation();

  const navigate = (url: string) => {
    if (location.pathname === url) return;
    history.push(url);
  };

  return (
    <nav aria-label="Main">
      <ul className={styles.list}>
        <li className={styles.title}>
          <Button className={styles.button} type="text" onClick={() => navigate("/")}>FengWei Pi</Button>
        </li>
        <li>
          <Button className={styles.button} type="text" onClick={() => navigate("/")}>Journey</Button>
        </li>
        <li>
          <Button className={styles.button} type="text" onClick={() => navigate("/values")}>
            Values
          </Button>
        </li>
      </ul>
    </nav>
  );
};