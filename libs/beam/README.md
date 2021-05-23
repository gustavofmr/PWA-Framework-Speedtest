# Beam library

Shared variables like colors and utility functions for beam styles framework.

## Features

This library exposes:

1. CSS custom properties and utility classes
2. Sass variables, utility functions and mixins
3. Js module with all variables grouped in sections (colors, spacings)

## Usage
### How to import

In your es6 file use either:

1. Complete build in css format: `style.css`.
2. Specific parts by importing sass files in your own .scss file or whole `@vst/beam/styles/style.scss` to it (to get access to all mixins, etc.).
3. Importing js variables that provides all variables used in project.
   `@vst/beam/styles/vars.module.js` for importing file in es6 and `@vst/beam/styles/vars.js` to get file

Without es6 modules enabled ecosystem (with most likely npm support) mentioned above you can use css directly in html file or `vars-js` file.

### 1.1 Import complete build in your component (any setup with webpack sass-loader):

```js
import '@vst/beam/styles.scss';

const ExampleComponent = () => (
  <div class="beam-bg--gray100">
    <span class="beam-c--gray900">Dark text in light background</span>
  </div>
);
```

### 1.2 Import complete build in simple html/css website:

1. Add inside `<head></head>` section

    ```html
    <link href="complete.css" rel="stylesheet" />
    ```

    And you will get access to all css variables and util classes.

2. Or use a js version in case of specific need (like changing behaviour of app based on breakpoints).

    ```html
    <script src="vars.js"></script>
    ```

    This will give you access to object with all beam framework values in single object at `window.Beam`;

#### 2. Import specific specific part in your own .scss file:

```scss
@use '@vst/beam/theme/dark';
@use '@vst/beam/theme/light';

@use '@vst/beam/utils/colors';

// Sets default to light theme
$colors: map-merge(colors.$common-colors, light.$theme-colors);
@include colors.gen-default-theme-colors($colors);

// Allow switching theme using class
.theme-dark {
  @include colors.gen-custom-props(dark.$theme-colors);
  @include colors.gen-colors-util-classes(dark.$theme-colors);
}

.theme-light {
  @include colors.gen-custom-props(light.$theme-colors);
  @include colors.gen-colors-util-classes(light.$theme-colors);
}
```

### Util classes

You can utilise color util classes like `.c-alert400` or `.bg-alert400` (after importing `@vst/beam/utils/colors.scss` or whole `@vst/beam/styles.scss`) and use css custom properties like `var(--c-alert400)`;

```css
.my-bem-secletor {
  color: var(--c-alert400);
}
```

### Sass capabilities

1. When you import this lib file in your own `./whole-app.scss` or `./specific-component.scss` you can import @vst/beam scss files and get an access to mixins etc. with: `import '@vst/beam/utils/colors.scss'`.
2. Change default prefixes:

```scss
@use '@vst/beam/theme/dark';
@use '@vst/beam/theme/light';

$your-custom-prefix: 'your-custom-prefix-instead-of-beam-';

@use '@vst/beam/utils/colors' with (
  $prefix: 'your-custom-prefix-instead-of-beam-',
  $custom-prop-prefix: 'clr',
  $class-color-prefix: '.#{$your-custom-prefix}color',
  $class-bg-prefix: '.#{$your-custom-prefix}bg--'
)

// Sets default to light theme
$colors: map-merge(colors.$common-colors, light.$theme-colors);
@include colors.gen-default-theme-colors($colors);

// ...
```

### Switching theme

Default file `complete.scss` and `complete.css` exports all themes. To switch between themes see the examples below:

### Using your own .scss file

You can use specific scss file to get colors for specific theme
`@import '@vst/beam/theme/dark.scss';`

and regenerate them at any moment
`@include regen-default-theme-colors($colors)`

see `'@vst/beam/theme/index.scss';` if in doubt.

### CSS. Switch using classes:

`.dark` sets variables to dark theme for current element and all descendents. Light theme is default but you can still set `.light` when you would like to have an alement and it's descendents light (same applies to `.dark`).

# Development

## Compile
1. Use: `npm run beam-compile-all` to get scss compiled to css & js variables (look for commands underneeth in package.json to run just parts of it).
2. Use: `nx build beam` (or use vscode nx console extension to run from gui) to make a publishable package out of compiled output.
## Using module from source code (example for nx monorepo)

Module can be used as published npm package, or directly from source
where you've got hot module reloading on scss change.
Make sure to configure your project's settings:

tsconfig.json (per particular app):

```json
{
  "...": "...",
  "compilerOptions": {
    "...": "...",
    "paths": {
      "...": "...",
      "@vst/beam/*": ["libs/beam/src/*"]
    }
  },
  "...": "..."
}
```

workspace.json (makes styles work for a build task)

```json
"your-app": {
      "...": "...",
      "architect": {
        "build": {
          "...": "...",
          "options": {
            "...": "...",
            "styles": ["libs/beam/src/styles/*.scss"],
            "stylePreprocessorOptions": {
              "includePaths": ["libs/beam/src/styles/"]
            }
          },
          "...": "...",
        },
        "...": "...",
      }
    },
```

# Troubleshooting

To double-check if your sass files did not brake you can run `npx sass beam-complete.scss beam-complete.css` to check for any warnings (those should appear while running the app using ng serve as well).
