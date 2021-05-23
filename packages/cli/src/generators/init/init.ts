import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { nextInitGenerator } from '@nrwl/next/src/generators/init/init';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { version } from '../../../package.json';

function updateDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {
      '@vst/api': `^${version}`,
      '@vst/i18n': `^${version}`,
    },
    {
      '@nrwl/next': '11.6.2',
      '@nrwl/storybook': '11.6.2',
      '@vst/cli': `${version}`,
    }
  );
}

export const vstInitGenerator = async (host: Tree) => {
  const tasks: GeneratorCallback[] = [];

  const nextTask = await nextInitGenerator(host, {
    e2eTestRunner: 'cypress',
    unitTestRunner: 'jest',
  });
  tasks.push(nextTask);

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  return runTasksInSerial(...tasks);
};

export const vstInitSchematic = convertNxGenerator(vstInitGenerator);
