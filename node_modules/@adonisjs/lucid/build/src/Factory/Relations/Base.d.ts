/// <reference path="../../../adonis-typings/factory.d.ts" />
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import { RelationCallback, FactoryModelContract, FactoryContextContract, FactoryBuilderQueryContract } from '@ioc:Adonis/Lucid/Factory';
/**
 * Base relation to be extended by other factory relations
 */
export declare abstract class BaseRelation {
    private factory;
    protected ctx: FactoryContextContract;
    constructor(factory: () => FactoryBuilderQueryContract<FactoryModelContract<LucidModel>>);
    /**
     * Instantiates the relationship factory
     */
    protected compile(callback?: RelationCallback): import("@ioc:Adonis/Lucid/Factory").FactoryBuilderContract<FactoryModelContract<LucidModel>>;
    /**
     * Use custom ctx. This must always be called by the factory, otherwise
     * `make` and `create` calls will fail.
     */
    useCtx(ctx: FactoryContextContract): this;
}
