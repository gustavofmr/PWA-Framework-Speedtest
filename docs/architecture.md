# Viasat app framework

## Framework goal

The goal is to empower and speed up development teams via reuse of core capabilities while still allowing customization at the edge.

## The three groups of libraries

Complete framework will consist of three groups of libraries:
- domain libraries
- utility libraries
- component library/design system

Libraries will be independent of each other and won't be build in a layered fashion.
Thanks to that each library can be build in parallel and without strict coordination between teams, and without particular order of development.

Applications will be build, by composing the libraries together.

## Domain libraries (frontent agnostic logic)

Packages containing only the business logic.

### Requirements

- communication with APIs
- state management
- business logic
- universal (that depends on the single framework vs multiple-frameworks support)

### Proposal

Build packages for different domains/features. Keep them small and easy to maintain. Example packages:- `@viasat/auth` - for authorization (JWT, OAuth or whatever you use)

- `@viasat/data-transfer-usage` - taking care of user data transfer usage API
- `@viasat/user-settings` - user settings management - communication with user API (might also interact with browser storage for some settings persistence)

### Level of responsibility

In case of universal libraries it would probably look similar to typical SDK.

```ts
import Auth from `@viasat/auth`;
const authClient = new Auth('<config here>');
authClient.authorize(username, password);
authClient.isLoggedIn();
```

Settling on single framework allows you to do more things in the lib (creating hooks, take care of the caching here).

```tsx
import { useAuth } from `@viasat/auth`;
const LoginComponent = () => {
  const { authorize, isLoginInProgress } = useAuth();
  return isLoginInProgress ? (
    <Spinner />
  ) : (
    <LoginForm
      onSubmit={(username, password) => authorize(username, password)}
    />
  );
};
```

You can also go with both approaches at the same time. You can expose typical SDK and also wrappers prepared for a framework (eg. hook like in the example).

## Utility libraries (React for starting point)

Starting point for creating all Viasat web applications. Standardizes approach to typical app requirements.

### Requirements

- i18n, l10n
- routing
- service worker (PWA)
- state/data management
- SSR ​(Q: SEO importance or other reasons?)

### Proposal

Build framework based on Next.js (which already provides few of those things out of the box: routing, SSR) and then add common configuration, boilerplate for the i18n, state management and enhance it with service worker builder (based on workbox).

### Pros

- You can pretty much start with raw Next.js (you don't waste time on SSR and a lot of configuration)
- Boilerplate can be then moved to custom framework based on this (harvesting)
- You get the most popular framework under the hood, tested in thousands of projects

### Cons

- You are a bit limited with configuration/flexibility (however I think it's a better approach)
  - You don't have to maintain it (and that's super important)
  - With each update you get new functionalities/optimizations
  - Generally your code will be following standard React app approach (should be fairly simple to replace the framework later without much of an effort)
  - It's pretty low level framework, so you still have a lot of flexibility
- You are settling on React (I think it's better way to go at the start if you don't have serious reasons for all frameworks usage)

### Questions

- Can you develop all apps in one framework or you need the support for all frameworks?
  - What are the reasons?
  - What competences you have in frontend/fullstack department?
- Which UI framework do we want to take as a "Base"?

### How to build it?

- wrap Next.js in your own package (eg. @viasat/framework)
  - make it work exactly like next at the beginning (file system routing, `_app`, `_document` support, option to extend `next.config.js`)
  - expose commands like (`viasat-framework build`, `viasat-framework test`, `viasat-framework start`)
  - create SW builder inside the framework (based on workbox)
- build your own wrappers on state management, i18n as a separate packages (eg. `@viasat/i18n`, `@viasat/state`)
  - as time goes you can move boilerplate you will see in applications to the framework itself (eg. dedicated `_app`, `_document` files with all the context providers)
  - framework automatically can add those dependencies
- you can create your own CLI for creating new app based on this framework (more on that later)

## Component library, design system

UI layer of the framework. Providing common components, themes and guidelines.

### Proposal

One common component library based on Viasat DS + common components created during app development.
Apart from that each application will have it's own components. You can even go with placing some components in the domain libraries (eg. `LoginForm` in `@viasat/auth`). But that's just an idea if the actual login view would be exactly the same in all applications.
To structure the format of the component library you can use Atomic Design to split smaller components from bigger sections or whole templates.
To help everyone discover available components there could be storybook instance with component usage examples and documentation.
This library would probably also enforce styling solution used for the all apps (CSS in JS lib or regular CSS/SASS).

## Combining all the layers together (Version Control Architecture)

How to develop applications based on that layers and maintain/extend the layers themselves?

### Proposal

Use the monorepo approach. Keep all domain packages, framework code, design system and applications in the same repository.

### Pros

- Contributing to any part of the framework is encouraged (you don't have to open separate repository, you instantly see consequences of your change across all applications)
- Easy to maintain consistency across all applications (if you refactor something, you can do it for all apps at the same time)
- Every application is always on the same version of the framework/libraries. You don't have to maintain multiple versions at the same time
- You don't have to publish the libraries/framework anywhere (you only deploy builded applications)
- In case of design system (in one storybook you can present components from all libraries and applications). You can discover potential components that might be worth to move from application to component library
- Easier to enforce some rules if everything is in the one repository

### Cons

- CI/CD will be more complex (that's also the reason to pick `Nx`)
- You might find some scalability problems at some time
- You have to manage permissions for contributions to specific libraries using `codeowners` mechanism (so someone doesn't add something useless/not fully prepared/tested to component library or crucial framework)

### How to start?

Use `Nx` as it gives you out of the box linking between libraries/applications and optimized build/test (only rebuilding affected libraries/apps).
Then you can create your own schematics/builder for `@viasat/framework` to speed things up even more for new applications.

## Important points we need to find the answers to on workshop

1. How we see notifying the teams about changes in core packages?
2. Can core logic be overrided or extended? Should we support that?
3. How do we want to deploy? Who decides about deploys, are they automatic? Are there staging envs? Are we able to have PRs with deployment preview and e2e tests?
4. How do we want to keep docs? Is there a reason to introduce for example Architectural Decision Records? (strongly related to 1. question)
