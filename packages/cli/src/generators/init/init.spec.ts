import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { vstInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add react dependencies', async () => {
    await vstInitGenerator(tree);
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['@nrwl/next']).toBeUndefined();
    expect(packageJson.dependencies['@nrwl/react']).toBeUndefined();

    expect(packageJson.devDependencies['@nrwl/next']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/react']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/storybook']).toBeDefined();
    expect(packageJson.devDependencies['@vst/cli']).toBeDefined();
    expect(packageJson.devDependencies['jest']).toBeDefined();
    expect(packageJson.devDependencies['cypress']).toBeDefined();
    expect(packageJson.dependencies['next']).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      await vstInitGenerator(tree);
      const workspaceJson = readJson(tree, 'workspace.json');
      expect(workspaceJson.cli.defaultCollection).toEqual('@nrwl/next');
    });
  });
});
