/// <reference path="../../../adonis-typings/index.d.ts" />
import knex from 'knex';
import { ReferenceBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
/**
 * Reference builder to create SQL reference values
 */
export declare class ReferenceBuilder implements ReferenceBuilderContract {
    private ref;
    private schema;
    private alias;
    constructor(ref: string);
    /**
     * Define schema
     */
    withSchema(schema: string): this;
    /**
     * Define alias
     */
    as(alias: string): this;
    /**
     * Converts reference to knex
     */
    toKnex(client: knex.Client): knex.Ref<any, any>;
}
