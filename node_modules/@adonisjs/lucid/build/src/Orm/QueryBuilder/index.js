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
exports.ModelQueryBuilder = void 0;
const utils_1 = require("@poppinss/utils");
const Preloader_1 = require("../Preloader");
const QueryRunner_1 = require("../../QueryRunner");
const Chainable_1 = require("../../Database/QueryBuilder/Chainable");
const SimplePaginator_1 = require("../../Database/Paginator/SimplePaginator");
/**
 * A wrapper to invoke scope methods on the query builder
 * underlying model
 */
class ModelScopes {
    constructor(builder) {
        this.builder = builder;
        return new Proxy(this, {
            get(target, key) {
                if (typeof target.builder.model[key] === 'function') {
                    return (...args) => {
                        return target.builder.model[key](target.builder, ...args);
                    };
                }
                /**
                 * Unknown keys are not allowed
                 */
                throw new Error(`"${String(key)}" is not defined as a query scope on "${target.builder.model.name}" model`);
            },
        });
    }
}
/**
 * Database query builder exposes the API to construct and run queries for selecting,
 * updating and deleting records.
 */
class ModelQueryBuilder extends Chainable_1.Chainable {
    constructor(builder, model, client, customFn = (userFn) => {
        return ($builder) => {
            const subQuery = new ModelQueryBuilder($builder, this.model, this.client);
            subQuery.isChildQuery = true;
            userFn(subQuery);
        };
    }) {
        super(builder, customFn, model.$keys.attributesToColumns.resolve.bind(model.$keys.attributesToColumns));
        this.model = model;
        this.client = client;
        /**
         * Sideloaded attributes that will be passed to the model instances
         */
        this.sideloaded = {};
        /**
         * A copy of defined preloads on the model instance
         */
        this.preloader = new Preloader_1.Preloader(this.model);
        /**
         * A references to model scopes wrapper. It is lazily initialized
         * only when the `apply` method is invoked
         */
        this.scopesWrapper = undefined;
        /**
         * Control whether or not to wrap adapter result to model
         * instances or not
         */
        this.wrapResultsToModelInstances = true;
        /**
         * Control whether to debug the query or not. The initial
         * value is inherited from the query client
         */
        this.debugQueries = this.client.debug;
        /**
         * Self join counter, increments with every "withCount"
         * "has" and "whereHas" queries.
         */
        this.joinCounter = 0;
        /**
         * Options that must be passed to all new model instances
         */
        this.clientOptions = {
            client: this.client,
            connection: this.client.connectionName,
            profiler: this.client.profiler,
        };
        /**
         * Whether or not query is a subquery for `.where` callback
         */
        this.isChildQuery = false;
        builder.table(model.table);
    }
    /**
     * Executes the current query
     */
    async execQuery() {
        const isWriteQuery = ['update', 'del', 'insert'].includes(this.knexQuery['_method']);
        const queryData = Object.assign(this.getQueryData(), this.customReporterData);
        const rows = await new QueryRunner_1.QueryRunner(this.client, this.debugQueries, queryData).run(this.knexQuery);
        /**
         * Return the rows as it is when query is a write query
         */
        if (isWriteQuery || this.hasAggregates || !this.wrapResultsToModelInstances) {
            return Array.isArray(rows) ? rows : [rows];
        }
        /**
         * Convert fetch results to an array of model instances
         */
        const modelInstances = this.model.$createMultipleFromAdapterResult(rows, this.sideloaded, this.clientOptions);
        /**
         * Preload for model instances
         */
        await this.preloader
            .sideload(this.sideloaded)
            .debug(this.debugQueries)
            .processAllForMany(modelInstances, this.client);
        return modelInstances;
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
     * Defines sub query for checking the existance of a relationship
     */
    addWhereHas(relationName, boolean, operator, value, callback) {
        let rawMethod = 'whereRaw';
        let existsMethod = 'whereExists';
        switch (boolean) {
            case 'or':
                rawMethod = 'orWhereRaw';
                existsMethod = 'orWhereExists';
                break;
            case 'not':
                existsMethod = 'whereNotExists';
                break;
            case 'orNot':
                rawMethod = 'orWhereRaw';
                existsMethod = 'orWhereNotExists';
                break;
        }
        const subQuery = this.getRelationship(relationName).subQuery(this.client);
        subQuery.selfJoinCounter = this.joinCounter;
        /**
         * Invoke callback when defined
         */
        if (typeof callback === 'function') {
            callback(subQuery);
        }
        /**
         * Count all when value and operator are defined.
         */
        if (value !== undefined && operator !== undefined) {
            /**
             * If user callback has not defined any aggregates, then we should
             * add a count
             */
            if (!subQuery.hasAggregates) {
                subQuery.count('*');
            }
            /**
             * Pull sql and bindings from the query
             */
            const { sql, bindings } = subQuery.prepare().toSQL();
            /**
             * Define where raw clause. Query builder doesn't have any "whereNotRaw" method
             * and hence we need to prepend the `NOT` keyword manually
             */
            boolean === 'orNot' || boolean === 'not'
                ? this[rawMethod](`not (${sql}) ${operator} (?)`, bindings.concat([value]))
                : this[rawMethod](`(${sql}) ${operator} (?)`, bindings.concat([value]));
            return this;
        }
        /**
         * Use where exists when no operator and value is defined
         */
        this[existsMethod](subQuery.prepare());
        return this;
    }
    /**
     * Returns the profiler action. Protected, since the class is extended
     * by relationships
     */
    getQueryData() {
        return {
            connection: this.client.connectionName,
            inTransaction: this.client.isTransaction,
            model: this.model.name,
        };
    }
    /**
     * Returns the relationship instance from the model. An exception is
     * raised when relationship is missing
     */
    getRelationship(name) {
        const relation = this.model.$getRelation(name);
        /**
         * Ensure relationship exists
         */
        if (!relation) {
            throw new utils_1.Exception(`"${name}" is not defined as a relationship on "${this.model.name}" model`, 500, 'E_UNDEFINED_RELATIONSHIP');
        }
        relation.boot();
        return relation;
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
     * Clone the current query builder
     */
    clone() {
        const clonedQuery = new ModelQueryBuilder(this.knexQuery.clone(), this.model, this.client);
        this.applyQueryFlags(clonedQuery);
        clonedQuery.sideloaded = Object.assign({}, this.sideloaded);
        return clonedQuery;
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
     * Applies the query scopes on the current query builder
     * instance
     */
    apply(callback) {
        this.scopesWrapper = this.scopesWrapper || new ModelScopes(this);
        callback(this.scopesWrapper);
        return this;
    }
    /**
     * Set sideloaded properties to be passed to the model instance
     */
    sideload(value) {
        this.sideloaded = value;
        return this;
    }
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    async first() {
        await this.model.$hooks.exec('before', 'find', this);
        const result = await this.limit(1).execQuery();
        if (result[0]) {
            await this.model.$hooks.exec('after', 'find', result[0]);
        }
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
     * Get count of a relationship along side the main query results
     */
    withCount(relationName, userCallback) {
        const subQuery = this.getRelationship(relationName).subQuery(this.client);
        subQuery.selfJoinCounter = this.joinCounter;
        /**
         * Invoke user callback
         */
        if (typeof userCallback === 'function') {
            userCallback(subQuery);
        }
        /**
         * If user callback has not defined any aggregates, then we should
         * add a count
         */
        if (!subQuery.hasAggregates) {
            subQuery.count('*');
        }
        /**
         * Select "*" when no custom selects are defined
         */
        if (!this.columns.length) {
            this.select(`${this.model.table}.*`);
        }
        /**
         * Define alias, when a custom alias is not defined
         */
        if (!subQuery.subQueryAlias) {
            subQuery.as(`${relationName}_count`);
        }
        /**
         * Count subquery selection
         */
        this.select(subQuery.prepare());
        /**
         * Bump the counter
         */
        this.joinCounter++;
        return this;
    }
    /**
     * Add where constraint using the relationship
     */
    whereHas(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'and', operator, value, callback);
    }
    /**
     * Add or where constraint using the relationship
     */
    orWhereHas(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'or', operator, value, callback);
    }
    /**
     * Alias of [[whereHas]]
     */
    andWhereHas(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'and', operator, value, callback);
    }
    /**
     * Add where not constraint using the relationship
     */
    whereDoesntHave(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'not', operator, value, callback);
    }
    /**
     * Add or where not constraint using the relationship
     */
    orWhereDoesntHave(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'orNot', operator, value, callback);
    }
    /**
     * Alias of [[whereDoesntHave]]
     */
    andWhereDoesntHave(relationName, callback, operator, value) {
        return this.addWhereHas(relationName, 'not', operator, value, callback);
    }
    /**
     * Add where constraint using the relationship
     */
    has(relationName, operator, value) {
        return this.addWhereHas(relationName, 'and', operator, value);
    }
    /**
     * Add or where constraint using the relationship
     */
    orHas(relationName, operator, value) {
        return this.addWhereHas(relationName, 'or', operator, value);
    }
    /**
     * Alias of [[has]]
     */
    andHas(relationName, operator, value) {
        return this.addWhereHas(relationName, 'and', operator, value);
    }
    /**
     * Add where not constraint using the relationship
     */
    doesntHave(relationName, operator, value) {
        return this.addWhereHas(relationName, 'not', operator, value);
    }
    /**
     * Add or where not constraint using the relationship
     */
    orDoesntHave(relationName, operator, value) {
        return this.addWhereHas(relationName, 'orNot', operator, value);
    }
    /**
     * Alias of [[doesntHave]]
     */
    andDoesntHave(relationName, operator, value) {
        return this.addWhereHas(relationName, 'not', operator, value);
    }
    /**
     * Define a relationship to be preloaded
     */
    preload(relationName, userCallback) {
        this.preloader.preload(relationName, userCallback);
        return this;
    }
    /**
     * Perform update by incrementing value for a given column. Increments
     * can be clubbed with `update` as well
     */
    increment(column, counter) {
        this.ensureCanPerformWrites();
        this.knexQuery.increment(column, counter);
        return this;
    }
    /**
     * Perform update by decrementing value for a given column. Decrements
     * can be clubbed with `update` as well
     */
    decrement(column, counter) {
        this.ensureCanPerformWrites();
        this.knexQuery.decrement(column, counter);
        return this;
    }
    /**
     * Perform update
     */
    update(columns) {
        this.ensureCanPerformWrites();
        this.knexQuery.update(columns);
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
        const isFetchCall = this.wrapResultsToModelInstances && this.knexQuery['_method'] === 'select';
        if (isFetchCall) {
            await this.model.$hooks.exec('before', 'fetch', this);
        }
        const result = await this.execQuery();
        if (isFetchCall) {
            await this.model.$hooks.exec('after', 'fetch', result);
        }
        return result;
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
        /**
         * We pass both the counts query and the main query to the
         * paginate hook
         */
        await this.model.$hooks.exec('before', 'paginate', [countQuery, this]);
        await this.model.$hooks.exec('before', 'fetch', this);
        const aggregateResult = await countQuery.execQuery();
        const total = this.hasGroupBy ? aggregateResult.length : aggregateResult[0].total;
        const results = total > 0 ? await this.forPage(page, perPage).execQuery() : [];
        const paginator = new SimplePaginator_1.SimplePaginator(results, total, perPage, page);
        await this.model.$hooks.exec('after', 'paginate', paginator);
        await this.model.$hooks.exec('after', 'fetch', results);
        return paginator;
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
exports.ModelQueryBuilder = ModelQueryBuilder;
/**
 * Required by macroable
 */
ModelQueryBuilder.macros = {};
ModelQueryBuilder.getters = {};
