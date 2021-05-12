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
exports.RedshiftDialect = void 0;
class RedshiftDialect {
    constructor(client) {
        this.client = client;
        this.name = 'redshift';
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
        this.dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZZ";
    }
    /**
     * Returns an array of table names for one or many schemas.
     *
     * NOTE: ASSUMING FEATURE PARITY WITH POSTGRESQL HERE (NOT TESTED)
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
     * Truncate redshift table with option to cascade and restart identity.
     *
     * NOTE: ASSUMING FEATURE PARITY WITH POSTGRESQL HERE (NOT TESTED)
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
     * Redshift doesn't support advisory locks. Learn more:
     * https://tableplus.com/blog/2018/10/redshift-vs-postgres-database-comparison.html
     */
    getAdvisoryLock() {
        throw new Error("Redshift doesn't support advisory locks");
    }
    /**
     * Redshift doesn't support advisory locks. Learn more:
     * https://tableplus.com/blog/2018/10/redshift-vs-postgres-database-comparison.html
     */
    releaseAdvisoryLock() {
        throw new Error("Redshift doesn't support advisory locks");
    }
}
exports.RedshiftDialect = RedshiftDialect;
