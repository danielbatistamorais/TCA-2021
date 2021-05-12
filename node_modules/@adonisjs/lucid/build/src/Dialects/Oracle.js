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
exports.OracleDialect = void 0;
class OracleDialect {
    constructor(client) {
        this.client = client;
        this.name = 'oracledb';
        this.supportsAdvisoryLocks = false;
        /**
         * Reference to the database version. Knex.js fetches the version after
         * the first database query, so it will be set to undefined initially
         */
        this.version = this.client.getReadClient()['context']['client'].version;
        /**
         * The default format for datetime column. The date formats is
         * valid for luxon date parsing library
         */
        this.dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
    }
    /**
     * Not implemented yet
     */
    async getAllTables() {
        throw new Error('"getAllTables" method is not implemented for oracledb. Create a PR to add the feature');
    }
    /**
     * Truncate pg table with option to cascade and restart identity
     */
    async truncate(table, cascade = false) {
        return cascade
            ? this.client.rawQuery(`TRUNCATE ${table} CASCADE;`)
            : this.client.rawQuery(`TRUNCATE ${table};`);
    }
    /**
     * Not implemented yet
     */
    async dropAllTables() {
        throw new Error('"dropAllTables" method is not implemented for oracledb. Create a PR to add the feature');
    }
    getAdvisoryLock() {
        throw new Error('Support for advisory locks is not implemented for oracledb. Create a PR to add the feature');
    }
    releaseAdvisoryLock() {
        throw new Error('Support for advisory locks is not implemented for oracledb. Create a PR to add the feature');
    }
}
exports.OracleDialect = OracleDialect;
