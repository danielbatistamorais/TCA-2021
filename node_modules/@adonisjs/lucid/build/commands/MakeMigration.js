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
const utils_1 = require("@poppinss/utils");
const standalone_1 = require("@adonisjs/core/build/standalone");
class MakeMigration extends standalone_1.BaseCommand {
    /**
     * Returns the directory for creating the migration file
     */
    async getDirectory(migrationPaths) {
        if (this.folder) {
            return this.folder;
        }
        let directories = migrationPaths && migrationPaths.length ? migrationPaths : ['database/migrations'];
        if (directories.length === 1) {
            return directories[0];
        }
        return this.prompt.choice('Select the migrations folder', directories, { name: 'folder' });
    }
    /**
     * Execute command
     */
    async run() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        const connection = db.getRawConnection(this.connection || db.primaryConnectionName);
        /**
         * Ensure the define connection name does exists in the
         * config file
         */
        if (!connection) {
            this.logger.error(`${this.connection} is not a valid connection name. Double check config/database file`);
            return;
        }
        /**
         * Not allowed together, hence we must notify the user about the same
         */
        if (this.table && this.create) {
            this.logger.warning('--table and --create cannot be used together. Ignoring --create');
        }
        /**
         * The folder for creating the schema file
         */
        const folder = await this.getDirectory((connection.config.migrations || {}).paths);
        /**
         * Using the user defined table name or an empty string. We can attempt to
         * build the table name from the migration file name, but let's do that
         * later.
         */
        const tableName = this.table || this.create || '';
        /**
         * Template stub
         */
        const stub = path_1.join(__dirname, '..', 'templates', this.table ? 'migration-alter.txt' : 'migration-make.txt');
        /**
         * Prepend timestamp to keep schema files in the order they
         * have been created
         */
        const prefix = `${new Date().getTime()}_`;
        this.generator
            .addFile(this.name, { pattern: 'snakecase', form: 'plural', prefix })
            .stub(stub)
            .destinationDir(folder)
            .appRoot(this.application.cliCwd || this.application.appRoot)
            .useMustache()
            .apply({
            toClassName() {
                return function (filename, render) {
                    const migrationClassName = utils_1.lodash.camelCase(tableName || render(filename).replace(prefix, ''));
                    return `${migrationClassName.charAt(0).toUpperCase()}${migrationClassName.slice(1)}`;
                };
            },
            toTableName() {
                return function (filename, render) {
                    return tableName || utils_1.lodash.snakeCase(render(filename).replace(prefix, ''));
                };
            },
        });
        await this.generator.run();
    }
}
MakeMigration.commandName = 'make:migration';
MakeMigration.description = 'Make a new migration file';
/**
 * This command loads the application, since we need the runtime
 * to find the migration directories for a given connection
 */
MakeMigration.settings = {
    loadApp: true,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the migration file' }),
    __metadata("design:type", String)
], MakeMigration.prototype, "name", void 0);
__decorate([
    standalone_1.flags.string({ description: 'Define a custom database connection for the migration' }),
    __metadata("design:type", String)
], MakeMigration.prototype, "connection", void 0);
__decorate([
    standalone_1.flags.string({ description: 'Pre-select a migration directory' }),
    __metadata("design:type", String)
], MakeMigration.prototype, "folder", void 0);
__decorate([
    standalone_1.flags.string({ description: 'Define the table name for creating a new table' }),
    __metadata("design:type", String)
], MakeMigration.prototype, "create", void 0);
__decorate([
    standalone_1.flags.string({ description: 'Define the table name for altering an existing table' }),
    __metadata("design:type", String)
], MakeMigration.prototype, "table", void 0);
exports.default = MakeMigration;
