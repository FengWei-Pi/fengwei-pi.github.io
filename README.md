This repository houses [my personal website](https://fengwei-pi.github.io/), built with React and hosted with Github Pages. The rest of the document details the development setup and deploy process.

See also the [docs](./docs.md) for some of the current development practices and thoughts.

# Contents
1. [Deployment](#deployment)
2. [Development Environment](#development-environment)
3. [Environment Setup](#environment-setup)
5. [Project Setup](#project-setup)

# Deployment
When deploy is decided, on local machine in most up to date main branch, run `npm run deploy`. This will both create a production build, commit it to gh-pages branch, and push it to origin.

Github will then take some minutes to update the site. To check progress, go to gh-pages branch and view the actions.

When deploy is successful, run `npm version [major|minor|patch]`, for example `npm version 1.2.2`. This will create a local commit with the package.json version incremented, and create a tag called `v1.2.2` at the commit. Push the commit to main and the tag. To push the tag, run `git push origin <tag_name>`.

If something went wrong, the local branch can be reverted to a previous commit and tags can be deleted. To revert to a commit, run `git reset --hard <commit_hash>`. To delete a tag, run `git delete -d <tag_name>`.

See https://create-react-app.dev/docs/deployment/#github-pages for deploying with github pages.

# Development Environment

Includes more details than necessary in case they are needed.

**Windows** - Edition	Windows 10 Home, Version 21H2, OS build 19044.1826 (July 12 2022)  
**Git for Windows** - Version 2.37.1 (July 12 2022)  
**VSCode** - Windows 64 bit Version 1.69.2 User Installer (June 2022)  
**Node.js** - Version 16.16.0 (Jan 10 2022) | **npm** - Version 8.1.2  
**nvm-windows** - Version 1.1.7 (Aug 01 2018)

# Environment Setup

## Git for Windows
Go to https://gitforwindows.org/, download and run the setup executable file

## VSCode
Go to https://code.visualstudio.com/, download and run the setup executable file

##  Node.js
[npm cli documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#windows-node-version-managers) and [windows app development documentation](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-nvm-windows-nodejs-and-npm) recommends installing node version manager. This allows easily switching between npm and node versions. See nvm-windows setup below.

##  nvm-windows
Go to https://github.com/git-for-windows/git/releases, download nvm-setup.zip. Open zip file, then run `nvm-setup.exe`.  
This installs nvm-windows system wide. To manually install only for a specific user, change install directory to `local/Programs/` and update nvm path variables by adding NVM_HOME and NVM_SYMLINK to current user's environment variables, adding %NVM_HOME% and %NVM_SYMLINK% to PATH, then removing them from any other user's environment variables.  
Running `nvm ls` in console should show 'No installations recognized'. Some common commands are:
- `nvm list available` shows node versions
- `nvm install <version>` installs specific node version
- `nvm uninstall <version>` uninstalls specific node version
- `nvm ls` shows all installed node versions
- `nvm use <version>` to switch node and npm versions
- `npm -v` and `node -v` checks the current npm and node version

# Project Setup

The project was initialized by running `npx create-react-app <app_name>`, which will run the lastest version of [Create React App](https://create-react-app.dev/), which may be different than the version used for initializing this project (`react-scripts` v5.0.1 package). After running, a folder called `<app_name>` is created and the folder structure should look like https://create-react-app.dev/docs/folder-structure. Also, the `package.json` should look something like

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

With possibly different versions. Differences between this and the current repo's `package.json` were intentionally made.

## Changing Webpack Configuration

`react-app-rewired` package is used to change webpack configuration. Currently, react-scripts uses webpack v5, which doesn't auto polyfill node core modules by default. The `crypto` core module is needed for package `probability-distributions`, and `buffer` is needed for `gray-matter` package. The rest of the provided polyfills are required by crypto and buffer to work.

See `config-overrides.js` for overriden webpack configuration.

See https://github.com/facebook/create-react-app/issues/11756#issuecomment-1241853345
for how to configure react-app-rewired.

## TypeScript

Typescript was added by running `npm install --save-dev typescript @types/node @types/react @types/react-dom @types/jest`. Renaming a required source file from `.js` to `.tsx` and `npm start` again created a tsconfig.json file at the top level. With this, VSCode automatically checks for type errors in real-time in typescript files.

See https://create-react-app.dev/docs/adding-typescript/ for adding typescript to create react app.

## ESLint

To add eslint, install eslint plugin for vscode (author Microsoft). This will show eslint errors in real-time.

The eslint configuration is set in `package.json`, in the `eslintConfig` section.

The current vscode user settings automatically fixes linter errors when a file is saved. They are provided in the git committed `.vscode/settings.json` file.

See https://create-react-app.dev/docs/setting-up-your-editor for changing eslint configuration in create-react-app.


