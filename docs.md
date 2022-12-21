This file records current development and design practices and thoughts. The document can be constantly changed in response to discussions, research, etc.

# Contents
1. [Development](#development)
    1. [Testing](#testing)
    2. [Web Styles and Formatting](#styles)
    3. [Font](#font)
    4. [Buttons](#buttons)
    5. [Articles](#articles)
2. [Design](#design)
    1. [Flexbox vs Grid](#flexbox-vs-grid)
    2. [Typography](#typography)
    3. [Color](#color)
    4. [Responsiveness](#responsiveness)
    5. [Accessibility](#accessibility)

# Development

## Testing

For unit testing classes, later tests may depend on earlier tests. This is to test class has mutated data properly since many methods have important side effects.

## Styles

In SCSS, prefer mixins over placeholder classes (`@include` over `@extend`). Don't use column sizing classes like those from bootstrap (ex. `col-1`, `col-8`, etc.), just use flexbox with margins, max-height, and/or max-width.

Use the correct semantic elements. Use `<h1>`, `<h2>`, etc. for heading text, `<p>` for body text, `<button>` for button, `<img>` for images, `<a>` for links, `<nav>` for navigation sidebar or navigation header bar, and `<ul>` and `<li>` for lists and navigation list items.

Pages should be components responsible for layout of entire page. Individual components should not have margins applied; margins are the responsibility of components using the invdividual components.

React allows developer to choose the method of styling components; it does not impose a specific method. Components can be styled with pure css, or any additional tools available for frontend styling, such as preprocessors, modules, and css in js. Since the create react app has documentation for these, SCSS and CSS modules are used. 

More research is needed for ways of overriding styles in child components. In particular, how precedence
is determined.

See https://blog.devgenius.io/best-ways-to-style-a-react-js-application-c818b71f6341 for comparison of styling options.  
See https://github.com/css-modules/css-modules/issues/147 for CSS module discussion on overriding styles.

## Font

Font is defined with the css @font-face syntax (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face). A font file is downloaded from a source then added to the assets folder. The font is used by providing the font name to `font-family` css property. See also adding font to CRA https://stackoverflow.com/a/41678350.

## Buttons

Represents the `<button>` or `<a>` element. Comes in three appearances: filled, outline, or text. Hover is added opacity to the background. Pressed is added more opacity to the background. Focus is an extra outline around the button. The button should not change size when hovered, pressed, or focused.

### Dropdown Button

While using native elments is preferred, the native element for a dropdown, `<select>`, is hard to style. A common practice is to create custom dropdown menu with non-sementic elements and add the correct aria semantics. This is done with apple.com shopping cart, google.com apps button, and mui react select.

The general structure of a custom select is a button that, when pressed, displays an unordered list of options. Use `button` role for button, and add the aria semantics `aria-haspopup="listbox"` or `aria-haspop="true"`, `aria-controls="id-of-container"`, and the correct `aria-expanded` state. Add `listbox` role to unordered list and `option` to list items. Add the correct `aria-selected` state to list items.

Implement roving tab index for selecting options.

See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/  select#styling_with_css for information about `<select>` being hard to style.  
See https://mui.com/material-ui/react-select/#basic-select for Mui react select.  
See https://www.apple.com/ for Apple dropdown menu (top right shopping bag icon).  
See https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets for implementing roving tab index.

## Articles

Articles are written in markdown and stored in `assets/articles` folder. 

Raw markdown file contents are imported using webpack. This is done by modifying webpack config to treat `.md` files as text (https://webpack.js.org/guides/asset-modules/#source-assets). Modifying the config is done by `react-app-rewired` package. A typescript declaration file is added to `assets/articles` to treat `.md` file content as string, otherwise importing `.md` files would throw typescript errors (https://webpack.js.org/guides/typescript/#importing-other-assets).

Articles include YAML front matter. Front matter is extracted from a markdown string using `gray-matter` package. Frontmatter includes `actions`. `actions` are rendered into buttons at the bottom of the article that navigates to a link.

For reference, MDN Docs stores content as github-flavored markdown and parses it using the unified ecosystem, along with other tools, in their Yari build tool.   
See https://github.com/mdn/yari/blob/313edfb8952f37bfe560745457a5389fdf7206bb/markdown/m2h/index.ts for their markdown to html implementation, specifically the `m2h` function.  
See https://github.com/mdn/yari/blob/313edfb8952f37bfe560745457a5389fdf7206bb/build/spas.ts#L183 for their use of `m2h`, specifically in the `buildStaticPages` function.

# Design

Some of the site being referenced are
- Mui React https://mui.com/material-ui/getting-started/overview/
- Material Design https://material.io/design/introduction
- MD3 (Material Design 3) https://m3.material.io/get-started
- MDN Docs https://developer.mozilla.org/en-US/docs/Web
- Yale Web Accessibility https://usability.yale.edu/web-accessibility/articles

As well, some other person websites are
- Robin Wieruch personal site https://www.robinwieruch.de/
- Kent Dodds personal site https://kentcdodds.com/about

## Flexbox vs Grid

Flexbox is 1d layout, css grid is 2d. They can be used together. Grid is faster for entire page layouts.

- Mui React site uses flex, no grid
- Material Design site uses flex, no grid
- MD3 site mixes flex and grid
- Mdn Docs uses flex and grid
- Yale site does not use flex or grid

For now, flex is being used until a need for grid arises.

## Typography

Basics of font design that's needed includes headers (`<h1>`, `<h2>`, ...) and body text (`<p>`).
Additional styles may be specified for button text and list item text. Variables for font properties
should be defined, and default styles should be provided for the elements. Custom styles should be used
for any changes beyond the default in font size, weight, line height, letter spacing, and text transform.

- Mui React site uses same font for everything. Sizes are defined in rem. Font styles are all custom.
- Material site uses same font for everything. Sizes are defined in rem. Font variables are defined
  for h1-h6, subtitle 1 and 2, body 1 and 2, button, caption, and overline.
- MD3 site uses different sans serif font for title and body text. Sizes are defined in px. Font
  variables are defined for display, headline, title, body, and label, and with lg, md, and sm
  size suffixes for each.
- Mdn Docs uses same font for everything. Sizes are defined in rem. Font variables are defined for
  headings, body, buttons, and others.
- Yale site uses a serif font for title and headings, a sans-serif font for everything else.
  Sizes are defined in em and rem. Font styles are all custom.

For now, same font is used for everything. Default font properties are defined for header, body, and button text, rem units are used, and custom styles are used for one off situations.

See https://material.io/design/typography/the-type-system.html

## Color

See `scss/_colors.scss` file.

See also https://m3.material.io/styles/color/the-color-system/key-colors-tones for MD3 color system documentation.  
See https://m2.material.io/design/material-theming/implementing-your-theme.html#color Material deisgn color system documentation.  
See https://hslpicker.com/ for hsl color picker.  
See https://material.io/blog/science-of-color-design for MD3 HCT color system article.  
See https://m3.material.io/theme-builder#/custom for Material Design theme creator.

## Responsiveness

Use multi column layout for larger screens, single column for phone portrait. Use media queries
to define breakpoints for when layout switches. Use mobile first default.

- Mui React uses responsive multi column layout and app bar. Font styles are static.
  Some margins/paddings are responsive.
- Material uses responsive multi column layout and app bar. Fonts are responsive by default at
  phone portrait breakpoint. Sidebar nav font style is overriden to be static.
- MD3 uses responsive multi column layout and app bar. Fonts are responsive by default at
  two breakpoints, phone portrait and tablets. Sidebar nav component changes and font becomes
  bigger on smaller screens.
- Mdn Docs uses responsive multi column layout and app bar. Fonts are responsive by default at
  phone portrait breakpoint. Sidebar nav font style is overriden to be static. Some margins/paddings
  are responsive.
- Yale uses responsive multi column layout and app bar. Fonts are responsive by default at
  tablet breakpoint. Some margins/paddings are responsive.

For now, breakpoint is used from phone landscape to tablet for responsive layout and sizing. Other breakpoints are used to optionally further adjust text, margin, and padding sizing, but not layout. Avoid excessive responsive margins by using other properties like max-width instead.

## Accessibility

Websites should be accessible by default. Use the correct semantic element, like `<button>` for buttons, `<a>` for links, `<nav>` for a group of navigation links (like app bar, side bar), `<img>` for images, `<h1>` for main heading text, `<p>` or body text, etc. By default, html elements are accessible and provide
accessibility role and labels.

To provide custom styling of interactable elements, use :hover, :active, and :focus-visible css pseudoclasses. For mouse and keyboard, :hover is used when element is hovered by mouse. :active is used when element is activated (mouse down pressed). :focus-visible is used when element is selected to receive input and browser determines a visible indicator is necessary (tab focused, :focus would be for mouse tap also).

See https://developer.mozilla.org/en-US/docs/Web/Accessibility for accessibility practices.
