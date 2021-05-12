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
exports.SqliteDialect = void 0;
class SqliteDialect {
    constructor(client) {
        this.client = client;
        this.name = 'sqlite3';
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
     * Returns an array of table names
     */
    async getAllTables() {
        const tables = await this.client
            .query()
            .from('sqlite_master')
            .select('name as table_name')
            .where('type', 'table')
            .whereNot('name', 'like', 'sqlite_%')
            .orderBy('name', 'asc');
        return tables.map(({ table_name }) => table_name);
    }
    /**
     * Truncate SQLITE tables
     */
    async truncate(table, _) {
        return this.client.knexQuery().table(table).truncate();
    }
    /**
     * Drop all tables inside the database
     */
    async dropAllTables() {
        await this.client.rawQuery('PRAGMA writable_schema = 1;');
        await this.client.rawQuery(`delete from sqlite_master where type in ('table', 'index', 'trigger');`);
        await this.client.rawQuery('PRAGMA writable_schema = 0;');
        await this.client.rawQuery('VACUUM;');
    }
    /**
     * Attempts to add advisory lock to the database and
     * returns it's status.
     */
    getAdvisoryLock() {
        throw new Error("Sqlite doesn't support advisory locks");
    }
    /**
     * Releases the advisory lock
     */
    releaseAdvisoryLock() {
        throw new Error("Sqlite doesn't support advisory locks");
    }
}
exports.SqliteDialect = SqliteDialect;
