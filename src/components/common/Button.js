import styles from "./Button.module.scss";

/**
 * @param {Object} props 
 * @param {string} [props.text]
 * @param {Function} [props.onClick]
 * @param {number} [props.size=1] - One of 1, 2, 3, or 4
 * @param {string} [props.containerClasses]
 * @param {string} [props.iconContainerClasses]
 * @param {boolean} [props.disabled=false]
 * @param {JSX.Element} [props.customIconComponent]
 */
export default function Button(props) {
  const { text="", size=1, onClick, customIconComponent, containerClasses, iconContainerClasses, disabled } = props;

  return (
    <div
      className={`
        text-align-center
        align-items-center
        justify-content-center
        line-height-normal
        ${size <= 1 && styles.size1}
        ${size === 2 && styles.size2}
        ${size === 3 && styles.size3}
        ${size >= 4 && styles.size4}
        ${styles.container}
        ${containerClasses}
      `}
      onClick={() => {
        if (!props.disabled) onClick();
      }}
    >
      {text}

      { /* Icon */}
      {customIconComponent && 
        <div className={`align-center ${iconContainerClasses}`}>
          {customIconComponent}
        </div>
      }
    </div>
  );
}