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
exports.TransactionClient = void 0;
const events_1 = require("events");
const QueryBuilder_1 = require("../Orm/QueryBuilder");
const Raw_1 = require("../Database/StaticBuilder/Raw");
const Raw_2 = require("../Database/QueryBuilder/Raw");
const Insert_1 = require("../Database/QueryBuilder/Insert");
const Reference_1 = require("../Database/StaticBuilder/Reference");
const Database_1 = require("../Database/QueryBuilder/Database");
/**
 * Transaction uses a dedicated connection from the connection pool
 * and executes queries inside a given transaction.
 */
class TransactionClient extends events_1.EventEmitter {
    constructor(knexClient, dialect, connectionName, debug, emitter) {
        super();
        this.knexClient = knexClient;
        this.dialect = dialect;
        this.connectionName = connectionName;
        this.debug = debug;
        this.emitter = emitter;
        /**
         * Always true
         */
        this.isTransaction = true;
        /**
         * Transactions are always in write mode, since they always needs
         * the primary connection
         */
        this.mode = 'dual';
        /**
         * Lucid models listens for transaction events to delete the reference. During
         * testing, it is common to generate more than 10 model instances and hence
         * the max listeners limit needs to be removed
         */
        this.setMaxListeners(Infinity);
    }
    /**
     * Whether or not transaction has been completed
     */
    get isCompleted() {
        return this.knexClient.isCompleted();
    }
    /**
     * Returns schema instance for the write client
     */
    get schema() {
        return this.getWriteClient().schema;
    }
    /**
     * Returns the read client. Which is just a single client in case
     * of transactions
     */
    getReadClient() {
        return this.knexClient;
    }
    /**
     * Returns the write client. Which is just a single client in case
     * of transactions
     */
    getWriteClient() {
        return this.knexClient;
    }
    /**
     * Truncate tables inside a transaction
     */
    async truncate(table, cascade = false) {
        await this.dialect.truncate(table, cascade);
    }
    /**
     * Returns an array of table names
     */
    async getAllTables(schemas) {
        return this.dialect.getAllTables(schemas);
    }
    /**
     * Get columns info inside a transaction. You won't need it here, however
     * added for API compatibility with the [[QueryClient]] class
     */
    async columnsInfo(table, column) {
        const query = this.knexClient.select(table);
        const result = await (column ? query.columnInfo(column) : query.columnInfo());
        return result;
    }
    /**
     * Get a new query builder instance
     */
    knexQuery() {
        return this.knexClient.queryBuilder();
    }
    /**
     * Returns the knex raw query builder instance. The query builder is always
     * created from the `write` client, so before executing the query, you
     * may want to decide which client to use.
     */
    knexRawQuery(sql, bindings) {
        return bindings ? this.knexClient.raw(sql, bindings) : this.knexClient.raw(sql);
    }
    /**
     * Returns a query builder instance for a given model. The `connection`
     * and `profiler` is passed down to the model, so that it continue
     * using the same options
     */
    modelQuery(model) {
        return new QueryBuilder_1.ModelQueryBuilder(this.knexQuery(), model, this);
    }
    /**
     * Get a new query builder instance
     */
    query() {
        return new Database_1.DatabaseQueryBuilder(this.knexQuery(), this);
    }
    /**
     * Get a new insert query builder instance
     */
    insertQuery() {
        return new Insert_1.InsertQueryBuilder(this.knexQuery(), this);
    }
    /**
     * Execute raw query on transaction
     */
    rawQuery(sql, bindings) {
        return new Raw_2.RawQueryBuilder(this.knexClient.raw(sql, bindings), this);
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
     * Returns another instance of transaction with save point
     */
    async transaction(callback) {
        var _a;
        const trx = await this.knexClient.transaction();
        const transaction = new TransactionClient(trx, this.dialect, this.connectionName, this.debug, this.emitter);
        /**
         * Always make sure to pass the profiler down the chain
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
     * Same as [[Transaction.query]] but also selects the table
     */
    from(table) {
        return this.query().from(table);
    }
    /**
     * Same as [[Transaction.insertTable]] but also selects the table
     */
    table(table) {
        return this.insertQuery().table(table);
    }
    /**
     * Commit the transaction
     */
    async commit() {
        var _a, _b;
        try {
            await this.knexClient.commit();
            (_a = this.profiler) === null || _a === void 0 ? void 0 : _a.end({ state: 'commit' });
            this.emit('commit', this);
            this.removeAllListeners();
        }
        catch (error) {
            (_b = this.profiler) === null || _b === void 0 ? void 0 : _b.end({ state: 'commit' });
            this.removeAllListeners();
            throw error;
        }
    }
    /**
     * Rollback the transaction
     */
    async rollback() {
        var _a, _b;
        try {
            await this.knexClient.rollback();
            (_a = this.profiler) === null || _a === void 0 ? void 0 : _a.end({ state: 'rollback' });
            this.emit('rollback', this);
            this.removeAllListeners();
        }
        catch (error) {
            (_b = this.profiler) === null || _b === void 0 ? void 0 : _b.end({ state: 'rollback' });
            this.removeAllListeners();
            throw error;
        }
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
exports.TransactionClient = TransactionClient;
