import React, { useState, useEffect, useRef } from "react";
import { BsChevronDown, BsChevronUp, BsCheck } from "react-icons/bs";

import { Button } from "./Button";
import type { ButtonType } from "./Button";
import styles from "./DropdownButton.module.scss";

export type { ButtonType };

// TODO When option is focused and dropdown is closed, set focus back to button.
// Currently, nothing will be focused when an option was focused and dropdown is closed.
export const DropdownButton = (props: {
  className?: string;
  classNameOption?: string;
  children: React.ReactNode;
  href?: string;
  onChange?: (selectedIndex: number) => void;
  /** Defaults to 0 */
  selectedIndex?: number;
  /**
   * Changes the appearance and emphasis of button. 'filled' is high emphasis,
   * 'outline' is medium, and 'text' is low. Defaults to outline.
   */
   type?: ButtonType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // Used only when props.selectedIndex is undefined
  
  // Used to position dropdown container
  const [buttonHeight, setButtonHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Used to track focus
  const [tabIndex, setTabIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const children = React.Children.toArray(props.children);
  const trueSelectedIndex = props.selectedIndex ?? selectedIndex;

  const onButtonClick = () => {
    setIsOpen(prev => !prev);
  };

  const onOptionClick = (index: number) => {
    props.onChange?.(index);
    setIsOpen(false);
    setSelectedIndex(index);
    buttonRef.current?.focus();
  };

  const onFocus = (index: number) => {
    setTabIndex(index);
  };

  // Update option focus when focusedIndex changes
  useEffect(() => {
    optionsRef.current[tabIndex]?.focus();
  }, [tabIndex]);

  // Handle escape key and mouse presses
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        setIsOpen(false);
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        setTabIndex(prev => prev === -1 ? children.length-1 : Math.max(0, prev-1));
        event.preventDefault();
      } else if (event.key === "ArrowDown") {
        setTabIndex(prev => Math.min(children.length-1, prev+1));
        event.preventDefault();
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [children.length, isOpen]);

  // Keep track of button height
  useEffect(() => {
    if (!isOpen && containerRef.current !== null) {
      setButtonHeight(containerRef.current.clientHeight);
    } else if (isOpen) {
      setTabIndex(-1);
    }
  }, [isOpen]);

  return (
    <div className={styles.container} ref={containerRef}>
      <Button
        className={`${props.className}`}
        type={props.type}
        onClick={onButtonClick}
        ref={buttonRef}
        aria-expanded={isOpen}
        aria-haspopup={true}
      >
        {children[trueSelectedIndex]}
        {isOpen ?
          <BsChevronUp className={styles.icon} /> :
          <BsChevronDown className={styles.icon} />
        }
      </Button>
      {isOpen && (
        <ul className={styles.dropdownContainer} style={{ top: buttonHeight + 4 }} role="listbox">
          {children.map((child, index) => (
            <li
              className={styles.listItem}
              key={index.toString()}
              role="option"
              aria-selected={index === trueSelectedIndex}
            >
              <Button
                className={`${styles.option} ${props.classNameOption}`}
                type="text"
                onClick={() => onOptionClick(index)}
                onFocus={() => onFocus(index)}
                ref={(el) => optionsRef.current[index]= el}
                tabIndex={index === tabIndex ? 0 : -1}
              >
                {child}
                {index === trueSelectedIndex && <BsCheck className={styles.icon} />}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
