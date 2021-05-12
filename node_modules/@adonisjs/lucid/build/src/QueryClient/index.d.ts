/// <reference path="../../adonis-typings/index.d.ts" />
/// <reference types="@adonisjs/events/build/adonis-typings" />
/// <reference types="@adonisjs/profiler/build/adonis-typings/profiler" />
import knex from 'knex';
import { EmitterContract } from '@ioc:Adonis/Core/Event';
import { ProfilerRowContract, ProfilerContract } from '@ioc:Adonis/Core/Profiler';
import { DialectContract, ConnectionContract, QueryClientContract, TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { RawBuilder } from '../Database/StaticBuilder/Raw';
import { ReferenceBuilder } from '../Database/StaticBuilder/Reference';
/**
 * Query client exposes the API to fetch instance of different query builders
 * to perform queries on a selecte connection.
 */
export declare class QueryClient implements QueryClientContract {
    readonly mode: 'dual' | 'write' | 'read';
    private connection;
    emitter: EmitterContract;
    /**
     * Not a transaction client
     */
    readonly isTransaction = false;
    /**
     * The dialect in use
     */
    dialect: DialectContract;
    /**
     * The profiler to be used for profiling queries
     */
    profiler?: ProfilerRowContract | ProfilerContract;
    /**
     * Name of the connection in use
     */
    readonly connectionName: string;
    /**
     * Is debugging enabled
     */
    debug: boolean;
    constructor(mode: 'dual' | 'write' | 'read', connection: ConnectionContract, emitter: EmitterContract);
    /**
     * Returns schema instance for the write client
     */
    get schema(): knex.SchemaBuilder;
    /**
     * Returns the read client. The readClient is optional, since we can get
     * an instance of [[QueryClient]] with a sticky write client.
     */
    getReadClient(): knex;
    /**
     * Returns the write client
     */
    getWriteClient(): knex;
    /**
     * Truncate table
     */
    truncate(table: string, cascade?: boolean): Promise<void>;
    /**
     * Get information for a table columns
     */
    columnsInfo(table: string, column?: string): Promise<any>;
    /**
     * Returns an array of table names
     */
    getAllTables(schemas?: string[]): Promise<string[]>;
    /**
     * Returns an instance of a transaction. Each transaction will
     * query and hold a single connection for all queries.
     */
    transaction(callback?: (trx: TransactionClientContract) => Promise<any>): Promise<any>;
    /**
     * Returns the knex query builder instance. The query builder is always
     * created from the `write` client, so before executing the query, you
     * may want to decide which client to use.
     */
    knexQuery(): knex.QueryBuilder;
    /**
     * Returns the knex raw query builder instance. The query builder is always
     * created from the `write` client, so before executing the query, you
     * may want to decide which client to use.
     */
    knexRawQuery(sql: string, bindings?: any): knex.Raw;
    /**
     * Returns a query builder instance for a given model.
     */
    modelQuery(model: any): any;
    /**
     * Returns instance of a query builder for selecting, updating
     * or deleting rows
     */
    query(): any;
    /**
     * Returns instance of a query builder for inserting rows
     */
    insertQuery(): any;
    /**
     * Returns instance of raw query builder
     */
    rawQuery(sql: any, bindings?: any): any;
    /**
     * Returns an instance of raw builder. This raw builder queries
     * cannot be executed. Use `rawQuery`, if you want to execute
     * queries raw queries.
     */
    raw(sql: string, bindings?: any): RawBuilder;
    /**
     * Returns reference builder.
     */
    ref(reference: string): ReferenceBuilder;
    /**
     * Returns instance of a query builder and selects the table
     */
    from(table: any): any;
    /**
     * Returns instance of a query builder and selects the table
     * for an insert query
     */
    table(table: any): any;
    /**
     * Get advisory lock on the selected connection
     */
    getAdvisoryLock(key: string, timeout?: number): any;
    /**
     * Release advisory lock
     */
    releaseAdvisoryLock(key: string): any;
}
