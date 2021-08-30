import styles from "./ProjectItem.module.scss";
import Button from "./Button";

// TODO: see if ProjectItem and ImageSection can consolidated into one component (both have image, then title, then body text)
/**
 * Component that renders an image as well as text, similar to a card with an image.
 * 
 * @param {Object} props
 * @param {string} props.title
 * @param {string|string[]|JSX.Element|JSX.Element[]} props.text
 * @param {Object} props.image
 * @param {string} props.image.src
 * @param {string} [props.image.alt]
 * @param {Object[]} [props.buttons]
 * @param {string} props.buttons[].text
 * @param {Function} props.buttons[].onClick
 * @param {JSX.Element} props.buttons[].icon
 * @param {string} [props.containerClasses]
 */
export default function ProjectItem(props) {
  const { title="", text="", buttons=[], image={}, containerClasses } = props;
  const { src="", alt="" } = image;

  return (
    <div className={`flex-direction-row ${styles.container} ${containerClasses}`}>
      {/* Image */}
      <div className={`flex-basis-12 flex-basis-auto-sm flex-center ${styles.imageContainer}`}>
        <img className={styles.image} src={src} alt={alt} />
      </div>

      {/* Margin */}
      <div className={`flex-0 flex-basis-1-sm`}></div>

      {/* Text */}
      <div className={`flex-direction-col flex-basis-12 flex-1-sm ${styles.textContainer}`}>

        {/* Title */}
        <div className={`
          font-size-3
          justify-content-center
          text-align-center
          break-word
          ${styles.title}
        `}>
          {title}
        </div>

        {/* Body Text */}
        <div className={`flex-direction-col font-size-1 margin-top-3 align-items-center align-items-start-sm`}>
          {Array.isArray(text) ? (
            text.map((str, index) => <div key={index.toString()} className={index > 0 ? "margin-top-2" : undefined}>{str}</div>)
          ) : text}
        </div>

        {/* Buttons */}
        {buttons.length > 0 && (
          <div className={`flex-direction-row justify-content-center margin-top-3`}>
            {buttons.map((button, index) => (
              <Button
                key={index.toString()}
                text={button.text}
                size={2}
                containerClasses="margin-horz-2"
                onClick={button.onClick}
                customIconComponent={button.icon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}