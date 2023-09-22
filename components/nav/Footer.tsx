import { AiOutlineCopyright } from "react-icons/ai";

import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.container}>
      <AiOutlineCopyright className={styles.copyrightIcon} />
      {new Date().getFullYear()} FengWei Pi
    </footer>
  );
};
