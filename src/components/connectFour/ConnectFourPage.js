import styles from "./ConnectFourPage.module.scss";
import ConnectFour from "./ConnectFour";

// TODO: add min width to all pages
export default function ConnectFourPage() {
  return (
    <div className={"flex-1 justify-content-center"}>
      <div className={"flex-1 max-width flex-direction-col align-items-center"}>
        <ConnectFour boardClasses={`${styles.connectFourBoard}`}/>
      </div>
    </div>
  );
}