# Deploy Process

See https://create-react-app.dev/docs/deployment/#github-pages

Create pr from feature branch to main. When deploy is decided, on local machine in most up to date main branch, run `npm run deploy`. This will both create a production build and commit and push it to the gh-pages branch. When deploy is successful, run `npm version [major|minor|patch]`. This will create a local commit with the package.json version incremented, and create a tag at the commit. Push the commit to main and the tag. To push the tag, run `git push origin <tag_name>`.

If something went wrong, you can revert the local branch to a previous commit
and delete tags. To revert to a commit, run
`git reset --hard <commit_hash>`
To delete a tag, run
`git delete -d <tag_name>`

# Environment Setup

Windows:
Edition	Windows 10 Home
Version	21H2
OS build 19044.1826 (July 12 2022)

Git for Windows:
https://gitforwindows.org/
Version 2.37.1 (July 12 2022)
- Download and run setup .exe

VSCode:
https://code.visualstudio.com/
Windows 64 bit Version 1.69.2 User Installer (June 2022)
- Download and run setup .exe

Node:
version 16.16.0 (Jan 10 2022)
npm version 8.1.2
npm cli documentation and windows app development documentation recommends installing node version manager.
This allows easily switching between npm and node versions.
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#windows-node-version-managers
https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-nvm-windows-nodejs-and-npm

nvm-windows:
https://github.com/git-for-windows/git/releases
Version 1.1.7 (Aug 01 2018)
- Download nvm-setup.zip. Open zip file, then run nvm-setup.exe
- Only has system installer. 1.1.9 has problems with uac. To only for user, change install directory
  to local/Programs/ and make sure nvm path variables are for current user by adding NVM_HOME and NVM_SYMLINK to current user
  environment variables, adding %NVM_HOME% and %NVM_SYMLINK% to PATH, then removing them from main user environment variables.
  Running nvm ls should show 'No installations recognized'.
- `nvm list available` shows node versions
  `nvm install <version>` installs specific node version
  `nvm uninstall <version>` uninstalls specific node version
  `nvm ls` shows all installed node versions
  `nvm use <version>` to switch node and npm versions
  `npm -v` and `node -v` checks the current npm and node version

## Initializing App

To init project, run `npx create-react-app <app_name>`. This will run the latest version of create-react-app,
which may be different than the version I've used. After running, a folder called `<app_name>` should be
created and the folder structure should look like `https://create-react-app.dev/docs/folder-structure`.
The `package.json` should look something like, with possibly different versions:

<details>
  <summary>package.json</summary>
  
  ```
  {
    "name": "test-app",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
      "@testing-library/jest-dom": "^5.16.5",
      "@testing-library/react": "^13.3.0",
      "@testing-library/user-event": "^13.5.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "4.0.3",
      "web-vitals": "^2.1.4"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    "eslintConfig": {
      "extends": [
        "react-app",
        "react-app/jest"
      ]
    },
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    }
  }
  ```
</details>

The packages I've added are:
```
"dependencies": {
    "@tensorflow/tfjs": "^3.8.0",
    "bitset": "^5.1.1",
    "buffer": "^6.0.3",
    "gh-pages": "^3.2.3",
    "probability-distributions": "^0.9.1",
    "react-icons": "^4.2.0",
    "sass": "^1.32.8",
  },
```

React-app-rewired is used to change webpack configuration. Currently, react-scripts uses webpack v5, which
doesn't auto polyfill node core modules by default. The `crypto` core module is needed for package
`probability-distributions`. `crypto-browsify` package is added to polyfill, and `crypto-streamify` is
added because `stream` is needed for `crypto-browsify`. `buffer` is needed for `gray-matter` package.

See https://github.com/facebook/create-react-app/issues/11756#issuecomment-1241853345
for how to configure react-app-rewired.

## TypeScript

To add typescript, `npm install --save-dev typescript @types/node @types/react @types/react-dom @types/jest`
Renaming a required source file to from `.js` to `.tsx` and `npm start` again should create a tsconfig.json
file at the top level. VSCode should automatically check for type errors in real-time in typescript files.

## ESLint

To add eslint, install eslint plugin for vscode (author Microsoft). This will show eslint errors in real-time.

OLD:
- Project initialized with create-react-app (react-scripts)
- Linter config in package.json, TypeScript linter setup with https://typescript-eslint.io/docs/linting/
  (Don't install any extra packages, just add the configuration to esLint)
- Setting up vscode eslint with typescript https://thesoreon.com/blog/how-to-set-up-eslint-with-typescript-in-vs-code
- fixing eslint `npm i --save-dev eslint-config-react-app`
- Absolute path in tsconfig.json, and allow typescript implicit any, with
  "compilerOptions": {
    "baseUrl": "src",
    "noImplicitAny": false
  },
- vscode settings.json (Add to workspace settings and commit to git):
  {
    "terminal.integrated.shell.windows": "C:\\Windows\\System32\\cmd.exe",
    "eslint.format.enable": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": [
        "javascript",
        "typescript",
        "typescriptreact"
    ],
    "git.autofetch": true,
    "diffEditor.ignoreTrimWhitespace": false,
    "editor.tabSize": 2,
    "extensions.ignoreRecommendations": true,
    "eslint.alwaysShowStatus": true
  }
  
