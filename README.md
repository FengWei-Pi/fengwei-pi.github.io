# FengWei Pi

This repository houses [my personal website](https://fengwei-pi.github.io/), built with [Next.js](https://nextjs.org/) and hosted with [Vercel](https://vercel.com). The rest of the document details the deploy process and project setup.

See also the [docs](./docs.md) for some of the current development practices and thoughts.

# Contents
1. [Deployment](#deployment)
2. [Development Environment](#development-environment)
3. [Environment Setup](#environment-setup)
5. [Project Setup](#project-setup)

# Deployment

Project aims to follow the [trunk based development](https://trunkbaseddevelopment.com/) as much as possible. Deployment is done with [Vercel](https://vercel.com/home).

To develop a feature, create a short-lived branch with the name corresponding to a Jira ticket. Once development on the branch is finished, create a pull request to main. Vercel bot will create a [preview deployment](https://vercel.com/docs/concepts/deployments/preview-deployments) with an url that can be reviewed. Once merged, Vercel will automatically create a production deployment.

# Development Environment

**Windows** - Windows 10  
**Git for Windows** - Version 2.37.1  
**VSCode** - Windows 64 bit  
**Node.js** - Version 16.16.0 | **npm** - Version 8.1.2  
**nvm-windows** - Version 1.1.7

# Environment Setup

## Git for Windows
Git for Windows allows git commands to be used on Windows. Go to https://gitforwindows.org/, download and run the setup executable file.

## VSCode
VSCode is a popular IDE, especially for javascript development. Go to https://code.visualstudio.com/, download and run the setup executable file.

##  Node.js and Npm
Npm is a javascript package manager that allows easy sharing of code libraries. Node.js allows running javascript code outside the browser and is required by npm.

[npm cli documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#windows-node-version-managers) and [windows app development documentation](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-nvm-windows-nodejs-and-npm) recommends installing node version manager. This allows easily switching between npm and node versions for upgrading versions and debugging purposes. See nvm-windows setup below.

##  nvm-windows
Go to https://github.com/git-for-windows/git/releases, download `nvm-setup.zip`. Open zip file, then run `nvm-setup.exe`.  

This installs nvm-windows system wide. To manually install only for a specific user, change install directory to `local/Programs/` and update nvm path variables by adding NVM_HOME and NVM_SYMLINK to current user's environment variables, adding %NVM_HOME% and %NVM_SYMLINK% to PATH, then removing them from any other user's environment variables.

Running `nvm ls` in console should show 'No installations recognized'. Some common commands are:
- `nvm list available` shows node versions
- `nvm install <version>` installs specific node version
- `nvm uninstall <version>` uninstalls specific node version
- `nvm ls` shows all installed node versions
- `nvm use <version>` to switch node and npm versions
- `npm -v` and `node -v` checks the current npm and node version

# Project Setup

The project was initialized by [Create React App](https://create-react-app.dev/), but converted into a [Next.js](https://nextjs.org) project by refactoring files and updating packages. Next.js is a React framework that provides routing, static and dynamic rendering, and more.

See https://nextjs.org/docs/getting-started for the setup documentation and https://nextjs.org/learn/foundations/about-nextjs for beginner friendly tutorials about web development, Next.js, and creating a Next.js app.

## TypeScript

Typescript adds static type checking to javascript, assigning types to variables like number, string, etc. rather than any type.

Typescript was added when this was still a create react app by running `npm install --save-dev typescript @types/node @types/react @types/react-dom @types/jest`. A required source file was renamed from `.js` to `.ts` and the development server was started, which created a tsconfig.json file at the top level. With typescript installed, VSCode automatically checks for type errors in real-time in typescript files.

See https://create-react-app.dev/docs/adding-typescript/ for adding typescript to create react app. To install typescript for a Next.js app, see this tutorial https://nextjs.org/learn/excel/typescript/setup, and this documentation https://nextjs.org/docs/basic-features/typescript.

## ESLint

Eslint is a tool for static checking javascript code for common problems.

Eslint was added by running `npm i --save-dev eslint`, creating the `.eslintrc.json` file, and installing the vscode eslint plugin (authored by Microsoft). This adds eslint as a dev dependency, creates a configuration for it, and adds real-time eslint error checking. The configuration file `.eslintrc.json` was set up by running `npm i --save-dev eslint-config-next eslint-plugin-jsx-a11y` and extending from them. This adds the recommended nextjs eslint configuration as well as eslint rules for accessibility. The rest of the rules are added by developer preference.

The current vscode user settings automatically fixes linter errors when a file is saved. They are provided in the git committed `.vscode/settings.json` file.

See https://nextjs.org/docs/basic-features/eslint for setting up eslint with nextjs.
