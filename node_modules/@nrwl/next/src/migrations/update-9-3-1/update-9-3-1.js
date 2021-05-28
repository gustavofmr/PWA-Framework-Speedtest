"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const workspace_2 = require("@nrwl/workspace/src/utils/workspace");
function update() {
    return schematics_1.chain([renameDevServerInWorkspace, workspace_1.formatFiles()]);
}
exports.default = update;
const renameDevServerInWorkspace = workspace_2.updateWorkspace((workspace) => {
    workspace.projects.forEach((project) => {
        project.targets.forEach((target) => {
            if (target.builder === '@nrwl/next:dev-server') {
                target.builder = '@nrwl/next:server';
            }
        });
    });
});
//# sourceMappingURL=update-9-3-1.js.map