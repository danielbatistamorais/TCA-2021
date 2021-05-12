import { ManyToManyRelationContract } from '@ioc:Adonis/Lucid/Relations';
import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Model';
import { RelationCallback, FactoryModelContract, FactoryRelationContract, FactoryBuilderQueryContract } from '@ioc:Adonis/Lucid/Factory';
import { BaseRelation } from './Base';
/**
 * Many to many factory relation
 */
export declare class ManyToMany extends BaseRelation implements FactoryRelationContract {
    relation: ManyToManyRelationContract<LucidModel, LucidModel>;
    constructor(relation: ManyToManyRelationContract<LucidModel, LucidModel>, factory: () => FactoryBuilderQueryContract<FactoryModelContract<LucidModel>>);
    /**
     * Make relationship and set it on the parent model instance
     */
    make(parent: LucidRow, callback?: RelationCallback, count?: number): Promise<void>;
    /**
     * Persist relationship and set it on the parent model instance
     */
    create(parent: LucidRow, callback?: RelationCallback, count?: number): Promise<void>;
}
