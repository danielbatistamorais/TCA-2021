/// <reference path="../../adonis-typings/index.d.ts" />
/// <reference types="@adonisjs/events/build/adonis-typings" />
/// <reference types="@adonisjs/profiler/build/adonis-typings/profiler" />
/// <reference types="node" />
import knex from 'knex';
import { EventEmitter } from 'events';
import { EmitterContract } from '@ioc:Adonis/Core/Event';
import { ProfilerRowContract } from '@ioc:Adonis/Core/Profiler';
import { TransactionClientContract, DialectContract } from '@ioc:Adonis/Lucid/Database';
import { RawBuilder } from '../Database/StaticBuilder/Raw';
import { ReferenceBuilder } from '../Database/StaticBuilder/Reference';
/**
 * Transaction uses a dedicated connection from the connection pool
 * and executes queries inside a given transaction.
 */
export declare class TransactionClient extends EventEmitter implements TransactionClientContract {
    knexClient: knex.Transaction;
    dialect: DialectContract;
    connectionName: string;
    debug: boolean;
    emitter: EmitterContract;
    /**
     * Always true
     */
    isTransaction: true;
    /**
     * Transactions are always in write mode, since they always needs
     * the primary connection
     */
    mode: 'dual';
    /**
     * The profiler to be used for profiling queries
     */
    profiler?: ProfilerRowContract;
    constructor(knexClient: knex.Transaction, dialect: DialectContract, connectionName: string, debug: boolean, emitter: EmitterContract);
    /**
     * Whether or not transaction has been completed
     */
    get isCompleted(): boolean;
    /**
     * Returns schema instance for the write client
     */
    get schema(): knex.SchemaBuilder;
    /**
     * Returns the read client. Which is just a single client in case
     * of transactions
     */
    getReadClient(): knex.Transaction<any, any>;
    /**
     * Returns the write client. Which is just a single client in case
     * of transactions
     */
    getWriteClient(): knex.Transaction<any, any>;
    /**
     * Truncate tables inside a transaction
     */
    truncate(table: string, cascade?: boolean): Promise<void>;
    /**
     * Returns an array of table names
     */
    getAllTables(schemas?: string[]): Promise<string[]>;
    /**
     * Get columns info inside a transaction. You won't need it here, however
     * added for API compatibility with the [[QueryClient]] class
     */
    columnsInfo(table: string, column?: string): Promise<any>;
    /**
     * Get a new query builder instance
     */
    knexQuery(): knex.QueryBuilder;
    /**
     * Returns the knex raw query builder instance. The query builder is always
     * created from the `write` client, so before executing the query, you
     * may want to decide which client to use.
     */
    knexRawQuery(sql: string, bindings?: any): knex.Raw;
    /**
     * Returns a query builder instance for a given model. The `connection`
     * and `profiler` is passed down to the model, so that it continue
     * using the same options
     */
    modelQuery(model: any): any;
    /**
     * Get a new query builder instance
     */
    query(): any;
    /**
     * Get a new insert query builder instance
     */
    insertQuery(): any;
    /**
     * Execute raw query on transaction
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
     * Returns another instance of transaction with save point
     */
    transaction(callback?: (trx: TransactionClientContract) => Promise<any>): Promise<any>;
    /**
     * Same as [[Transaction.query]] but also selects the table
     */
    from(table: any): any;
    /**
     * Same as [[Transaction.insertTable]] but also selects the table
     */
    table(table: any): any;
    /**
     * Commit the transaction
     */
    commit(): Promise<void>;
    /**
     * Rollback the transaction
     */
    rollback(): Promise<void>;
    /**
     * Get advisory lock on the selected connection
     */
    getAdvisoryLock(key: string, timeout?: number): any;
    /**
     * Release advisory lock
     */
    releaseAdvisoryLock(key: string): any;
}
