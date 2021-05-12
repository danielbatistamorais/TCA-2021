"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const util_1 = require("util");
const child_process_1 = require("child_process");
const standalone_1 = require("@adonisjs/core/build/standalone");
const exec = util_1.promisify(child_process_1.execFile);
class MakeModel extends standalone_1.BaseCommand {
    /**
     * Executes a given command
     */
    async execCommand(command, commandArgs) {
        const { stdout, stderr } = await exec(command, commandArgs, {
            env: {
                ...process.env,
                FORCE_COLOR: 'true',
            },
        });
        if (stdout) {
            console.log(stdout.trim());
        }
        if (stderr) {
            console.log(stderr.trim());
        }
    }
    /**
     * Execute command
     */
    async run() {
        const stub = path_1.join(__dirname, '..', 'templates', 'model.txt');
        const path = this.application.resolveNamespaceDirectory('models');
        this.generator
            .addFile(this.name, { pattern: 'pascalcase', form: 'singular' })
            .stub(stub)
            .destinationDir(path || 'app/Models')
            .useMustache()
            .appRoot(this.application.cliCwd || this.application.appRoot);
        if (this.migration) {
            await this.execCommand('node', ['ace', 'make:migration', this.name]);
        }
        if (this.controller) {
            await this.execCommand('node', ['ace', 'make:controller', this.name, '--resource']);
        }
        await this.generator.run();
    }
}
MakeModel.commandName = 'make:model';
MakeModel.description = 'Make a new Lucid model';
__decorate([
    standalone_1.args.string({ description: 'Name of the model class' }),
    __metadata("design:type", String)
], MakeModel.prototype, "name", void 0);
__decorate([
    standalone_1.flags.boolean({
        name: 'migration',
        alias: 'm',
        description: 'Generate the migration for the model',
    }),
    __metadata("design:type", Boolean)
], MakeModel.prototype, "migration", void 0);
__decorate([
    standalone_1.flags.boolean({
        name: 'controller',
        alias: 'c',
        description: 'Generate the controller for the model',
    }),
    __metadata("design:type", Boolean)
], MakeModel.prototype, "controller", void 0);
exports.default = MakeModel;
