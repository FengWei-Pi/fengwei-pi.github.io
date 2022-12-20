import { useCallback, useState, useEffect } from "react";

import { ArticleCard } from "components/article/ArticleCard";
import { ArticlePath } from "components/article/ArticlePath";
import { StartPath } from "components/article/StartPath";
import { NavHeader } from "components/nav/NavHeader";
import styles from "./HomePage.module.scss";

import headshot from "assets/headshot-3-small.jpg";
import backgroundArticle from "assets/articles/background.md";
import universityArticle from "assets/articles/university.md";
import passionfruitArticle from "assets/articles/passionfruit.md";
import plastmaticArticle from "assets/articles/plasmatic.md";
import connectFourArticle from "assets/articles/connectFourAi.md";
import futureArticle from "assets/articles/future.md";

// TODO get articles from articleUtils.js
// TODO add image to website title element
export const HomePage = () => {
  const [articles, setArticles] = useState<Array<string>>([]);

  const [articleElements, setArticleElements] = useState<Array<HTMLDivElement | null>>([]);
  const [headerTitleElement, setHeaderTitleElement] = useState<HTMLDivElement | null>(null);
  const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(null);

  // Refs used for positioning canvas for drawing paths
  const setArticleRef = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el === null) return;

    setArticleElements(prev => {
      if (prev[index] === el) return prev;

      const newCards = [...prev];
      newCards[index] = el;
      return newCards;
    });
  }, []);

  const setHeaderJourneyRef = useCallback((el: HTMLDivElement | null) => {
    if (el === null) return;
    setHeaderTitleElement(el);
  }, []);

  const setHeaderContainerRef = useCallback((el: HTMLDivElement | null) => {
    if (el === null) return;
    setHeaderElement(el);
  }, []);

  // Fetch articles
  // Currently does not fetch, but is open to future fetch or async implementations.
  useEffect(() => {
    const articles = [
      backgroundArticle,
      universityArticle,
      passionfruitArticle,
      connectFourArticle,
      plastmaticArticle,
      futureArticle
    ];
    setArticles(articles);
    setArticleElements(Array(articles.length).fill(null));
  }, []);

  return(
    <>
      <NavHeader />
      <div className={styles.headerContainer} ref={setHeaderContainerRef}>
        <div className={styles.headerBackgroundContainer}>
          <div className={styles.headerBackground} />
        </div>
        <div className={styles.headerProfileContainer}>
          <img className={styles.headerProfileImage} src={headshot} alt="profile" />
        </div>
        <h1 className={styles.headerText}>
          Hi, I'm FengWei Pi, and this is my
          <div className={styles.headerTextEmphasis} ref={setHeaderJourneyRef}>
            Journey
          </div>
          from CS graduate to frontend developer and AI enthusiast
        </h1>
        {articleElements.length >= 1 && articleElements[0] !== null  && articleElements[1] !== null &&
          headerTitleElement !== null && headerElement !== null && (
          <StartPath
            title={headerTitleElement}
            titleContainer={headerElement}
            article1={articleElements[0]}
            article2={articleElements[1]}
          />
        )}
      </div>

      <div className={styles.articlesContainer}>
        {articles.map((article, index) => {
          const article1 = articleElements[index];
          const article2 = index + 1 < articles.length ? articleElements[index+1] : null;

          return (
            <div
              key={index.toString()}
              className={`${styles.articleContainer} ${index % 2 === 1 && styles.articleRight}`}
            >
              <ArticleCard ref={node => setArticleRef(node, index)} markdown={article}/>
              {article1 !== null && article2 !== null && 
                <ArticlePath article1={article1} article2={article2} toLeft={index % 2 === 1} />
              }
            </div>
          );
        })}
      </div>
    </>
  );
};
