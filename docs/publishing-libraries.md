# Publishing libraries

## Testing publishing locally

As we will publish more and more libraries we need safe space to experiment with it.
Easiest way to test publishing is to use package `verdaccio`.
Install it globally `npm i -g verdaccio`.

Then to start a server run `verdaccio --config ./verdaccio.yaml`. It will start repository similar to npmjs.org or artifactory under `http://localhost:4873/` url.

We have repository set. Next step is to build and publish library.

For that we have handy script. Run `yarn publish-packages --new-version <new-packages-version>`.
The script will build all libraries and publish them to verdaccio.

- Point npm client to verdaccio instance `npm set @vst:registry http://localhost:4873/` (all packages starting with @vst/ will be using our local repository)
- Install the libraries with `yarn add` (eg. `yarn add @vst/cli`)
