"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedsRunner = void 0;
const SeedersSource_1 = require("./SeedersSource");
/**
 * Seeds Runner exposes the API to traverse seeders and execute them
 * in bulk
 */
class SeedsRunner {
    constructor(db, app, connectionName) {
        this.db = db;
        this.app = app;
        this.connectionName = connectionName;
        this.client = this.db.connection(this.connectionName || this.db.primaryConnectionName);
        this.config = this.db.getRawConnection(this.client.connectionName).config;
    }
    /**
     * Returns the seeder source by ensuring value is a class constructor
     */
    getSeederSource(file) {
        const source = file.getSource();
        if (typeof source === 'function') {
            return source;
        }
        throw new Error(`Invalid schema class exported by "${file.name}"`);
    }
    /**
     * Returns an array of seeders
     */
    async getList() {
        return new SeedersSource_1.SeedersSource(this.config, this.app).getSeeders();
    }
    /**
     * Executes the seeder
     */
    async run(file) {
        const Source = this.getSeederSource(file);
        const seeder = {
            status: 'pending',
            file: file,
        };
        /**
         * Ignore when running in non-development environment and seeder is development
         * only
         */
        if (Source.developmentOnly && !this.app.inDev) {
            seeder.status = 'ignored';
            return seeder;
        }
        try {
            const seederInstance = new Source(this.client);
            if (typeof seederInstance.run !== 'function') {
                throw new Error(`Missing method "run" on "${seeder.file.name}" seeder`);
            }
            await seederInstance.run();
            seeder.status = 'completed';
        }
        catch (error) {
            seeder.status = 'failed';
            seeder.error = error;
        }
        return seeder;
    }
}
exports.SeedsRunner = SeedsRunner;
