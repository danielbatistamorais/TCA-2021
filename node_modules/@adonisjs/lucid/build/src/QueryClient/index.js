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
exports.QueryClient = void 0;
const utils_1 = require("@poppinss/utils");
const helpers_1 = require("knex/lib/helpers");
const Dialects_1 = require("../Dialects");
const QueryBuilder_1 = require("../Orm/QueryBuilder");
const TransactionClient_1 = require("../TransactionClient");
const Raw_1 = require("../Database/StaticBuilder/Raw");
const Raw_2 = require("../Database/QueryBuilder/Raw");
const Insert_1 = require("../Database/QueryBuilder/Insert");
const Reference_1 = require("../Database/StaticBuilder/Reference");
const Database_1 = require("../Database/QueryBuilder/Database");
/**
 * Query client exposes the API to fetch instance of different query builders
 * to perform queries on a selecte connection.
 */
class QueryClient {
    constructor(mode, connection, emitter) {
        this.mode = mode;
        this.connection = connection;
        this.emitter = emitter;
        /**
         * Not a transaction client
         */
        this.isTransaction = false;
        /**
         * The dialect in use
         */
        this.dialect = new Dialects_1.dialects[helpers_1.resolveClientNameWithAliases(this.connection.config.client)](this);
        /**
         * Name of the connection in use
         */
        this.connectionName = this.connection.name;
        /**
         * Is debugging enabled
         */
        this.debug = !!this.connection.config.debug;
    }
    /**
     * Returns schema instance for the write client
     */
    get schema() {
        return this.getWriteClient().schema;
    }
    /**
     * Returns the read client. The readClient is optional, since we can get
     * an instance of [[QueryClient]] with a sticky write client.
     */
    getReadClient() {
        if (this.mode === 'read' || this.mode === 'dual') {
            return this.connection.readClient;
        }
        return this.connection.client;
    }
    /**
     * Returns the write client
     */
    getWriteClient() {
        if (this.mode === 'write' || this.mode === 'dual') {
            return this.connection.client;
        }
        throw new utils_1.Exception('Write client is not available for query client instantiated in read mode', 500, 'E_RUNTIME_EXCEPTION');
    }
    /**
     * Truncate table
     */
    async truncate(table, cascade = false) {
        await this.dialect.truncate(table, cascade);
    }
    /**
     * Get information for a table columns
     */
    async columnsInfo(table, column) {
        const result = await this.getWriteClient()
            .table(table)
            .columnInfo(column ? column : undefined);
        return result;
    }
    /**
     * Returns an array of table names
     */
    async getAllTables(schemas) {
        return this.dialect.getAllTables(schemas);
    }
    /**
     * Returns an instance of a transaction. Each transaction will
     * query and hold a single connection for all queries.
     */
    async transaction(callback) {
        var _a;
        const trx = await this.getWriteClient().transaction();
        const transaction = new TransactionClient_1.TransactionClient(trx, this.dialect, this.connectionName, this.debug, this.emitter);
        /**
         * Always make sure to pass the profiler and emitter down to the transaction
         * client as well
         */
        transaction.profiler = (_a = this.profiler) === null || _a === void 0 ? void 0 : _a.create('trx:begin', { state: 'begin' });
        /**
         * Self managed transaction
         */
        if (typeof callback === 'function') {
            try {
                const response = await callback(transaction);
                !transaction.isCompleted && (await transaction.commit());
                return response;
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        return transaction;
    }
    /**
     * Returns the knex query builder instance. The query builder is always
     * created from the `write` client, so before executing the query, you
     * may want to decide which client to use.
     */
    knexQuery() {
        return this.connection.client.queryBuilder();
    }
    /**
     * Returns the knex raw query builder instance. The query builder is always
     * created from the `write` client, so before executing the query, you
     * may want to decide which client to use.
     */
    knexRawQuery(sql, bindings) {
        return bindings ? this.connection.client.raw(sql, bindings) : this.connection.client.raw(sql);
    }
    /**
     * Returns a query builder instance for a given model.
     */
    modelQuery(model) {
        return new QueryBuilder_1.ModelQueryBuilder(this.knexQuery(), model, this);
    }
    /**
     * Returns instance of a query builder for selecting, updating
     * or deleting rows
     */
    query() {
        return new Database_1.DatabaseQueryBuilder(this.knexQuery(), this);
    }
    /**
     * Returns instance of a query builder for inserting rows
     */
    insertQuery() {
        return new Insert_1.InsertQueryBuilder(this.getWriteClient().queryBuilder(), this);
    }
    /**
     * Returns instance of raw query builder
     */
    rawQuery(sql, bindings) {
        return new Raw_2.RawQueryBuilder(this.connection.client.raw(sql, bindings), this);
    }
    /**
     * Returns an instance of raw builder. This raw builder queries
     * cannot be executed. Use `rawQuery`, if you want to execute
     * queries raw queries.
     */
    raw(sql, bindings) {
        return new Raw_1.RawBuilder(sql, bindings);
    }
    /**
     * Returns reference builder.
     */
    ref(reference) {
        return new Reference_1.ReferenceBuilder(reference);
    }
    /**
     * Returns instance of a query builder and selects the table
     */
    from(table) {
        return this.query().from(table);
    }
    /**
     * Returns instance of a query builder and selects the table
     * for an insert query
     */
    table(table) {
        return this.insertQuery().table(table);
    }
    /**
     * Get advisory lock on the selected connection
     */
    getAdvisoryLock(key, timeout) {
        return this.dialect.getAdvisoryLock(key, timeout);
    }
    /**
     * Release advisory lock
     */
    releaseAdvisoryLock(key) {
        return this.dialect.releaseAdvisoryLock(key);
    }
}
exports.QueryClient = QueryClient;
