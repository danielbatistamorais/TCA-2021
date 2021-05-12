"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pretty_hrtime_1 = __importDefault(require("pretty-hrtime"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const prettyPrint_1 = require("../../src/Helpers/prettyPrint");
const utils_1 = require("../../src/utils");
/**
 * Base class to execute migrations and print logs
 */
class MigrationsBase extends standalone_1.BaseCommand {
    /**
     * Not a valid message
     */
    printNotAValidConnection(connection) {
        this.logger.error(`"${connection}" is not a valid connection name. Double check config/database file`);
    }
    /**
     * Prompts to take consent for running migrations in production
     */
    async takeProductionConstent() {
        const question = 'You are in production environment. Want to continue running migrations?';
        try {
            const continueMigrations = await this.prompt.confirm(question);
            return continueMigrations;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Returns beautified log message string
     */
    printLogMessage(file, direction) {
        const color = file.status === 'pending' ? 'gray' : file.status === 'completed' ? 'green' : 'red';
        const arrow = this.colors[color]('❯');
        const message = file.status === 'pending'
            ? direction === 'up'
                ? 'migrating'
                : 'reverting'
            : file.status === 'completed'
                ? direction === 'up'
                    ? 'migrated'
                    : 'reverted'
                : 'error';
        this.logger.logUpdate(`${arrow} ${this.colors[color](message)} ${file.file.name}`);
    }
    /**
     * Pretty print sql queries of a file
     */
    prettyPrintSql(file, connectionName) {
        console.log(this.logger.colors.gray(`------------- ${file.file.name} -------------`));
        console.log();
        file.queries.map((sql) => {
            prettyPrint_1.prettyPrint({
                connection: connectionName,
                sql: sql,
                ddl: true,
                method: utils_1.getDDLMethod(sql),
                bindings: [],
            });
            console.log();
        });
        console.log(this.logger.colors.gray('------------- END -------------'));
    }
    /**
     * Runs the migrations using the migrator
     */
    async runMigrations(migrator, connectionName) {
        /**
         * Pretty print SQL in dry run and return early
         */
        if (migrator.dryRun) {
            await migrator.run();
            await migrator.close();
            Object.keys(migrator.migratedFiles).forEach((file) => {
                this.prettyPrintSql(migrator.migratedFiles[file], connectionName);
            });
            return;
        }
        /**
         * A set of files processed and emitted using event emitter.
         */
        const processedFiles = new Set();
        let start;
        let duration;
        /**
         * Starting to process a new migration file
         */
        migrator.on('migration:start', (file) => {
            processedFiles.add(file.file.name);
            this.printLogMessage(file, migrator.direction);
        });
        /**
         * Migration completed
         */
        migrator.on('migration:completed', (file) => {
            this.printLogMessage(file, migrator.direction);
            this.logger.logUpdatePersist();
        });
        /**
         * Migration error
         */
        migrator.on('migration:error', (file) => {
            this.printLogMessage(file, migrator.direction);
            this.logger.logUpdatePersist();
        });
        migrator.on('start', () => (start = process.hrtime()));
        migrator.on('end', () => (duration = process.hrtime(start)));
        /**
         * Run and close db connection
         */
        await migrator.run();
        await migrator.close();
        /**
         * Log all pending files. This will happen, when one of the migration
         * fails with an error and then the migrator stops emitting events.
         */
        Object.keys(migrator.migratedFiles).forEach((file) => {
            if (!processedFiles.has(file)) {
                this.printLogMessage(migrator.migratedFiles[file], migrator.direction);
            }
        });
        /**
         * Log final status
         */
        switch (migrator.status) {
            case 'completed':
                const completionMessage = migrator.direction === 'up' ? 'Migrated in' : 'Reverted in';
                console.log(`\n${completionMessage} ${this.colors.cyan(pretty_hrtime_1.default(duration))}`);
                break;
            case 'skipped':
                const message = migrator.direction === 'up' ? 'Already up to date' : 'Already at latest batch';
                console.log(this.colors.cyan(message));
                break;
            case 'error':
                this.logger.fatal(migrator.error);
                this.exitCode = 1;
                break;
        }
    }
}
exports.default = MigrationsBase;
