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
exports.MssqlDialect = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const Raw_1 = require("../Database/StaticBuilder/Raw");
class MssqlDialect {
    constructor(client) {
        this.client = client;
        this.name = 'mssql';
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
     * Returns an array of table names
     */
    async getAllTables() {
        const tables = await this.client
            .query()
            .from('information_schema.tables')
            .select('table_name as table_name')
            .where('table_type', 'BASE TABLE')
            .where('table_catalog', new Raw_1.RawBuilder('DB_NAME()'))
            .whereNot('table_name', 'like', 'spt_%')
            .andWhereNot('table_name', 'MSreplication_options')
            .orderBy('table_name', 'asc');
        return tables.map(({ table_name }) => table_name);
    }
    /**
     * Truncate mssql table. Disabling foreign key constriants alone is
     * not enough for SQL server.
     *
     * One has to drop all FK constraints and then re-create them, and
     * this all is too much work
     */
    async truncate(table, _) {
        return this.client.knexQuery().table(table).truncate();
    }
    /**
     * Drop all tables inside the database
     */
    async dropAllTables() {
        await this.client.rawQuery(`
			DECLARE @sql NVARCHAR(MAX) = N'';
				SELECT @sql += 'ALTER TABLE '
					+ QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + + QUOTENAME(OBJECT_NAME(parent_object_id))
					+ ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
				FROM sys.foreign_keys;
				EXEC sp_executesql @sql;
		`);
        await this.client.rawQuery(`EXEC sp_MSforeachtable 'DROP TABLE \\?';`);
    }
    getAdvisoryLock() {
        throw new Error('Support for advisory locks is not implemented for mssql. Create a PR to add the feature');
    }
    releaseAdvisoryLock() {
        throw new Error('Support for advisory locks is not implemented for mssql. Create a PR to add the feature');
    }
}
exports.MssqlDialect = MssqlDialect;
