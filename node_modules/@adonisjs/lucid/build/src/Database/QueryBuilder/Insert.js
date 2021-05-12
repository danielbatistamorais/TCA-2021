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
exports.InsertQueryBuilder = void 0;
const macroable_1 = require("macroable");
const QueryRunner_1 = require("../../QueryRunner");
/**
 * Exposes the API for performing SQL inserts
 */
class InsertQueryBuilder extends macroable_1.Macroable {
    constructor(knexQuery, client) {
        super();
        this.knexQuery = knexQuery;
        this.client = client;
        /**
         * Control whether to debug the query or not. The initial
         * value is inherited from the query client
         */
        this.debugQueries = this.client.debug;
    }
    /**
     * Returns the log data
     */
    getQueryData() {
        return {
            connection: this.client.connectionName,
            inTransaction: this.client.isTransaction,
            ...this.customReporterData,
        };
    }
    /**
     * Define custom reporter data. It will be merged with
     * the existing data
     */
    reporterData(data) {
        this.customReporterData = data;
        return this;
    }
    /**
     * Define table for performing the insert query
     */
    table(table) {
        this.knexQuery.table(table);
        return this;
    }
    /**
     * Define returning columns for the insert query
     */
    returning(column) {
        /**
         * Do not chain `returning` in sqlite3 to avoid knex warnings
         */
        if (this.client && ['sqlite3', 'mysql'].includes(this.client.dialect.name)) {
            return this;
        }
        this.knexQuery.returning(column);
        return this;
    }
    /**
     * Perform insert query
     */
    insert(columns) {
        this.knexQuery.insert(columns);
        return this;
    }
    /**
     * Insert multiple rows in a single query
     */
    multiInsert(columns) {
        return this.insert(columns);
    }
    /**
     * Turn on/off debugging for this query
     */
    debug(debug) {
        this.debugQueries = debug;
        return this;
    }
    /**
     * Define query timeout
     */
    timeout(time, options) {
        this.knexQuery['timeout'](time, options);
        return this;
    }
    /**
     * Returns SQL query as a string
     */
    toQuery() {
        return this.knexQuery.toQuery();
    }
    /**
     * Run query inside the given transaction
     */
    useTransaction(transaction) {
        this.knexQuery.transacting(transaction.knexClient);
        return this;
    }
    /**
     * Executes the query
     */
    async exec() {
        return new QueryRunner_1.QueryRunner(this.client, this.debugQueries, this.getQueryData()).run(this.knexQuery);
    }
    /**
     * Get sql representation of the query
     */
    toSQL() {
        return this.knexQuery.toSQL();
    }
    /**
     * Implementation of `then` for the promise API
     */
    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }
    /**
     * Implementation of `catch` for the promise API
     */
    catch(reject) {
        return this.exec().catch(reject);
    }
    /**
     * Implementation of `finally` for the promise API
     */
    finally(fullfilled) {
        return this.exec().finally(fullfilled);
    }
    /**
     * Required when Promises are extended
     */
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
}
exports.InsertQueryBuilder = InsertQueryBuilder;
/**
 * Required by macroable
 */
InsertQueryBuilder.macros = {};
InsertQueryBuilder.getters = {};
