import fs from "fs";
import path from "path";

import {
  getFrontmatterFromMarkdown,
  getMdastFromMarkdown,
  getHastFromMdast,
  getHtmlFromHast,
  getHeadingsFromMdast,
  visit
} from "./markdown";
import type { Frontmatter, Action } from "./markdown";

// Re-export types from `markdown`
export type {
  Frontmatter,
  Action
};

/** Object returned from `getDataFromArticle` */
// TODO add title, written date, edited date to frontmatter
export type ArticleData = {
  html: string,
  frontmatter: Frontmatter,
  headings: Array<{
    depth: number;
    text: string;
  }>
}

/** Returns array of all filenames (without the '.md' extension) from articles folder */
export const getAllArticleFilenames = () => {
  const directory = path.join(process.cwd(), "articles");
  const filenames = fs.readdirSync(directory).map(filename => filename.replace(/\.md$/, ""));
  return filenames;
};

/**
 * Returns the string from `filename` under the articles folder.
 * `filename` should not include the '.md' extension.
 */
const getTextFromArticleFile = (filename: string) => {
  const filepath = path.join(process.cwd(), "articles", filename + ".md");
  return fs.readFileSync(filepath, "utf8");
};

/**
 * Parses an article `filename` in `/articles` folder and returns the html string,
 * headings, and frontmatter. `filename` should not include the '.md' extension.
 */
export const getDataFromArticleFile = (filename: string) : ArticleData => {
  const markdown = getTextFromArticleFile(filename);
  const { frontmatter, content } = getFrontmatterFromMarkdown(markdown);

  const mdast = getMdastFromMarkdown(content);
  const hast = getHastFromMdast(mdast, {
    footnoteLabel: "References"
  });
  
  if (hast === null || hast === undefined) throw new Error(`Invalid or empty markdown file: ${filename}.md`);

  // Add `id` property to `h1` and `h2` nodes.
  visit(hast, (node) => {
    if (node.type === "element" && (node.tagName === "h1" || node.tagName === "h2")) {
      node.properties = {
        ...node.properties,
        id: (
          node.children &&
          node.children.length > 0 &&
          node.children[0].type === "text"
        ) ? node.children[0].value : undefined
      };
    }
  });

  const html = (hast !== null && hast !== undefined) ? getHtmlFromHast(hast) : "";

  const headings = getHeadingsFromMdast(mdast);

  return {
    html,
    frontmatter,
    headings,
  };
};
