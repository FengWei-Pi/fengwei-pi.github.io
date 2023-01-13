import matter from "gray-matter";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
import type { MdastNode } from "mdast-util-to-hast/lib";
import type { Heading } from "mdast";

export {
  visit
};

/** Object that is extracted from the `.md` fontmatter */
export type Action = {
  label: string;
  url: string;
};

/** Object that is extracted from the frontmatter of an article markdown file */
export type Frontmatter = {
  actions?: Array<Action>;
};

/** Returns an array of all heading text from mdast tree, in order from top to bottom. */
export const getHeadingsFromMdast = (root: MdastNode) => {
  const headingList: Array<{ depth: number, text: string }> = [];

  visit(root, "heading", (node: Heading) => {
    headingList.push({
      depth: node.depth,
      text: toString(node, { includeImageAlt: false })
    });
  });

  return headingList;
};

/** Returns the yaml frontmatter and content from `markdownWithFrontmatter`. */
export const getFrontmatterFromMarkdown = (markdownWithFrontmatter: string) => {
  const extracted = matter(markdownWithFrontmatter);

  return {
    frontmatter: extracted.data as Frontmatter,
    content: extracted.content
  };
};

/**
 * Returns the mdast tree from a markdown string.
 * 
 * @see https://github.com/syntax-tree/mdast
 * @see https://github.com/syntax-tree/hast
 */
export const getMdastFromMarkdown = (markdown: string) => {
  return fromMarkdown(markdown, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  });
};

/**
 * Returns the hast tree from a mdast tree.
 * 
 * @see https://github.com/syntax-tree/mdast
 * @see https://github.com/syntax-tree/hast
 */
export const getHastFromMdast = toHast;

/**
 * Returns the HTMl string from a hast tree.
 * 
 * @see https://github.com/syntax-tree/hast
 */
export const getHtmlFromHast = toHtml;
