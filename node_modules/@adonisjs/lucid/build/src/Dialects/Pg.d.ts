/// <reference path="../../adonis-typings/index.d.ts" />
import { DialectContract, QueryClientContract } from '@ioc:Adonis/Lucid/Database';
export declare class PgDialect implements DialectContract {
    private client;
    readonly name = "postgres";
    readonly supportsAdvisoryLocks = true;
    /**
     * Reference to the database version. Knex.js fetches the version after
     * the first database query, so it will be set to undefined initially
     */
    readonly version: any;
    /**
     * The default format for datetime column. The date formats is
     * valid for luxon date parsing library
     */
    readonly dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZZ";
    constructor(client: QueryClientContract);
    /**
     * Returns an array of table names for one or many schemas.
     */
    getAllTables(schemas: string[]): Promise<any[]>;
    /**
     * Truncate pg table with option to cascade and restart identity
     */
    truncate(table: string, cascade?: boolean): Promise<any>;
    /**
     * Drop all tables inside the database
     */
    dropAllTables(schemas: string[]): Promise<void>;
    /**
     * Attempts to add advisory lock to the database and
     * returns it's status.
     */
    getAdvisoryLock(key: string): Promise<boolean>;
    /**
     * Releases the advisory lock
     */
    releaseAdvisoryLock(key: string): Promise<boolean>;
}
