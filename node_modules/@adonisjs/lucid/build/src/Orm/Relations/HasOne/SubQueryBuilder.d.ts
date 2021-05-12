import knex from 'knex';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { RelationSubQueryBuilderContract } from '@ioc:Adonis/Lucid/Relations';
import { HasOne } from './index';
import { BaseSubQueryBuilder } from '../Base/SubQueryBuilder';
export declare class HasOneSubQueryBuilder extends BaseSubQueryBuilder implements RelationSubQueryBuilderContract<LucidModel> {
    private relation;
    protected appliedConstraints: boolean;
    constructor(builder: knex.QueryBuilder, client: QueryClientContract, relation: HasOne);
    /**
     * The keys for constructing the join query
     */
    protected getRelationKeys(): string[];
    /**
     * Clones the current query
     */
    clone(): HasOneSubQueryBuilder;
    /**
     * Applies constraint to limit rows to the current relationship
     * only.
     */
    protected applyConstraints(): void;
}
