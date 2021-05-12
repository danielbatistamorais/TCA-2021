import { OneOrMany } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { ManyToManyClientContract } from '@ioc:Adonis/Lucid/Relations';
import { LucidModel, LucidRow, ModelObject } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract, TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { ManyToMany } from './index';
import { ManyToManyQueryBuilder } from './QueryBuilder';
import { ManyToManySubQueryBuilder } from './SubQueryBuilder';
/**
 * Query client for executing queries in scope to the defined
 * relationship
 */
export declare class ManyToManyQueryClient implements ManyToManyClientContract<ManyToMany, LucidModel> {
    relation: ManyToMany;
    private parent;
    private client;
    constructor(relation: ManyToMany, parent: LucidRow, client: QueryClientContract);
    /**
     * Generate a related query builder
     */
    static query(client: QueryClientContract, relation: ManyToMany, rows: OneOrMany<LucidRow>): ManyToManyQueryBuilder;
    /**
     * Generate a related eager query builder
     */
    static eagerQuery(client: QueryClientContract, relation: ManyToMany, rows: OneOrMany<LucidRow>): ManyToManyQueryBuilder;
    /**
     * Returns an instance of the related sub query builder
     */
    static subQuery(client: QueryClientContract, relation: ManyToMany): ManyToManySubQueryBuilder;
    /**
     * Generate a related pivot query builder
     */
    static pivotQuery(client: QueryClientContract, relation: ManyToMany, rows: OneOrMany<LucidRow>): ManyToManyQueryBuilder;
    /**
     * Returns query builder instance
     */
    query(): ManyToManyQueryBuilder;
    /**
     * Returns a query builder instance for the pivot table only
     */
    pivotQuery(): ManyToManyQueryBuilder;
    /**
     * Save related model instance.
     */
    save(related: LucidRow, checkExisting?: boolean): Promise<void>;
    /**
     * Save many of related model instances
     */
    saveMany(related: LucidRow[], checkExisting?: boolean): Promise<void>;
    /**
     * Create and persist an instance of related model. Also makes the pivot table
     * entry to create the relationship
     */
    create(values: ModelObject, checkExisting?: boolean): Promise<LucidRow>;
    /**
     * Create and persist multiple of instances of related model. Also makes
     * the pivot table entries to create the relationship.
     */
    createMany(values: ModelObject[], checkExisting?: boolean): Promise<LucidRow[]>;
    /**
     * Attach one or more related models using it's foreign key value
     * by performing insert inside the pivot table.
     */
    attach(ids: (string | number)[] | {
        [key: string]: ModelObject;
    }, trx?: TransactionClientContract): Promise<void>;
    /**
     * Detach related ids from the pivot table
     */
    detach(ids?: (string | number)[], trx?: TransactionClientContract): Promise<void>;
    /**
     * Sync pivot rows by
     *
     * - Dropping the non-existing one's.
     * - Creating the new one's.
     * - Updating the existing one's with different attributes.
     */
    sync(ids: (string | number)[] | {
        [key: string]: ModelObject;
    }, detach?: boolean, trx?: TransactionClientContract): Promise<void>;
}
