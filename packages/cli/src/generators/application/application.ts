import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  names,
  Tree,
} from '@nrwl/devkit';
import { applicationGenerator as nextAppGenerator } from '@nrwl/next/src/generators/application/application';
import { configurationGenerator as storybookGenerator } from '@nrwl/storybook/src/generators/configuration/configuration';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import * as path from 'path';
import { vstInitGenerator } from '../init/init';
import { ApplicationSchema } from './schema';

export async function appGenerator(
  host: Tree,
  schema: ApplicationSchema,
  local = false
) {
  const normalizedName = names(schema.name).fileName;
  const tasks: GeneratorCallback[] = [];
  await nextAppGenerator(host, {
    name: normalizedName,
    skipFormat: true,
    style: 'styled-components',
  });

  const storybookTask = await storybookGenerator(host, {
    name: normalizedName,
    configureCypress: false,
    uiFramework: '@storybook/react',
  });
  tasks.push(storybookTask);

  // We need to support generator both in this workspace and as a plugin in another nx workspace
  const dir = local
    ? path.join(
        __dirname,
        '../../../../../../../packages/cli/src/generators/application'
      )
    : __dirname;

  // Copy template files
  await generateFiles(
    host,
    path.join(dir, 'templates/app'),
    `./apps/${normalizedName}/pages`,
    { tmpl: '', name: normalizedName }
  );
  await generateFiles(
    host,
    path.join(dir, 'templates/specs'),
    `./apps/${normalizedName}/specs`,
    { tmpl: '', name: normalizedName }
  );
  await generateFiles(
    host,
    path.join(dir, 'templates/e2e/integration'),
    `./apps/${normalizedName}-e2e/src/integration`,
    { tmpl: '', name: normalizedName }
  );
  await generateFiles(
    host,
    path.join(dir, 'templates/e2e/support'),
    `./apps/${normalizedName}-e2e/src/support`,
    { tmpl: '', name: normalizedName }
  );
  await host.write(`apps/${normalizedName}/public/.gitkeep`, '');

  // Remove unnecessary files
  host.delete(`apps/${normalizedName}/index.d.ts`);
  host.delete(`apps/${normalizedName}/pages/styles.css`);
  host.delete(`apps/${normalizedName}/public/nx-logo-white.svg`);
  host.delete(`apps/${normalizedName}/public/star.svg`);
  host.delete(`apps/${normalizedName}-e2e/src/fixtures/example.json`);
  host.delete(`apps/${normalizedName}-e2e/src/support/app.po.ts`);
  host.delete(`apps/${normalizedName}-e2e/src/support/commands.ts`);

  // Format files at the end
  await formatFiles(host);

  return tasks;
}

export async function vstApplicationGenerator(
  host: Tree,
  schema: ApplicationSchema
) {
  const tasks: GeneratorCallback[] = [];
  const vstInitTask = await vstInitGenerator(host);
  tasks.push(vstInitTask);

  const appTasks = await appGenerator(host, schema);

  await formatFiles(host);

  return runTasksInSerial(...tasks, ...appTasks);
}

export const vstApplicationSchematic = convertNxGenerator(
  vstApplicationGenerator
);
