import knex from 'knex';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { DBQueryCallback } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { LucidModel, LucidRow, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Model';
import { RelationQueryBuilderContract, RelationshipsContract } from '@ioc:Adonis/Lucid/Relations';
import { ModelQueryBuilder } from '../../QueryBuilder';
/**
 * Base query builder for ORM Relationships
 */
export declare abstract class BaseQueryBuilder extends ModelQueryBuilder implements RelationQueryBuilderContract<LucidModel, LucidRow> {
    /**
     * Eager constraints
     */
    protected groupConstraints: {
        limit?: number;
        orderBy?: {
            column: string;
            direction?: 'asc' | 'desc';
        };
    };
    /**
     * Is query a relationship query obtained using `related('relation').query()`
     */
    get isRelatedQuery(): true;
    /**
     * Is query a relationship query obtained using `related('relation').subQuery()`
     */
    get isRelatedSubQuery(): false;
    /**
     * Is query a relationship query obtained using one of the preload methods.
     */
    isRelatedPreloadQuery: boolean;
    constructor(builder: knex.QueryBuilder, client: QueryClientContract, relation: RelationshipsContract, dbCallback: DBQueryCallback);
    /**
     * Returns the selected columns
     */
    protected getSelectedColumns(): undefined | {
        grouping: 'columns';
        value: any[];
    };
    /**
     * Returns the profiler action. Protected, since the class is extended
     * by relationships
     */
    protected getQueryData(): knex.Sql & {
        connection: string;
        inTransaction: boolean;
        model: string;
        eagerLoading: boolean;
        relation: any;
    };
    /**
     * Profiler data for the relationship
     */
    protected abstract profilerData(): any;
    /**
     * Returns the sql query keys for the join query
     */
    protected abstract getRelationKeys(): string[];
    /**
     * The relationship query builder must implement this method
     * to apply relationship related constraints
     */
    protected abstract applyConstraints(): void;
    /**
     * Must be implemented by relationships to return query which
     * handles the limit with eagerloading.
     */
    protected abstract getGroupLimitQuery(): never | ModelQueryBuilderContract<LucidModel>;
    /**
     * Returns the name of the query action. Used mainly for
     * raising descriptive errors
     */
    protected queryAction(): string;
    /**
     * Selects the relation keys. Invoked by the preloader
     */
    selectRelationKeys(): this;
    /**
     * Define the group limit
     */
    groupLimit(limit: number): this;
    /**
     * Define the group limit
     */
    groupOrderBy(column: string, direction?: 'asc' | 'desc'): this;
    /**
     * Get query sql
     */
    toSQL(): knex.Sql;
    /**
     * Execute query
     */
    exec(): Promise<any[]>;
}
