import { Hooks } from '@poppinss/hooks';
import { LucidRow, LucidModel } from '@ioc:Adonis/Lucid/Model';
import { ExtractModelRelations } from '@ioc:Adonis/Lucid/Relations';
import { EventsList, HooksHandler, StateCallback, MergeCallback, NewUpCallback, DefineCallback, FactoryModelContract, FactoryRelationContract, FactoryBuilderQueryContract } from '@ioc:Adonis/Lucid/Factory';
import { FactoryManager } from './index';
/**
 * Factory model exposes the API to define a model factory with custom
 * states and relationships
 */
export declare class FactoryModel<Model extends LucidModel> implements FactoryModelContract<Model> {
    model: Model;
    define: DefineCallback<LucidModel>;
    manager: FactoryManager;
    /**
     * Method to instantiate a new model instance. This method can be
     * overridden using the `newUp` public method.
     */
    newUpModelInstance: NewUpCallback<FactoryModelContract<LucidModel>>;
    /**
     * Method to merge runtime attributes with the model instance. This method
     * can be overridden using the `merge` method.
     */
    mergeAttributes: MergeCallback<FactoryModelContract<LucidModel>>;
    /**
     * A collection of factory states
     */
    states: {
        [key: string]: StateCallback<LucidRow>;
    };
    /**
     * A collection of factory relations
     */
    relations: {
        [relation: string]: FactoryRelationContract;
    };
    /**
     * A set of registered hooks
     */
    hooks: Hooks;
    constructor(model: Model, define: DefineCallback<LucidModel>, manager: FactoryManager);
    /**
     * Register a before event hook
     */
    before(event: EventsList, handler: HooksHandler<FactoryModelContract<Model>>): this;
    /**
     * Register an after event hook
     */
    after(event: EventsList, handler: HooksHandler<FactoryModelContract<Model>>): this;
    /**
     * Returns state callback defined on the model factory. Raises an
     * exception, when state is not registered
     */
    getState(state: string): StateCallback<LucidRow>;
    /**
     * Returns the pre-registered relationship factory function, along with
     * the original model relation.
     */
    getRelation(relation: string): FactoryRelationContract;
    /**
     * Define custom state for the factory. When executing the factory,
     * you can apply the pre-defined states
     */
    state(state: string, callback: StateCallback<InstanceType<Model>>): any;
    /**
     * Define a relationship on another factory
     */
    relation<K extends ExtractModelRelations<InstanceType<Model>>>(relation: Extract<K, string>, callback: any): any;
    /**
     * Define a custom `newUp` method
     */
    newUp(callback: NewUpCallback<FactoryModelContract<LucidModel>>): this;
    /**
     * Define a custom `merge` method
     */
    merge(callback: MergeCallback<FactoryModelContract<any>>): this;
    /**
     * Build factory model and return factory builder. The builder is then
     * used to make/create model instances
     */
    build(): FactoryBuilderQueryContract<FactoryModelContract<Model>>;
}
