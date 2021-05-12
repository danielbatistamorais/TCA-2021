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
exports.MysqlDialect = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const Raw_1 = require("../Database/StaticBuilder/Raw");
class MysqlDialect {
    constructor(client) {
        this.client = client;
        this.name = 'mysql';
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
        this.dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
    }
    /**
     * Truncate mysql table with option to cascade
     */
    async truncate(table, cascade = false) {
        if (!cascade) {
            return this.client.knexQuery().table(table).truncate();
        }
        /**
         * Cascade and truncate
         */
        const trx = await this.client.transaction();
        try {
            await trx.rawQuery('SET FOREIGN_KEY_CHECKS=0;');
            await trx.knexQuery().table(table).truncate();
            await trx.rawQuery('SET FOREIGN_KEY_CHECKS=1;');
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            throw error;
        }
    }
    /**
     * Returns an array of table names
     */
    async getAllTables() {
        const tables = await this.client
            .query()
            .from('information_schema.tables')
            .select('table_name as table_name')
            .where('TABLE_TYPE', 'BASE TABLE')
            .where('table_schema', new Raw_1.RawBuilder('database()'))
            .orderBy('table_name', 'asc');
        return tables.map(({ table_name }) => table_name);
    }
    /**
     * Drop all tables inside the database
     */
    async dropAllTables() {
        const tables = await this.getAllTables();
        /**
         * Cascade and truncate
         */
        const trx = await this.client.transaction();
        try {
            await trx.rawQuery('SET FOREIGN_KEY_CHECKS=0;');
            await trx.rawQuery(`DROP table ${tables.join(',')};`);
            await trx.rawQuery('SET FOREIGN_KEY_CHECKS=1;');
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            throw error;
        }
    }
    /**
     * Attempts to add advisory lock to the database and
     * returns it's status.
     */
    async getAdvisoryLock(key, timeout = 0) {
        const response = await this.client.rawQuery(`SELECT GET_LOCK('${key}', ${timeout}) as lock_status;`);
        return response[0] && response[0][0] && response[0][0].lock_status === 1;
    }
    /**
     * Releases the advisory lock
     */
    async releaseAdvisoryLock(key) {
        const response = await this.client.rawQuery(`SELECT RELEASE_LOCK('${key}') as lock_status;`);
        return response[0] && response[0][0] && response[0][0].lock_status === 1;
    }
}
exports.MysqlDialect = MysqlDialect;
