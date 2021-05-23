# Viasat PWA framework

## What's in the repository?

This repository contains Nx [https://nx.dev](https://nx.dev) workspace with few libraries and test application.

During hackathon you will mostly use `apps/speedtest-app` directory, where we prepared simple app where you can test you speedtest implementation. In the workspace we also prepared React library for the speedtest `libs/speedtest`. That's the place where you should prepare component to be used in the speedtest application.

Additionally in this repository we included Node implementation of speedtest in `speedtest` directory. This application comes from repository [https://github.com/librespeed/speedtest](https://github.com/librespeed/speedtest). On this github page you will find more information on how to prepare environment for running the speedtest backend.

If you want to run it locally it's quite simple:

- install dependencies of speedtest (run `yarn` in `speedtest` directory) - requires yarn installed (version 1 - https://classic.yarnpkg.com/lang/en/)
- start the application with `node src/SpeedTest.js`

Workspace is named `vst` (declared in `nx.json`). That means that any library we develop here is available under `@vst/<name-of-the-lib>` package.

## How to get started?

- install dependencies (run `yarn`) - requires yarn installed (version 1 - https://classic.yarnpkg.com/lang/en/)
- start the application: `yarn nx serve speedtest-app`
- open `localhost:4200` to see the page with instructions

## Commands

Nx unifies commands in repository. For every application/library use the same commands.

Start (only for apps): `nx serve <name-of-app>`

Unit tests: `nx test <name-of-app/lib>`

E2E tests: `nx e2e <name-of-app/lib>-e2e [--watch]`

**I recommend installing `Nx console` extension to VS Code for running the tasks above.**
