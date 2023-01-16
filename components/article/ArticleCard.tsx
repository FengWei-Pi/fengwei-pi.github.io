import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

import { Button } from "components/common/Button";
import type { ArticleData } from "lib/article/article";
import styles from "./ArticleCard.module.scss";

/** A collapsible card that renders the provided article. */
export const ArticleCard = forwardRef<HTMLDivElement, {
  articleData?: ArticleData;
  className?: string;
} & HTMLAttributes<HTMLElement>
>((props, ref) => {
  // TODO
  const { articleData, className, ...rest } = props;
  
  const actions = articleData?.frontmatter.actions;

  const hasButtons = actions !== undefined && actions.length > 0;

  return (
    <div className={`${styles.container} ${className}`} ref={ref} {...rest}>
      <div className={styles.contentContainer}>
        <div
          className={`
            ${styles.articleContainer}
            ${!hasButtons && styles.articleContainerNoButtons}
          `}
          dangerouslySetInnerHTML={{ __html: props.articleData?.html ?? "" }}
        />
      </div>
      {hasButtons && (
        <div className={styles.buttonsContainer}>
          {actions.map(action => (
            <Button key={action.label} href={action.url} className={styles.actionButton}>
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
});

ArticleCard.displayName = "ArticleCard";
