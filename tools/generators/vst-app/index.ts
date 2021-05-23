import { Tree } from '@nrwl/devkit';
import { appGenerator } from '../../../packages/cli/src/generators/application/application';
import { ApplicationSchema } from '../../../packages/cli/src/generators/application/schema';

export default async function (host: Tree, schema: ApplicationSchema) {
  await appGenerator(host, schema, true);
}
