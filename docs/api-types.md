# API types

Vega APIs are based on OpenAPI standard. That allows us to generate Typescript types for parameters, query params and responses that we can use in API client layer to catch changes faster in API schema.

To generate types we use `openapi-typescript` package.

Schemas are fetched from API repositories on github and converted to models and saved in designated directories.

To generate types for API use `yarn generate-api-types` command.
