import { useState, forwardRef, useMemo, useEffect } from "react";
import type { HTMLAttributes } from "react";
import { useHistory } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import { Button } from "components/common/Button";
import { NavContentsTable } from "components/nav/NavContentsTable";
import { getElementFromArticle, throttle } from "utils/markdownUtils";
import styles from "./ArticleCard.module.scss";

/** A collapsible card that renders the provided article. */
export const ArticleCard = forwardRef<HTMLDivElement, {
  markdown: string;
  className?: string;
} & HTMLAttributes<HTMLElement>
>((props, ref) => {
  const { markdown, className, ...rest } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const history = useHistory();
  
  const article = useMemo(() => getElementFromArticle(markdown), [markdown]);
  const actions = article.frontmatter.actions;

  // Track currently visible article section
  useEffect(() => {
    const throttleMilliseconds = 300;
    const headings = article.headings.filter((heading) => heading.depth === 2);

    const handleScroll = throttle(() => {
      const cutoffY = 100;

      // Get last heading that is scrolled above the window cutoff y
      for (let i=headings.length-1; i>=0; --i) {
        const element = document.getElementById(headings[i].text);

        if (element !== null && (i === 0 || element.getBoundingClientRect().top <= cutoffY)) {
          setCurrentHeadingIndex(i);
          break;
        }
      }
    }, throttleMilliseconds);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [article.headings]);

  const h2HeadingLinks = useMemo(() => {
    return article.headings
      .filter((heading) => heading.depth === 2)
      .map((heading) => ({
        label: heading.text, url: "#" + heading.text
      }));
  }, [article.headings]);

  const onButtonClick = (url: string) => {
    if (!url.startsWith("http")) {
      // Relative path
      history.push(url);
    } else {
      // Absolute path
      window.open(url);
    }
  };

  const onExpandToggle = () => {
    setIsExpanded(prev => !prev);
  };
  
  const hasButtons = article.summaryElement !== undefined || (actions !== undefined && actions.length > 0);

  return (
    <div className={`${styles.container} ${isExpanded && styles.containerExpanded} ${className}`} ref={ref} {...rest}>
      <div className={styles.contentContainer}>
        {isExpanded && 
          <NavContentsTable
            activeIndex={currentHeadingIndex}
            title="Contents"
            className={styles.contentsTable}
            links={h2HeadingLinks}
          />
        }
        <div className={`${styles.articleContainer} ${!hasButtons && styles.articleContainerNoButtons}`}>
          {(isExpanded || article.summaryElement === undefined) ?
            article.element :
            article.summaryElement
          }
        </div>
      </div>
      {hasButtons && (
        <div className={styles.buttonsContainer}>
          <div>
            {actions?.map(action => (
              <div key={action.label} className={styles.actionButtonContainer}>
                <Button onClick={() => onButtonClick(action.url)}>
                  {action.label}
                </Button>
              </div>
            ))}
          </div>
          <div className={styles.expandButtonContainer}>
            <Button type="text" onClick={onExpandToggle}>
              {article.summaryElement !== undefined && (
                isExpanded ? (
                  <>
                  Less
                    <BsChevronUp className={styles.icon} />
                  </>
                ) : (
                  <>
                  More
                    <BsChevronDown className={styles.icon} />
                  </>
                )
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
