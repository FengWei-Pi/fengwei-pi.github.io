import { forwardRef, useMemo } from "react";
import type { HTMLAttributes } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/common/Button";
import { getElementFromArticle } from "utils/markdownUtils";
import styles from "./ArticleCard.module.scss";

/** A collapsible card that renders the provided article. */
export const ArticleCard = forwardRef<HTMLDivElement, {
  markdown: string;
  className?: string;
} & HTMLAttributes<HTMLElement>
>((props, ref) => {
  const { markdown, className, ...rest } = props;

  const history = useHistory();
  
  const article = useMemo(() => getElementFromArticle(markdown), [markdown]);
  const actions = article.frontmatter.actions;

  const onButtonClick = (url: string) => {
    if (!url.startsWith("http")) {
      // Relative path
      history.push(url);
    } else {
      // Absolute path
      window.open(url);
    }
  };

  const hasButtons = article.summaryElement !== undefined || (actions !== undefined && actions.length > 0);

  return (
    <div className={`${styles.container} ${className}`} ref={ref} {...rest}>
      <div className={styles.contentContainer}>
        <div className={`${styles.articleContainer} ${!hasButtons && styles.articleContainerNoButtons}`}>
          {article.element}
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
        </div>
      )}
    </div>
  );
});
