/// <reference path="../../../adonis-typings/index.d.ts" />
import knex from 'knex';
import { LucidModel, ModelObject, ModelAdapterOptions, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Model';
import { RelationshipsContract } from '@ioc:Adonis/Lucid/Relations';
import { DBQueryCallback } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { DialectContract, QueryClientContract, TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { Chainable } from '../../Database/QueryBuilder/Chainable';
import { SimplePaginator } from '../../Database/Paginator/SimplePaginator';
/**
 * Database query builder exposes the API to construct and run queries for selecting,
 * updating and deleting records.
 */
export declare class ModelQueryBuilder extends Chainable implements ModelQueryBuilderContract<LucidModel> {
    model: LucidModel;
    client: QueryClientContract;
    /**
     * Sideloaded attributes that will be passed to the model instances
     */
    private sideloaded;
    /**
     * A copy of defined preloads on the model instance
     */
    private preloader;
    /**
     * Required by macroable
     */
    protected static macros: {};
    protected static getters: {};
    /**
     * A references to model scopes wrapper. It is lazily initialized
     * only when the `apply` method is invoked
     */
    private scopesWrapper;
    /**
     * Control whether or not to wrap adapter result to model
     * instances or not
     */
    protected wrapResultsToModelInstances: boolean;
    /**
     * Custom data someone want to send to the profiler and the
     * query event
     */
    private customReporterData;
    /**
     * Control whether to debug the query or not. The initial
     * value is inherited from the query client
     */
    private debugQueries;
    /**
     * Self join counter, increments with every "withCount"
     * "has" and "whereHas" queries.
     */
    private joinCounter;
    /**
     * Options that must be passed to all new model instances
     */
    clientOptions: ModelAdapterOptions;
    /**
     * Whether or not query is a subquery for `.where` callback
     */
    isChildQuery: boolean;
    constructor(builder: knex.QueryBuilder, model: LucidModel, client: QueryClientContract, customFn?: DBQueryCallback);
    /**
     * Executes the current query
     */
    private execQuery;
    /**
     * Ensures that we are not executing `update` or `del` when using read only
     * client
     */
    private ensureCanPerformWrites;
    /**
     * Defines sub query for checking the existance of a relationship
     */
    private addWhereHas;
    /**
     * Returns the profiler action. Protected, since the class is extended
     * by relationships
     */
    protected getQueryData(): {
        connection: string;
        inTransaction: boolean;
        model: string;
    };
    /**
     * Returns the relationship instance from the model. An exception is
     * raised when relationship is missing
     */
    protected getRelationship(name: string): RelationshipsContract;
    /**
     * Define custom reporter data. It will be merged with
     * the existing data
     */
    reporterData(data: any): this;
    /**
     * Clone the current query builder
     */
    clone(): ModelQueryBuilder;
    /**
     * Define a query to constraint to be defined when condition is truthy
     */
    ifDialect(dialects: DialectContract['name'] | DialectContract['name'][], matchCallback: (query: this) => any, noMatchCallback?: (query: this) => any): this;
    /**
     * Define a query to constraint to be defined when condition is falsy
     */
    unlessDialect(dialects: DialectContract['name'] | DialectContract['name'][], matchCallback: (query: this) => any, noMatchCallback?: (query: this) => any): this;
    /**
     * Applies the query scopes on the current query builder
     * instance
     */
    apply(callback: (scopes: any) => void): this;
    /**
     * Set sideloaded properties to be passed to the model instance
     */
    sideload(value: ModelObject): this;
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    first(): Promise<any>;
    /**
     * Fetch and return first results from the results set. This method
     * will implicitly set a `limit` on the query
     */
    firstOrFail(): Promise<any>;
    /**
     * Get count of a relationship along side the main query results
     */
    withCount(relationName: any, userCallback?: any): this;
    /**
     * Add where constraint using the relationship
     */
    whereHas(relationName: any, callback: any, operator?: string, value?: any): this;
    /**
     * Add or where constraint using the relationship
     */
    orWhereHas(relationName: any, callback: any, operator?: string, value?: any): this;
    /**
     * Alias of [[whereHas]]
     */
    andWhereHas(relationName: any, callback: any, operator?: string, value?: any): this;
    /**
     * Add where not constraint using the relationship
     */
    whereDoesntHave(relationName: any, callback: any, operator?: string, value?: any): this;
    /**
     * Add or where not constraint using the relationship
     */
    orWhereDoesntHave(relationName: any, callback: any, operator?: string, value?: any): this;
    /**
     * Alias of [[whereDoesntHave]]
     */
    andWhereDoesntHave(relationName: any, callback: any, operator?: string, value?: any): this;
    /**
     * Add where constraint using the relationship
     */
    has(relationName: any, operator?: string, value?: any): this;
    /**
     * Add or where constraint using the relationship
     */
    orHas(relationName: any, operator?: string, value?: any): this;
    /**
     * Alias of [[has]]
     */
    andHas(relationName: any, operator?: string, value?: any): this;
    /**
     * Add where not constraint using the relationship
     */
    doesntHave(relationName: any, operator?: string, value?: any): this;
    /**
     * Add or where not constraint using the relationship
     */
    orDoesntHave(relationName: any, operator?: string, value?: any): this;
    /**
     * Alias of [[doesntHave]]
     */
    andDoesntHave(relationName: any, operator?: string, value?: any): this;
    /**
     * Define a relationship to be preloaded
     */
    preload(relationName: any, userCallback?: any): this;
    /**
     * Perform update by incrementing value for a given column. Increments
     * can be clubbed with `update` as well
     */
    increment(column: any, counter?: any): any;
    /**
     * Perform update by decrementing value for a given column. Decrements
     * can be clubbed with `update` as well
     */
    decrement(column: any, counter?: any): any;
    /**
     * Perform update
     */
    update(columns: any): any;
    /**
     * Delete rows under the current query
     */
    del(): any;
    /**
     * Alias for [[del]]
     */
    delete(): this;
    /**
     * Turn on/off debugging for this query
     */
    debug(debug: boolean): this;
    /**
     * Define query timeout
     */
    timeout(time: number, options?: {
        cancel: boolean;
    }): this;
    /**
     * Returns SQL query as a string
     */
    toQuery(): string;
    /**
     * Run query inside the given transaction
     */
    useTransaction(transaction: TransactionClientContract): this;
    /**
     * Executes the query
     */
    exec(): Promise<any[]>;
    /**
     * Paginate through rows inside a given table
     */
    paginate(page: number, perPage?: number): Promise<SimplePaginator>;
    /**
     * Get sql representation of the query
     */
    toSQL(): knex.Sql;
    /**
     * Implementation of `then` for the promise API
     */
    then(resolve: any, reject?: any): any;
    /**
     * Implementation of `catch` for the promise API
     */
    catch(reject: any): any;
    /**
     * Implementation of `finally` for the promise API
     */
    finally(fullfilled: any): Promise<any[]>;
    /**
     * Required when Promises are extended
     */
    get [Symbol.toStringTag](): string;
}
