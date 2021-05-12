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
exports.Database = void 0;
const utils_1 = require("@poppinss/utils");
const QueryClient_1 = require("../QueryClient");
const Raw_1 = require("./StaticBuilder/Raw");
const prettyPrint_1 = require("../Helpers/prettyPrint");
const QueryBuilder_1 = require("../Orm/QueryBuilder");
const Manager_1 = require("../Connection/Manager");
const Insert_1 = require("./QueryBuilder/Insert");
const Reference_1 = require("./StaticBuilder/Reference");
const SimplePaginator_1 = require("./Paginator/SimplePaginator");
const Database_1 = require("./QueryBuilder/Database");
/**
 * Database class exposes the API to manage multiple connections and obtain an instance
 * of query/transaction clients.
 */
class Database {
    constructor(config, logger, profiler, emitter) {
        this.config = config;
        this.logger = logger;
        this.profiler = profiler;
        this.emitter = emitter;
        /**
         * Primary connection name
         */
        this.primaryConnectionName = this.config.connection;
        /**
         * Reference to query builders. We expose them, so that they can be
         * extended from outside using macros.
         */
        this.DatabaseQueryBuilder = Database_1.DatabaseQueryBuilder;
        this.InsertQueryBuilder = Insert_1.InsertQueryBuilder;
        this.ModelQueryBuilder = QueryBuilder_1.ModelQueryBuilder;
        this.SimplePaginator = SimplePaginator_1.SimplePaginator;
        /**
         * A store of global transactions
         */
        this.connectionGlobalTransactions = new Map();
        this.hasHealthChecksEnabled = false;
        this.prettyPrint = prettyPrint_1.prettyPrint;
        this.validateConfig();
        this.manager = new Manager_1.ConnectionManager(this.logger, this.emitter);
        this.registerConnections();
        this.findIfHealthChecksAreEnabled();
    }
    /**
     * Validate config at runtime
     */
    validateConfig() {
        const validator = new utils_1.ManagerConfigValidator(this.config, 'database', 'config/database');
        validator.validateDefault('connection');
        validator.validateList('connections', 'connection');
    }
    /**
     * Compute whether health check is enabled or not after registering the connections.
     * There are chances that all pre-registered connections are not using health
     * checks but a dynamic connection is using it. We don't support that use case
     * for now, since it complicates things a lot and forces us to register the
     * health checker on demand.
     */
    findIfHealthChecksAreEnabled() {
        for (let [, conn] of this.manager.connections) {
            if (conn.config.healthCheck) {
                this.hasHealthChecksEnabled = true;
                break;
            }
        }
    }
    /**
     * Registering all connections with the manager, so that we can fetch
     * and connect with them whenver required.
     */
    registerConnections() {
        Object.keys(this.config.connections).forEach((name) => {
            this.manager.add(name, this.config.connections[name]);
        });
    }
    /**
     * Returns the connection node from the connection manager
     */
    getRawConnection(name) {
        return this.manager.get(name);
    }
    /**
     * Returns the query client for a given connection
     */
    connection(connection = this.primaryConnectionName, options) {
        options = options || {};
        /**
         * Use default profiler, when no profiler is defined when obtaining
         * the query client for a given connection.
         */
        if (!options.profiler) {
            options.profiler = this.profiler;
        }
        /**
         * Connect is noop when already connected
         */
        this.manager.connect(connection);
        /**
         * Disallow modes other than `read` or `write`
         */
        if (options.mode && !['read', 'write'].includes(options.mode)) {
            throw new utils_1.Exception(`Invalid mode ${options.mode}. Must be read or write`);
        }
        /**
         * Return the global transaction when it already exists.
         */
        if (this.connectionGlobalTransactions.has(connection)) {
            this.logger.trace({ connection }, 'using pre-existing global transaction connection');
            const globalTransactionClient = this.connectionGlobalTransactions.get(connection);
            return globalTransactionClient;
        }
        /**
         * Fetching connection for the given name
         */
        const rawConnection = this.getRawConnection(connection).connection;
        /**
         * Generating query client for a given connection and setting appropriate
         * mode on it
         */
        this.logger.trace({ connection }, 'creating query client in %s mode', [options.mode || 'dual']);
        const queryClient = options.mode
            ? new QueryClient_1.QueryClient(options.mode, rawConnection, this.emitter)
            : new QueryClient_1.QueryClient('dual', rawConnection, this.emitter);
        /**
         * Passing profiler to the query client for profiling queries
         */
        queryClient.profiler = options.profiler;
        return queryClient;
    }
    /**
     * Returns the knex query builder
     */
    knexQuery() {
        return this.connection(this.primaryConnectionName).knexQuery();
    }
    /**
     * Returns the knex raw query builder
     */
    knexRawQuery(sql, bindings) {
        return this.connection(this.primaryConnectionName).knexRawQuery(sql, bindings);
    }
    /**
     * Returns query builder. Optionally one can define the mode as well
     */
    query(options) {
        return this.connection(this.primaryConnectionName, options).query();
    }
    /**
     * Returns insert query builder. Always has to be dual or write mode and
     * hence it doesn't matter, since in both `dual` and `write` mode,
     * the `write` connection is always used.
     */
    insertQuery(options) {
        return this.connection(this.primaryConnectionName, options).insertQuery();
    }
    /**
     * Returns a query builder instance for a given model.
     */
    modelQuery(model, options) {
        return this.connection(this.primaryConnectionName, options).modelQuery(model);
    }
    /**
     * Returns an instance of raw query builder. Optionally one can
     * defined the `read/write` mode in which to execute the
     * query
     */
    rawQuery(sql, bindings, options) {
        return this.connection(this.primaryConnectionName, options).rawQuery(sql, bindings);
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
        return this.connection().from(table);
    }
    /**
     * Returns insert query builder and selects the table
     */
    table(table) {
        return this.connection().table(table);
    }
    /**
     * Returns a transaction instance on the default
     * connection
     */
    transaction(callback) {
        return this.connection().transaction(callback);
    }
    /**
     * Invokes `manager.report`
     */
    report() {
        return this.manager.report();
    }
    /**
     * Begin a new global transaction
     */
    async beginGlobalTransaction(connectionName, options) {
        connectionName = connectionName || this.primaryConnectionName;
        /**
         * Return global transaction as it is
         */
        const globalTrx = this.connectionGlobalTransactions.get(connectionName);
        if (globalTrx) {
            return globalTrx;
        }
        /**
         * Create a new transaction and store a reference to it
         */
        const trx = await this.connection(connectionName, options).transaction();
        this.connectionGlobalTransactions.set(trx.connectionName, trx);
        /**
         * Listen for events to drop the reference when transaction
         * is over
         */
        trx.on('commit', ($trx) => {
            this.connectionGlobalTransactions.delete($trx.connectionName);
        });
        trx.on('rollback', ($trx) => {
            this.connectionGlobalTransactions.delete($trx.connectionName);
        });
        return trx;
    }
    /**
     * Commit an existing global transaction
     */
    async commitGlobalTransaction(connectionName) {
        connectionName = connectionName || this.primaryConnectionName;
        const trx = this.connectionGlobalTransactions.get(connectionName);
        if (!trx) {
            throw new utils_1.Exception([
                'Cannot commit a non-existing global transaction.',
                ' Make sure you are not calling "commitGlobalTransaction" twice',
            ].join(''));
        }
        await trx.commit();
    }
    /**
     * Rollback an existing global transaction
     */
    async rollbackGlobalTransaction(connectionName) {
        connectionName = connectionName || this.primaryConnectionName;
        const trx = this.connectionGlobalTransactions.get(connectionName);
        if (!trx) {
            throw new utils_1.Exception([
                'Cannot rollback a non-existing global transaction.',
                ' Make sure you are not calling "commitGlobalTransaction" twice',
            ].join(''));
        }
        await trx.rollback();
    }
}
exports.Database = Database;