# Development Practices

## Testing

For unit testing classes, later tests may depend on earlier tests. This is to test class has mutated
data properly since many methods have important side effects.

## Web Styles and Formatting

In SCSS, prefer mixins over placeholder classes (@include over @extend). Don't use column sizing classes
like those from bootstrap (ex. `col-1`, `col-8`, etc.), just use flexbox with margins, max-height,
and/or max-width.

Pages should be components responsible for layout of entire page. Individual components should not
have margins applied; margins are the responsibility of components using the invdividual components.

Use the correct semantic elements. Use `<h1>`, `<h2>`, etc. for heading text, `<p>` for body text,
`<button>` for button, `<img>` for images, `<a>` for links, `<nav>` for navigation sidebar or
navigation header bar, and `<ul>` and `<li>` for lists and navigation list items.

## Font

Font is defined with the css @font-face syntax (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).
A font file is downloaded from a source then added to the assets folder. The font is used by providing the
font name to `font-family` css property. See also adding font to CRA https://stackoverflow.com/a/41678350.

## Styles

React allows developer to choose the method of styling components; it does not impose a specific method.
Components can be styled with pure css, or any additional tools available for frontend styling, such as
preprocessors, modules, and css in js. Since the create react app docs have articles for these, Scss and
Css modules are used. 

More research is needed for ways of overriding styles in child components. In particular, how precedence
is determined.

Comparison of styling options https://blog.devgenius.io/best-ways-to-style-a-react-js-application-c818b71f6341
Css module discussion on overriding styles https://github.com/css-modules/css-modules/issues/147

# Button

Represents the `<button>` or `<a>` element. Comes in three appearances: filled, outline, or text.
Hover is added opacity to the background. Pressed is added more opacity to the background. Focus is
an extra outline around the button. The button should not change size when hovered, pressed, or focused.

## Dropdown Button

While using native elments is preferred, the native element for a dropdown, `<select>`, is hard
to style. A common practice is to create custom dropdown menu with non-sementic elements and add the
correct aria semantics. This is done with apple.com shopping cart, google.com apps button, mui react
select, and lolesports pickems.

The general structure of a custom select is a button that, when pressed, displays an unordered list of
options. Use `button` role for button, and add the aria semantics `aria-haspopup="listbox"` or
`aria-haspop="true"`, `aria-controls="id-of-container"`, and the correct `aria-expanded` state.
Add `listbox` role to unordered list and `option` to list items. Add the correct `aria-selected`
state to list items.

Implement roving tab index for selecting options.

`<select>` is hard to style https://stackoverflow.com/a/64643952
Mui react select https://mui.com/material-ui/react-select/#basic-select
Apple dropdown menu (top right shopping bag icon) https://www.apple.com/
Roving tab index https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets

## Article

Articles are written in markdown and stored in assets/articles folder. 

