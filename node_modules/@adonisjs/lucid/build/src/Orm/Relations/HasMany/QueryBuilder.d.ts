/// <reference path="../../../../adonis-typings/model.d.ts" />
import knex from 'knex';
import { LucidRow, LucidModel } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { HasManyQueryBuilderContract } from '@ioc:Adonis/Lucid/Relations';
import { HasMany } from './index';
import { BaseQueryBuilder } from '../Base/QueryBuilder';
/**
 * Extends the model query builder for executing queries in scope
 * to the current relationship
 */
export declare class HasManyQueryBuilder extends BaseQueryBuilder implements HasManyQueryBuilderContract<LucidModel, LucidModel> {
    private parent;
    private relation;
    protected appliedConstraints: boolean;
    constructor(builder: knex.QueryBuilder, client: QueryClientContract, parent: LucidRow | LucidRow[], relation: HasMany);
    /**
     * Profiler data for HasMany relationship
     */
    protected profilerData(): {
        type: string;
        model: string;
        relatedModel: string;
    };
    /**
     * The keys for constructing the join query
     */
    protected getRelationKeys(): string[];
    /**
     * Clones the current query
     */
    clone(): HasManyQueryBuilder;
    /**
     * Applies constraint to limit rows to the current relationship
     * only.
     */
    protected applyConstraints(): void;
    /**
     * Same as standard model query builder paginate method. But ensures that
     * it is not invoked during eagerloading
     */
    paginate(page: number, perPage?: number): Promise<import("../../../Database/Paginator/SimplePaginator").SimplePaginator>;
    /**
     * Returns the group limit query
     */
    getGroupLimitQuery(): import("@ioc:Adonis/Lucid/Model").ModelQueryBuilderContract<LucidModel, LucidRow>;
}
