"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const standalone_1 = require("@adonisjs/core/build/standalone");
class DbSeed extends standalone_1.BaseCommand {
    constructor() {
        super(...arguments);
        /**
         * Track if one or more seeders have failed
         */
        this.hasError = false;
        /**
         * Define a custom set of seeder files. Interactive and files together ignores
         * the interactive mode.
         */
        this.files = [];
    }
    /**
     * Print log message to the console
     */
    printLogMessage(file) {
        const colors = this['colors'];
        let color = 'gray';
        let message = '';
        let prefix = '';
        switch (file.status) {
            case 'pending':
                message = 'pending  ';
                color = 'gray';
                break;
            case 'failed':
                message = 'error    ';
                prefix = file.error.message;
                color = 'red';
                break;
            case 'ignored':
                message = 'ignored  ';
                prefix = 'Enabled only in development environment';
                color = 'dim';
                break;
            case 'completed':
                message = 'completed';
                color = 'green';
                break;
        }
        console.log(`${colors[color]('❯')} ${colors[color](message)} ${file.file.name}`);
        if (prefix) {
            console.log(`  ${colors[color](prefix)}`);
        }
    }
    /**
     * Execute command
     */
    async run() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.connection = this.connection || db.primaryConnectionName;
        const connection = db.getRawConnection(this.connection);
        /**
         * Ensure the define connection name does exists in the
         * config file
         */
        if (!connection) {
            this.logger.error(`"${connection}" is not a valid connection name. Double check config/database file`);
            return;
        }
        const { SeedsRunner } = await Promise.resolve().then(() => __importStar(require('../src/SeedsRunner')));
        const runner = new SeedsRunner(db, this.application, this.connection);
        /**
         * List of available files
         */
        const files = await runner.getList();
        /**
         * List of selected files. Initially, all files are selected and one can
         * define cherry pick using the `--interactive` or `--files` flag.
         */
        let selectedFileNames = files.map(({ name }) => name);
        if (this.files.length) {
            selectedFileNames = this.files.map((file) => {
                const fileExt = path_1.extname(file);
                return (fileExt ? file.replace(fileExt, '') : file).replace(/^\.\/|^\.\\\\/, '');
            });
            if (this.interactive) {
                this.logger.warning('Cannot use "--interactive" and "--files" together. Ignoring "--interactive"');
            }
        }
        else if (this.interactive) {
            selectedFileNames = await this.prompt.multiple('Select files to run', files.map((file) => {
                return { name: file.name };
            }));
        }
        /**
         * Execute selected seeders
         */
        for (let fileName of selectedFileNames) {
            const sourceFile = files.find(({ name }) => fileName === name);
            if (!sourceFile) {
                this.printLogMessage({
                    file: {
                        name: fileName,
                        absPath: fileName,
                        getSource: () => { },
                    },
                    status: 'failed',
                    error: new Error('Invalid file path. Pass relative path from the application root'),
                });
                this.hasError = true;
            }
            else {
                const response = await runner.run(sourceFile);
                if (response.status === 'failed') {
                    this.hasError = true;
                }
                this.printLogMessage(response);
            }
        }
        this.exitCode = this.hasError ? 1 : 0;
        await db.manager.closeAll(true);
    }
}
DbSeed.commandName = 'db:seed';
DbSeed.description = 'Execute database seeder files';
/**
 * This command loads the application, since we need the runtime
 * to find the migration directories for a given connection
 */
DbSeed.settings = {
    loadApp: true,
};
__decorate([
    standalone_1.flags.string({ description: 'Define a custom database connection for the seeders', alias: 'c' }),
    __metadata("design:type", String)
], DbSeed.prototype, "connection", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Run seeders in interactive mode', alias: 'i' }),
    __metadata("design:type", Boolean)
], DbSeed.prototype, "interactive", void 0);
__decorate([
    standalone_1.flags.array({ description: 'Define a custom set of seeders files names to run', alias: 'f' }),
    __metadata("design:type", Array)
], DbSeed.prototype, "files", void 0);
exports.default = DbSeed;
