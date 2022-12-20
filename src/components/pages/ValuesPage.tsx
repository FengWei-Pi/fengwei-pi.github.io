import { useMemo, useState, useEffect } from "react";

import { NavHeader } from "components/nav/NavHeader";
import { NavContentsTable } from "components/nav/NavContentsTable";
import { getElementFromArticle, throttle } from "utils/markdownUtils";
import valuesArticle from "assets/articles/values.md";
import styles from "./ValuesPage.module.scss";

export const ValuesPage = () => {
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);

  const article = useMemo(() => {
    return getElementFromArticle(valuesArticle);
  }, []);

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

  return (
    <>
      <NavHeader />
      <div className={styles.headerContainer}>
        <div className={styles.headerBackgroundContainer}>
          <div className={styles.headerBackground} />
        </div>
        <h1 className={styles.header}>Values</h1>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.articleSideContainer}>
          <NavContentsTable
            activeIndex={currentHeadingIndex}
            title="Contents"
            className={styles.contentsTable}
            links={h2HeadingLinks}
          />
        </div>
        <div className={styles.articleContainer}>{article.element}</div>
        <div className={styles.articleSideContainer}>
        </div>
      </div>
    </>
  );
};
