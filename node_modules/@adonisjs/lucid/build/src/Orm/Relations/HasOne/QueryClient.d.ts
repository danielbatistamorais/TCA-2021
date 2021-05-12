import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { OneOrMany } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { HasOneClientContract } from '@ioc:Adonis/Lucid/Relations';
import { ModelObject, LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Model';
import { HasOne } from './index';
import { HasOneQueryBuilder } from './QueryBuilder';
import { HasOneSubQueryBuilder } from './SubQueryBuilder';
/**
 * Query client for executing queries in scope to the defined
 * relationship
 */
export declare class HasOneQueryClient implements HasOneClientContract<HasOne, LucidModel> {
    relation: HasOne;
    private parent;
    private client;
    constructor(relation: HasOne, parent: LucidRow, client: QueryClientContract);
    /**
     * Generate a related query builder
     */
    static query(client: QueryClientContract, relation: HasOne, rows: OneOrMany<LucidRow>): HasOneQueryBuilder;
    /**
     * Generate a related eager query builder
     */
    static eagerQuery(client: QueryClientContract, relation: HasOne, rows: OneOrMany<LucidRow>): HasOneQueryBuilder;
    /**
     * Returns an instance of the sub query builder
     */
    static subQuery(client: QueryClientContract, relation: HasOne): HasOneSubQueryBuilder;
    /**
     * Returns instance of query builder
     */
    query(): any;
    /**
     * Save related model instance
     */
    save(related: LucidRow): Promise<void>;
    /**
     * Create instance of the related model
     */
    create(values: ModelObject): Promise<LucidRow>;
    /**
     * Get the first matching related instance or create a new one
     */
    firstOrCreate(search: ModelObject, savePayload?: ModelObject): Promise<LucidRow>;
    /**
     * Update the existing row or create a new one
     */
    updateOrCreate(search: ModelObject, updatePayload: ModelObject): Promise<LucidRow>;
}
