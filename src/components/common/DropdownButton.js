import { useState } from "react";
import { BsChevronDown, BsChevronUp, BsCheck } from "react-icons/bs";

import styles from "./DropdownButton.module.scss";
import Button from "./Button";
import useOuterClick from "hooks/useOuterClick";

/**
 * Button that opens a dropdown menu when pressed.
 * 
 * @param {Object} props
 * @param {Array<string>} props.menuOptions
 * @param {number} props.size - Either 1, 2, 3, or 4. 1 is smallest size, 4 is biggest.
 * @param {Function} props.onChangeOptionIndex - Receives the new index as the parameter.
 * @param {Function} [props.onClick]
 * @param {number} [props.defaultOptionIndex=0]
 * @param {string} [props.containerClasses]
 * @param {string} [props.buttonClasses]
 * @param {string} [props.menuContainerClasses]
 */
export default function DropdownButton(props) {
  const {
    menuOptions, size, onChangeOptionIndex, defaultOptionIndex=0, onClick,
    containerClasses, buttonClasses, menuContainerClasses
  } = props;

  const [selectedIndex, setSelectedIndex] = useState(defaultOptionIndex);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerRef = useOuterClick(() => setIsMenuOpen(false));

  const handleClick = () => {
    setIsMenuOpen(prev => !prev);
    onClick && onClick();
  };

  const handleOptionClick = (index) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);
      onChangeOptionIndex(index);
    }
    setIsMenuOpen(prev => !prev);
  };

  return (
    // Top level container, used to position menu items absolutely relative to button, since button doesn't render children
    <div className={`${styles.container} ${containerClasses}`} ref={containerRef} >
      <Button
        containerClasses={buttonClasses}
        text={menuOptions[selectedIndex]}
        size={size}
        onClick={handleClick}
        customIconComponent={isMenuOpen ?
          <BsChevronUp size="0.8em" className={styles.dropdownIcon} /> :
          <BsChevronDown size="0.8em" className={styles.dropdownIcon} />
        }
      />
      {isMenuOpen &&
        <div className={`
          flex-direction-col
          align-items-stretch
          ${styles.menuContainer}
          ${menuContainerClasses}
        `}>
          {menuOptions.map((option, index) => (
            <div
              key={option}
              className={`align-items-center ${styles.menuOptionContainer}`}
              onClick={() => handleOptionClick(index)}
            >
              <div className="flex-1">{option}</div>
              <BsCheck className={styles.selectedIcon} style={index !== selectedIndex && { opacity: 0 }} />
            </div>
          ))}
        </div>
      }
    </div>
  );
}