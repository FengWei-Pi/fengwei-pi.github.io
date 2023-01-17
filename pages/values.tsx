import { useMemo, useState, useEffect } from "react";
import Head from "next/head";
import type { GetStaticProps } from "next";

import { NavHeader } from "components/nav/NavHeader";
import { NavContentsTable } from "components/nav/NavContentsTable";
import { getDataFromArticleFile } from "lib/article/article";
import type { ArticleData } from "lib/article/article";
import { throttle } from "lib/throttle";
import styles from "./values.module.scss";

type Props = {
  articleData?: ArticleData
}

const ValuesPage = (props: Props) => {
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);

  // Track currently visible article section
  useEffect(() => {
    const throttleMilliseconds = 300;
    const headings = props.articleData?.headings !== undefined ?
      props.articleData.headings.filter((heading) => heading.depth === 2) :
      [];

    const handleScroll = throttle(() => {
      const cutoffY = 200;

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
  }, [props.articleData?.headings]);

  const h2HeadingLinks = useMemo(() => {
    return props.articleData?.headings
      .filter((heading) => heading.depth === 2)
      .map((heading) => ({
        label: heading.text, url: "#" + heading.text
      }));
  }, [props.articleData?.headings]);

  return (
    <>
      <Head>
        <title>Values</title>
      </Head>

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
            links={h2HeadingLinks ?? []}
          />
        </div>
        <div
          className={styles.articleContainer}
          dangerouslySetInnerHTML={{ __html: props.articleData?.html ?? "" }}
        />
        <div className={styles.articleSideContainer}>
        </div>
      </div>
    </>
  );
};

export default ValuesPage;

export const getStaticProps: GetStaticProps<Props> = () => {
  const articleData = getDataFromArticleFile("values");
  
  return {
    props: {
      articleData,
    },
  };
};
