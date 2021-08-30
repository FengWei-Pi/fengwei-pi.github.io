import styles from "./ImageSection.module.scss";

export default function ProfileSection(props) {
  const {
    align="left",
    image={},
    title="", title2="",
    text="",
    backgroundColor="blue",
    titleClasses,
    title2Classes
  } = props;
  const { src="", alt="" } = image;

  return (
    <div
      className={`
        align-items-center
        padding-vert-5
        ${align === "right" && "flex-direction-row-reverse"}
        ${backgroundColor === "blue" && styles.bgBlue}
        ${backgroundColor === "pink" && styles.bgPink}
      `}
    >
      {/* Margin */}
      <div className={"flex-basis-1-sm flex-basis-2-xl"}></div>

      {/* Image */}
      <div className={`flex-center flex-basis-12 flex-basis-auto-sm margin-vert-4`}>
        <img className={`${styles.image}`} src={src} alt={alt} />
      </div>

      {/* Margin */}
      <div className={"flex-basis-1"}></div>

      {/* Text */}
      <div className={`
        flex-basis-10
        flex-1-sm
        flex-direction-col
        align-items-center
        ${align === "right" && "align-items-end-sm"}
        ${align !== "right" && "align-items-start-sm"}
      `}>
        
        {/* Title Text */}
        <div className={`
          font-size-3
          ${styles.titleText}
          ${align === "right" && "align-items-end-sm text-align-end-sm"}
          ${align !== "right" && "align-items-start-sm"}
          ${titleClasses}
        `}>
          {title}
          {title2 && <div className={`font-size-3 ${styles.title2Text} ${title2Classes}`}>{title2}</div>}
        </div>

        {/* Body Text */}
        <div className={`
          flex-direction-col
          font-size-1
          ${align === "right" && styles.textRight}
          ${align !== "right" && styles.textLeft}
          ${align === "right" && "align-items-end-sm text-align-end-sm"}
          ${align !== "right" && "align-items-start-sm"}
        `}>
          {Array.isArray(text) ? (
            text.map((str, index) => <div key={str} className={index > 0 ? "margin-top-3" : undefined}>{str}</div>)
          ) : text}
        </div>
      </div>

      {/* Margin */}
      <div className={"flex-basis-1 flex-basis-1-xl"}></div>
    </div>
  );
}