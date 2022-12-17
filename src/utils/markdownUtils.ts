import { createElement, Fragment } from "react";
import type { ReactNode } from "react";
import matter from "gray-matter";
import type { Heading as AstHeading } from "mdast"; // TODO deprecated warning in npm install, mdast was renamed to remark
import { Node, visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { toHast } from "mdast-util-to-hast";
import { toH } from "hast-to-hyperscript";

/** Object that is extracted from the `.md` fontmatter */
export type Action = {
  label: string;
  url: string;
};

/** Object that is extracted from the frontmatter of an article markdown file */
export type Frontmatter = {
  summaryCharLength?: number;
  actions?: Array<Action>;
};

/** Object returned from `getElementFromArticle` */
export type ArticleElement = {
  element: ReactNode,
  summaryElement: ReactNode,
  frontmatter: Frontmatter,
  headings: Array<string>
}

/** Returns an array of all heading text from mdast tree, in order from top to bottom. */
const getHeadingsFromMdast = (root: Node) => {
  const headingList: Array<{ depth: number, text: string }> = [];

  visit(root, "heading", (node: AstHeading) => {
    headingList.push({
      depth: node.depth,
      text: toString(node, { includeImageAlt: false })
    });
  });

  return headingList;
};

/**
 * Returns the yaml frontmatter and the content from `markdown`.
 */
export const getFrontmatterFromMarkdown = (markdown: string) => {
  const extracted = matter(markdown);
  return {
    frontmatter: extracted.data,
    content: extracted.content
  };
};

/**
 * Returns a react element parsed from the provided `markdown`, as well as the
 * intermediate mdast and hast trees. Optionally pass custom components to render.
 * 
 * Ex. 
 * ```
 * const element = getElementFromMarkdown('...', {
 *   components: {
 *     h1: (props) => (
 *       <h1 {...props}>
 *         Heading: {props.children}
 *       </h1>
 *     )
 *   }
 * })
 * ```
 */
export const getElementFromMarkdown = (
  markdown: string,
  options?: {
    // Type of react component (not element) seems convoluted.
    // See https://github.com/mui/material-ui/blob/ab9ef050f39043a6d5140a97406ce1ddffb92b2f/packages/mui-material/src/Autocomplete/Autocomplete.d.ts#L158
    // for possible typing.
    /** Replaces default components with custom ones. */
    components?: Record<string, any>
  }
) => {
  const mdast = fromMarkdown(markdown, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  });
  const hast = toHast(mdast, {
    footnoteLabel: "References"
  });

  if (hast === null || hast === undefined) throw new Error(`Invalid or empty markdown string: ${markdown}`);

  const element: ReactNode = toH((name: string, props: Record<string, string>, children: Array<any> | undefined) => {
    let component = name;

    if (options?.components && Object.prototype.hasOwnProperty.call(options?.components, name)) {
      component = options?.components[name];
    } else if (name === "div") {
      // Replace top level div (root element) with React.Fragment
      return createElement(Fragment, props, children);
    }

    return createElement(component, props, children);
    // @ts-expect-error unsure what the problem is. Seems like both types match to `import('hast').Root`.
  }, hast);

  return {
    element,
    mdast,
    hast
  };
};

/**
 * Parses an article markdown string with frontmatter and returns
 * a react element.
 */
export const getElementFromArticle = (markdown: string) => {
  const extracted = getFrontmatterFromMarkdown(markdown);
  const frontmatter = extracted.frontmatter as Frontmatter;

  // Adjust summary char length to take into account newline characters, '\r' and '\n'.
  let summaryCharLength = frontmatter.summaryCharLength;

  if (summaryCharLength !== undefined && summaryCharLength > 0) {
    const regex = /\r\n|\n|\r/g;
    let match: RegExpExecArray | null;
        
    while ((match = regex.exec(extracted.content)) != null) {
      if (match.index <= summaryCharLength) summaryCharLength += match[0].length-1;
      else break;
    }
  }

  // Add `id` property to h1 and h2
  const customComponentMap = {
    h1: (props) => (
      createElement(
        "h1",
        {
          ...props,
          id: props.children && props.children.length > 0 ? props.children[0] : undefined
        },
        props.children
      )
    ),
    h2: (props) => {
      return createElement(
        "h2",
        {
          ...props,
          id: props.children && props.children.length > 0 ? props.children[0] : undefined
        },
      );
    }
  };

  const element = getElementFromMarkdown(extracted.content, {
    components: customComponentMap
  });

  let summaryElement: ReactNode | undefined = undefined;
  if (summaryCharLength !== undefined && summaryCharLength > 0) {
    summaryElement = getElementFromMarkdown(
      extracted.content.slice(0, summaryCharLength),
      {
        components: customComponentMap
      }
    ).element;
  }

  const headings = getHeadingsFromMdast(element.mdast);

  return {
    element: element.element,
    summaryElement,
    frontmatter: {
      ...frontmatter,
      summaryCharLength
    },
    headings
  };
};

// Taken from https://stackoverflow.com/a/27078401/20362635.
// Switch to lodash throttle if more options are needed.
/**
 * Returns a function, that, when invoked, will only be triggered at most once
 * during a given window of time. Normally, the throttled function will run
 * as much as it can, without ever going more than once per `wait` duration;
 * but if you'd like to disable the execution on the leading edge, pass
 * `{leading: false}`. To disable execution on the trailing edge, ditto.
 */ 
export const throttle = (
  func: () => void,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
) => {
  let context, args, result;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  const later = function() {
    previous = options?.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function() {
    const now = Date.now();
    if (!previous && options?.leading === false) previous = now;
    const remaining = wait - (now - previous);
    // @ts-expect-error
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options?.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};