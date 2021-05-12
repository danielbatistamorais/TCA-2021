/// <reference path="../../adonis-typings/index.d.ts" />
import { DialectContract, QueryClientContract } from '@ioc:Adonis/Lucid/Database';
export declare class RedshiftDialect implements DialectContract {
    private client;
    readonly name = "redshift";
    readonly supportsAdvisoryLocks = false;
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
     *
     * NOTE: ASSUMING FEATURE PARITY WITH POSTGRESQL HERE (NOT TESTED)
     */
    getAllTables(schemas: string[]): Promise<any[]>;
    /**
     * Truncate redshift table with option to cascade and restart identity.
     *
     * NOTE: ASSUMING FEATURE PARITY WITH POSTGRESQL HERE (NOT TESTED)
     */
    truncate(table: string, cascade?: boolean): Promise<any>;
    /**
     * Drop all tables inside the database
     */
    dropAllTables(schemas: string[]): Promise<void>;
    /**
     * Redshift doesn't support advisory locks. Learn more:
     * https://tableplus.com/blog/2018/10/redshift-vs-postgres-database-comparison.html
     */
    getAdvisoryLock(): Promise<boolean>;
    /**
     * Redshift doesn't support advisory locks. Learn more:
     * https://tableplus.com/blog/2018/10/redshift-vs-postgres-database-comparison.html
     */
    releaseAdvisoryLock(): Promise<boolean>;
}
