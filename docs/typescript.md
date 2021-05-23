# Typescript

We try to utilize Typescript in all libraries and apps, because of the followings reasons:

- to avoid bugs (static typechecking eliminates a lot of errors eg. typos)
- better documentation (typing give you hint for parameters, fields, etc.)
- easier discovery (editor autocomplete helps you to discover API of libraries/components)
- excellent refactoring (because TS compiler links all references and that makes it possible to change symbol in source and propagate it across the whole codebase)

For typescript use `ts` extension or `tsx` for files containing `jsx`.

Use TS even in unit and e2e tests. Unit tests should end with `spec.ts(x)` extension and e2e with `test.ts`.

Following convention makes it easier to switch between files and to not confuse unit tests with e2e.
