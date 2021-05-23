import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { vstApplicationGenerator } from './application';

describe('app', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('not nested', () => {
    it('should update workspace.json', async () => {
      await vstApplicationGenerator(tree, { name: 'myApp' });

      const workspaceJson = readJson(tree, 'workspace.json');

      expect(workspaceJson.projects['my-app'].root).toEqual('apps/my-app');
      expect(workspaceJson.projects['my-app-e2e'].root).toEqual(
        'apps/my-app-e2e'
      );
      expect(workspaceJson.defaultProject).toEqual('my-app');
    });

    it('should update nx.json', async () => {
      await vstApplicationGenerator(tree, {
        name: 'myApp',
      });

      const nxJson = readJson(tree, 'nx.json');

      expect(nxJson.projects).toMatchObject({
        'my-app': {
          tags: [],
        },
        'my-app-e2e': {
          tags: [],
          implicitDependencies: ['my-app'],
        },
      });
    });

    it('should generate files', async () => {
      await vstApplicationGenerator(tree, { name: 'myApp' });
      expect(tree.exists('apps/my-app/tsconfig.json')).toBeTruthy();
      expect(tree.exists('apps/my-app/pages/index.tsx')).toBeTruthy();
      expect(tree.exists('apps/my-app/specs/index.spec.tsx')).toBeTruthy();
    });

    it('should install storybook', async () => {
      await vstApplicationGenerator(tree, { name: 'myApp' });
      expect(tree.exists('apps/my-app/.storybook/main.js')).toBeTruthy();
      expect(tree.exists('apps/my-app/.storybook/preview.js')).toBeTruthy();
      expect(tree.exists('apps/my-app/.storybook/tsconfig.json')).toBeTruthy();
      expect(
        tree.exists('apps/my-app/.storybook/webpack.config.js')
      ).toBeTruthy();
    });

    it('should copy template files', async () => {
      await vstApplicationGenerator(tree, { name: 'myApp' });
      expect(
        tree.read('apps/my-app/specs/index.spec.tsx').toString('utf-8')
      ).toContain('Header');
    });

    it('should setup e2e files', async () => {
      await vstApplicationGenerator(tree, { name: 'myApp' });
      expect(
        tree
          .read('apps/my-app-e2e/src/integration/app.spec.ts')
          .toString('utf-8')
      ).toContain('should display welcome header');
    });

    it('should remove unnecessary files', async () => {
      await vstApplicationGenerator(tree, { name: 'myApp' });
      expect(tree.exists('apps/my-app/index.d.ts')).toBeFalsy();
      expect(tree.exists('apps/my-app/pages/styles.css')).toBeFalsy();
      expect(tree.exists('apps/my-app/public/nx-logo-white.svg')).toBeFalsy();
      expect(tree.exists('apps/my-app/public/star.svg')).toBeFalsy();

      expect(
        tree.exists('apps/my-app-e2e/src/fixtures/example.json')
      ).toBeFalsy();
      expect(tree.exists('apps/my-app-e2e/src/support/app.po.ts')).toBeFalsy();
      expect(
        tree.exists('apps/my-app-e2e/src/support/commands.ts')
      ).toBeFalsy();
    });
  });

  it('should setup jest with tsx support', async () => {
    await vstApplicationGenerator(tree, { name: 'my-app' });

    expect(tree.read('apps/my-app/jest.config.js').toString('utf-8')).toContain(
      `moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],`
    );
  });

  it('should setup jest with SVGR support', async () => {
    await vstApplicationGenerator(tree, { name: 'my-app' });

    expect(tree.read('apps/my-app/jest.config.js').toString('utf-8')).toContain(
      `'^(?!.*\\\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest'`
    );
  });

  it('should set up the nrwl next build builder', async () => {
    await vstApplicationGenerator(tree, { name: 'my-app' });

    const workspaceJson = readJson(tree, 'workspace.json');
    const architectConfig = workspaceJson.projects['my-app'].architect;
    expect(architectConfig.build.builder).toEqual('@nrwl/next:build');
    expect(architectConfig.build.options).toEqual({
      root: 'apps/my-app',
      outputPath: 'dist/apps/my-app',
    });
  });

  it('should set up the nrwl next server builder', async () => {
    await vstApplicationGenerator(tree, { name: 'my-app' });

    const workspaceJson = readJson(tree, 'workspace.json');
    const architectConfig = workspaceJson.projects['my-app'].architect;
    expect(architectConfig.serve.builder).toEqual('@nrwl/next:server');
    expect(architectConfig.serve.options).toEqual({
      buildTarget: 'my-app:build',
      dev: true,
    });
    expect(architectConfig.serve.configurations).toEqual({
      production: { dev: false, buildTarget: 'my-app:build:production' },
    });
  });

  it('should set up the nrwl next export builder', async () => {
    await vstApplicationGenerator(tree, { name: 'my-app' });

    const workspaceJson = readJson(tree, 'workspace.json');
    const architectConfig = workspaceJson.projects['my-app'].architect;
    expect(architectConfig.export.builder).toEqual('@nrwl/next:export');
    expect(architectConfig.export.options).toEqual({
      buildTarget: 'my-app:build:production',
    });
  });

  it('should generate functional components by default', async () => {
    await vstApplicationGenerator(tree, { name: 'myApp' });

    const appContent = tree.read('apps/my-app/pages/index.tsx').toString();

    expect(appContent).not.toMatch(/extends Component/);
  });

  describe('--linter', () => {
    describe('default (eslint)', () => {
      it('should add .eslintrc.json and dependencies', async () => {
        await vstApplicationGenerator(tree, {
          name: 'myApp',
        });

        const packageJson = readJson(tree, '/package.json');
        expect(packageJson).toMatchObject({
          devDependencies: {
            'eslint-plugin-react': expect.anything(),
            'eslint-plugin-react-hooks': expect.anything(),
          },
        });

        const eslintJson = readJson(tree, '/apps/my-app/.eslintrc.json');
        expect(eslintJson).toMatchInlineSnapshot(`
          Object {
            "extends": Array [
              "plugin:@nrwl/nx/react",
              "../../.eslintrc.json",
            ],
            "ignorePatterns": Array [
              "!**/*",
            ],
            "overrides": Array [
              Object {
                "files": Array [
                  "*.ts",
                  "*.tsx",
                  "*.js",
                  "*.jsx",
                ],
                "parserOptions": Object {
                  "project": Array [
                    "apps/my-app/tsconfig(.*)?.json",
                    "apps/my-app/.storybook/tsconfig.json",
                  ],
                },
                "rules": Object {},
              },
              Object {
                "files": Array [
                  "*.ts",
                  "*.tsx",
                ],
                "rules": Object {},
              },
              Object {
                "files": Array [
                  "*.js",
                  "*.jsx",
                ],
                "rules": Object {},
              },
            ],
          }
        `);
      });
    });
  });
});
