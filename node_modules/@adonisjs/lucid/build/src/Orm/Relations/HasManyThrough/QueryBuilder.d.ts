/// <reference path="../../../../adonis-typings/model.d.ts" />
import knex from 'knex';
import { LucidRow, LucidModel } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { HasManyThroughQueryBuilderContract } from '@ioc:Adonis/Lucid/Relations';
import { HasManyThrough } from './index';
import { BaseQueryBuilder } from '../Base/QueryBuilder';
/**
 * Extends the model query builder for executing queries in scope
 * to the current relationship
 */
export declare class HasManyThroughQueryBuilder extends BaseQueryBuilder implements HasManyThroughQueryBuilderContract<LucidModel, LucidModel> {
    private parent;
    private relation;
    protected cherryPickingKeys: boolean;
    protected appliedConstraints: boolean;
    private throughTable;
    private relatedTable;
    constructor(builder: knex.QueryBuilder, client: QueryClientContract, parent: LucidRow | LucidRow[], relation: HasManyThrough);
    /**
     * Prefixes the through table name to a column
     */
    private prefixThroughTable;
    /**
     * Prefixes the related table name to a column
     */
    private prefixRelatedTable;
    /**
     * Adds where constraint to the pivot table
     */
    private addWhereConstraints;
    /**
     * Transforms the selected column names by prefixing the
     * table name
     */
    private transformRelatedTableColumns;
    /**
     * Profiler data for HasManyThrough relationship
     */
    protected profilerData(): {
        type: "hasManyThrough";
        model: string;
        throughModel: string;
        relatedModel: string;
    };
    /**
     * The keys for constructing the join query
     */
    protected getRelationKeys(): string[];
    /**
     * Applies constraint to limit rows to the current relationship
     * only.
     */
    protected applyConstraints(): void;
    /**
     * Select keys from the related table
     */
    select(...args: any): this;
    /**
     * Clones the current query
     */
    clone(): HasManyThroughQueryBuilder;
    /**
     * Paginate through rows inside a given table
     */
    paginate(page: number, perPage?: number): Promise<import("../../../Database/Paginator/SimplePaginator").SimplePaginator>;
    /**
     * Returns the group limit query
     */
    getGroupLimitQuery(): import("@ioc:Adonis/Lucid/Model").ModelQueryBuilderContract<LucidModel, LucidRow>;
}