Raw markdown file contents are imported using webpack. This is done by modifying webpack config to treat `.md` files as text (https://webpack.js.org/guides/asset-modules/#source-assets). Modifying the config is done by `react-app-rewired` package. A typescript declaration file is added to `assets/articles` to treat `.md` file content as string, otherwise importing `.md` files would throw typescript errors (https://webpack.js.org/guides/typescript/#importing-other-assets).

Articles include YAML front matter. Front matter is extracted from a markdown string using `gray-matter` package. Frontmatter includes `summaryCharLength` and `actions`. `actions` are rendered into buttons at the bottom of the article that navigates to a link. `summaryCharLength` is the character length of the markdown content that should be shown for the collapsed article. If it's not provided, the full article is shown. Character length can be found with https://coding.tools/character-count (character with spaces).

For reference, MDN Docs stores content as github-flavored markdown and parses it using the unified ecosystem, along with other tools, in their Yari build tool. See https://github.com/mdn/yari/blob/313edfb8952f37bfe560745457a5389fdf7206bb/markdown/m2h/index.ts for their markdown to html implementation, specifically the `m2h` function. See https://github.com/mdn/yari/blob/313edfb8952f37bfe560745457a5389fdf7206bb/build/spas.ts#L183 for their use of `m2h`, specifically in the `buildStaticPages` function.

# Design Best Practices In-Progress Thoughts

## Flexbox vs Grid

Flexbox is 1d layout, css grid is 2d. They can be used together. Grid is faster for entire page layouts.

- Mui React uses flex, no grid
- Material Design uses flex, no grid
- MD3 mixes flex and grid
- Mdn Docs uses flex and grid
- Yale does not use flex or grid

Decision: Try out only flexbox first. Use only on elements that need it.

## Typography

Basics of font design that's needed includes headers (<h1>, <h2>, ...) and body text (<p>).
Additional styles may be specified for button text and list item text. Variables for font properties
should be defined, and default styles should be provided for the elements. Custom styles should be used
for any changes beyond the default in font size, weight, line height, letter spacing, and text transform.

- Mui React uses same font for everything. Sizes are defined in rem. Font styles are all custom.
- Material uses same font for everything. Sizes are defined in rem. Font variables are defined
  for h1-h6, subtitle 1 and 2, body 1 and 2, button, caption, and overline.
- MD3 uses different sans serif font for title and body text. Sizes are defined in px. Font
  variables are defined for display, headline, title, body, and label, and with lg, md, and sm
  size suffixes for each.
- Mdn Docs uses same font for everything. Sizes are defined in rem. Font variables are defined for
  headings, body, buttons, and others.
- Yale uses a serif font for title and headings, a sans-serif font for everything else.
  Sizes are defined in em and rem. Font styles are all custom.

Decision: Use same font for everything. Define default font properties for header, body, and
  button text. Use rem units. Use custom styles for one off situations.

See https://material.io/design/typography/the-type-system.html

## Color

Based on Material Design 3. Have five key colors: primary, secondary, tertiary, neutral, and
neutral variant, along with tones for each. Tones adjust brightness of color, 100 is always white,
0 is black. Have also error color, and possibly product specific colors. 

Primary key color is used for key components, such as fab, prominent buttons, active states, tint of
elevated surfaces.

Secondary key color is used for less prominent components in ui, such as filter chips.

Tertiary key color is used to balance primary and secondary colors, used at own discretion.

Neutral key color is used for surface and background, high emphasis text and icons.
Neutral variant key color is used for medium emphasis text and icons, surfaces, and
component outlines.

Have accent colors for each key color to be applied on ui elements. For primary, these are:
- primary base color
- on primary applied to elements sitting on primary
- primary container applied to elements needing less emphasize than primary
- on prmary container applied to elements sitting on top of primary container
For light scheme, the default tones are primary40, primary100, primary90, and primary10.

For neutral colors, these are:
- background, on background
- surface, on surface
- surface variant, on surface variant
- outline, outline variant

Decision: Use blue as primary color, pink as secondary. Have variants. Have on surface colors.
  Use white as neutral, black as on neutral.

See
- https://m3.material.io/styles/color/the-color-system/key-colors-tones
- https://material.io/design/material-theming/implementing-your-theme.html#color
- https://hslpicker.com/ hsl color picker
- https://material.io/blog/science-of-color-design MD3 HCT color system
- https://m3.material.io/theme-builder#/custom Material Design theme creator

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

Decision: Use breakpoint from phone landscape to tablet for responsive layout and sizing. Use breakpoint
  other breakpoints to optionally further adjust text, margin, and padding sizing, but
  not layout. Avoid excessive responsive margins by using other properties like max-width instead.

## Accessibility

Websites should be accessible by default. Use the correct semantic element, like <button> for buttons,
<a> for links, <nav> for a group of navigation links (like app bar, side bar), <img> for images, <h1>
for main heading text, <p> or body text, etc. By default, html elements are accessible and provide
accessibility role and labels.

To provide custom styling of interactable elements, use :hover, :active, and :focus-visible css pseudoclasses.
For mouse and keyboard, :hover is used when element is hovered by mouse. :active is used when element
is activated (mouse down pressed). :focus-visible is used when element is selected to receive input and
browser determines a visible indicator is necessary (tab focused, :focus would be for mouse tap also).

See
- https://developer.mozilla.org/en-US/docs/Web/Accessibility Mdn accessibility practices

## Reference

Mui React https://mui.com/material-ui/getting-started/overview/
Material Design https://material.io/design/introduction
MD3 (Material Design 3) https://m3.material.io/get-started
Mdn Docs https://developer.mozilla.org/en-US/docs/Web
Yale Web Accessibility https://usability.yale.edu/web-accessibility/articles
Robin Wieruch personal site https://www.robinwieruch.de/
Kent Dodds personal site https://kentcdodds.com/about

# TODO Further Site Work
- Add connectFour github technical README, add github link to connect four journey article card
- Add separate blog page. Use this also for longer articles of journey page:
  - Remove summary frontmatter
  - Remove summary char length from markdownUtils.js
  - Change 'more' button on article card to link to full article. Remove expanding ability of card.
