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
exports.DatabaseQueryBuilder = void 0;
const utils_1 = require("@poppinss/utils");
const Chainable_1 = require("./Chainable");
const QueryRunner_1 = require("../../QueryRunner");
const SimplePaginator_1 = require("../Paginator/SimplePaginator");
/**
 * Wrapping the user function for a query callback and give them
 * a new instance of the `DatabaseQueryBuilder` and not
 * knex.QueryBuilder
 */
const queryCallback = (userFn, keysResolver) => {
    return (builder) => {
        /**
         * Sub queries don't need the client, since client is used to execute the query
         * and subqueries are not executed seperately. That's why we just pass
         * an empty object.
         *
         * Other option is to have this method for each instance of the class, but this
         * is waste of resources.
         */
        userFn(new DatabaseQueryBuilder(builder, {}, keysResolver));
    };
};
/**
 * Database query builder exposes the API to construct and run queries for selecting,
 * updating and deleting records.
 */
class DatabaseQueryBuilder extends Chainable_1.Chainable {
    constructor(builder, client, keysResolver) {
        super(builder, queryCallback, keysResolver);
        this.client = client;
        this.keysResolver = keysResolver;
        /**
         * Control whether to debug the query or not. The initial
         * value is inherited from the query client
         */
        this.debugQueries = this.client.debug;
    }
    /**
     * Ensures that we are not executing `update` or `del` when using read only
     * client
     */
    ensureCanPerformWrites() {
        if (this.client && this.client.mode === 'read') {
            throw new utils_1.Exception('Updates and deletes cannot be performed in read mode');
        }
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
     * Delete rows under the current query
     */
    del() {
        this.ensureCanPerformWrites();
        this.knexQuery.del();
        return this;
    }
    /**
     * Alias for [[del]]
     */
    delete() {
        return this.del();
    }
    /**
     * Clone the current query builder
     */
    clone() {
        const clonedQuery = new DatabaseQueryBuilder(this.knexQuery.clone(), this.client);
        this.applyQueryFlags(clonedQuery);
        return clonedQuery;
    }
    /**
     * Define returning columns
     */
    returning(columns) {
        /**
         * Do not chain `returning` in sqlite3 to avoid knex warnings
         */
        if (this.client && ['sqlite3', 'mysql'].includes(this.client.dialect.name)) {
            return this;
        }
        columns = Array.isArray(columns)
            ? columns.map((column) => this.resolveKey(column))
            : this.resolveKey(columns);
        this.knexQuery.returning(columns);
        return this;
    }
    /**
     * Perform update by incrementing value for a given column. Increments
     * can be clubbed with `update` as well
     */
    increment(column, counter) {
        this.knexQuery.increment(this.resolveKey(column, true), counter);
        return this;
    }
    /**
     * Perform update by decrementing value for a given column. Decrements
     * can be clubbed with `update` as well
     */
    decrement(column, counter) {
        this.knexQuery.decrement(this.resolveKey(column, true), counter);
        return this;
    }
    /**
     * Perform update
     */
    update(column, value, returning) {
        this.ensureCanPerformWrites();
        if (value === undefined && returning === undefined) {
            this.knexQuery.update(this.resolveKey(column, true));
        }
        else if (returning === undefined) {
            this.knexQuery.update(this.resolveKey(column), value);
        }
        else {
            this.knexQuery.update(this.resolveKey(column), value, returning);
        }
        return this;
    }
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    async first() {
        const result = await this.limit(1)['exec']();
        return result[0] || null;
    }
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    async firstOrFail() {
        const row = await this.first();
        if (!row) {
            throw new utils_1.Exception('Row not found', 404, 'E_ROW_NOT_FOUND');
        }
        return row;
    }
    /**
     * Define a query to constraint to be defined when condition is truthy
     */
    ifDialect(dialects, matchCallback, noMatchCallback) {
        dialects = Array.isArray(dialects) ? dialects : [dialects];
        if (dialects.includes(this.client.dialect.name)) {
            matchCallback(this);
        }
        else if (noMatchCallback) {
            noMatchCallback(this);
        }
        return this;
    }
    /**
     * Define a query to constraint to be defined when condition is falsy
     */
    unlessDialect(dialects, matchCallback, noMatchCallback) {
        dialects = Array.isArray(dialects) ? dialects : [dialects];
        if (!dialects.includes(this.client.dialect.name)) {
            matchCallback(this);
        }
        else if (noMatchCallback) {
            noMatchCallback(this);
        }
        return this;
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
     * Paginate through rows inside a given table
     */
    async paginate(page, perPage = 20) {
        /**
         * Cast to number
         */
        page = Number(page);
        perPage = Number(perPage);
        const countQuery = this.clone()
            .clearOrder()
            .clearLimit()
            .clearOffset()
            .clearSelect()
            .count('* as total');
        const aggregates = await countQuery.exec();
        const total = this.hasGroupBy ? aggregates.length : aggregates[0].total;
        const results = total > 0 ? await this.forPage(page, perPage).exec() : [];
        return new SimplePaginator_1.SimplePaginator(results, total, perPage, page);
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
exports.DatabaseQueryBuilder = DatabaseQueryBuilder;
/**
 * Required by macroable
 */
DatabaseQueryBuilder.macros = {};
DatabaseQueryBuilder.getters = {};
