import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { OneOrMany } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { HasManyThroughClientContract } from '@ioc:Adonis/Lucid/Relations';
import { HasManyThrough } from './index';
import { HasManyThroughQueryBuilder } from './QueryBuilder';
import { HasManyThroughSubQueryBuilder } from './SubQueryBuilder';
/**
 * Query client for executing queries in scope to the defined
 * relationship
 */
export declare class HasManyThroughClient implements HasManyThroughClientContract<HasManyThrough, LucidModel> {
    relation: HasManyThrough;
    private parent;
    private client;
    constructor(relation: HasManyThrough, parent: LucidRow, client: QueryClientContract);
    /**
     * Generate a related query builder
     */
    static query(client: QueryClientContract, relation: HasManyThrough, rows: OneOrMany<LucidRow>): HasManyThroughQueryBuilder;
    /**
     * Generate a related eager query builder
     */
    static eagerQuery(client: QueryClientContract, relation: HasManyThrough, rows: OneOrMany<LucidRow>): HasManyThroughQueryBuilder;
    /**
     * Returns an instance of the sub query
     */
    static subQuery(client: QueryClientContract, relation: HasManyThrough): HasManyThroughSubQueryBuilder;
    /**
     * Returns an instance of has many through query builder
     */
    query(): any;
}
