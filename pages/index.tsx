import { useCallback, useState } from "react";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import type { GetStaticProps } from "next";

import { ArticleCard } from "components/article/ArticleCard";
import { ArticlePath } from "components/article/ArticlePath";
import { StartPath } from "components/article/StartPath";
import { NavHeader } from "components/nav/NavHeader";

// TODO
import headshot from "public/images/headshot.jpg";
import { getDataFromArticleFile } from "lib/article/article";
import type { ArticleData } from "lib/article/article";
import styles from "./index.module.scss";

type Props = {
  articlesData?: Array<ArticleData>;
}

const HomePage = (props: Props) => {
  const articles = props.articlesData ?? [];

  const [articleElements, setArticleElements] = useState<Array<HTMLDivElement | null>>(
    Array(articles.length).fill(null)
  );
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

  return (
    <>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavHeader />
      <div className={styles.headerContainer} ref={setHeaderContainerRef}>
        <div className={styles.headerBackgroundContainer}>
          <div className={styles.headerBackground} />
        </div>
        <div className={styles.headerProfileContainer}>
          <Image className={styles.headerProfileImage} src={headshot} alt="profile" />
        </div>
        <h1 className={styles.headerText}>
          Hi, I&apos;m FengWei Pi, and this is my
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
              <ArticleCard ref={node => setArticleRef(node, index)} articleData={article}/>
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

export default HomePage;

export const getStaticProps: GetStaticProps<Props> = () => {
  const timelineFilenames = [
    "background",
    "university",
    "passionfruit",
    "plasmatic",
    "connectFourAi",
    "future"
  ];

  const articlesData = timelineFilenames.map(filename => getDataFromArticleFile(filename));

  return {
    props: {
      articlesData
    }
  };
};
