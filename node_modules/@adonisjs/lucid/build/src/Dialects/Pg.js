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
exports.PgDialect = void 0;
class PgDialect {
    constructor(client) {
        this.client = client;
        this.name = 'postgres';
        this.supportsAdvisoryLocks = true;
        /**
         * Reference to the database version. Knex.js fetches the version after
         * the first database query, so it will be set to undefined initially
         */
        this.version = this.client.getReadClient()['context']['client'].version;
        /**
         * The default format for datetime column. The date formats is
         * valid for luxon date parsing library
         */
        this.dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZZ";
    }
    /**
     * Returns an array of table names for one or many schemas.
     */
    async getAllTables(schemas) {
        const tables = await this.client
            .query()
            .from('pg_catalog.pg_tables')
            .select('tablename as table_name')
            .whereIn('schemaname', schemas)
            .orderBy('tablename', 'asc');
        return tables.map(({ table_name }) => table_name);
    }
    /**
     * Truncate pg table with option to cascade and restart identity
     */
    async truncate(table, cascade = false) {
        return cascade
            ? this.client.rawQuery(`TRUNCATE ${table} RESTART IDENTITY CASCADE;`)
            : this.client.rawQuery(`TRUNCATE ${table};`);
    }
    /**
     * Drop all tables inside the database
     */
    async dropAllTables(schemas) {
        const tables = await this.getAllTables(schemas);
        await this.client.rawQuery(`DROP table ${tables.join(',')} CASCADE;`);
    }
    /**
     * Attempts to add advisory lock to the database and
     * returns it's status.
     */
    async getAdvisoryLock(key) {
        const response = await this.client.rawQuery(`SELECT PG_TRY_ADVISORY_LOCK('${key}') as lock_status;`);
        return response.rows[0] && response.rows[0].lock_status === true;
    }
    /**
     * Releases the advisory lock
     */
    async releaseAdvisoryLock(key) {
        const response = await this.client.rawQuery(`SELECT PG_ADVISORY_UNLOCK('${key}') as lock_status;`);
        return response.rows[0] && response.rows[0].lock_status === true;
    }
}
exports.PgDialect = PgDialect;
