import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
import { LucidRow, LucidModel, ModelAdapterOptions } from '@ioc:Adonis/Lucid/Model';
import { FactoryModelContract, FactoryContextContract, FactoryBuilderContract } from '@ioc:Adonis/Lucid/Factory';
import { FactoryModel } from './FactoryModel';
/**
 * Factory builder exposes the API to create/persist factory model instances.
 */
export declare class FactoryBuilder implements FactoryBuilderContract<FactoryModelContract<LucidModel>> {
    model: FactoryModel<LucidModel>;
    private options?;
    /**
     * Relationships to setup. Do note: It is possible to load one relationship
     * twice. A practical use case is to apply different states. For example:
     *
     * Make user with "3 active posts" and "2 draft posts"
     */
    private withRelations;
    /**
     * Belongs to relationships are treated different, since they are
     * persisted before the parent model
     */
    private withBelongsToRelations;
    /**
     * The current index. Updated by `makeMany` and `createMany`
     */
    private currentIndex;
    /**
     * Custom attributes to pass to model merge method
     */
    private attributes;
    /**
     * States to apply. One state can be applied only once and hence
     * a set is used.
     */
    private appliedStates;
    /**
     * Custom context passed using `useCtx` method. It not defined, we will
     * create one inline inside `create` and `make` methods
     */
    private ctx?;
    /**
     * Instead of relying on the `FactoryModelContract`, we rely on the
     * `FactoryModel`, since it exposes certain API's required for
     * the runtime operations and those API's are not exposed
     * on the interface to keep the API clean
     */
    constructor(model: FactoryModel<LucidModel>, options?: ModelAdapterOptions | undefined);
    /**
     * Returns factory state
     */
    private getCtx;
    /**
     * Returns attributes to merge for a given index
     */
    private getMergeAttributes;
    /**
     * Returns a new model instance with filled attributes
     */
    private getModelInstance;
    /**
     * Apply states by invoking state callback
     */
    private applyStates;
    /**
     * Compile factory by instantiating model instance, applying merge
     * attributes, apply state
     */
    private compile;
    /**
     * Makes relationship instances. Call [[createRelation]] to
     * also persist them.
     */
    private makeRelations;
    /**
     * Makes and persists relationship instances
     */
    private createRelations;
    /**
     * Define custom database connection
     */
    connection(connection: string): this;
    /**
     * Define custom query client
     */
    client(client: QueryClientContract): this;
    /**
     * Define custom context. Usually called by the relationships
     * to share the parent context with relationship factory
     */
    useCtx(ctx: FactoryContextContract): this;
    /**
     * Load relationship
     */
    with(name: string, count?: number, callback?: (factory: never) => void): this;
    /**
     * Apply one or more states. Multiple calls to apply a single
     * state will be ignored
     */
    apply(...states: string[]): this;
    /**
     * Fill custom set of attributes. They are passed down to the newUp
     * method of the factory
     */
    merge(attributes: any): this;
    /**
     * Make model instance. Relationships are not processed with the make function.
     */
    make(callback?: (model: LucidRow, ctx: FactoryContextContract) => void): Promise<LucidRow>;
    /**
     * Returns a model instance without persisting it to the database.
     * Relationships are still loaded and states are also applied.
     */
    makeStubbed(callback?: (model: LucidRow, ctx: FactoryContextContract) => void): Promise<LucidRow>;
    /**
     * Similar to make, but also persists the model instance to the
     * database.
     */
    create(callback?: (model: LucidRow, ctx: FactoryContextContract) => void): Promise<LucidRow>;
    /**
     * Create many of factory model instances
     */
    makeStubbedMany(count: number, callback?: (model: LucidRow, ctx: FactoryContextContract) => void): Promise<LucidRow[]>;
    /**
     * Create and persist many of factory model instances
     */
    createMany(count: number, callback?: (model: LucidRow, state: FactoryContextContract) => void): Promise<LucidRow[]>;
    /**
     * Create many of the factory model instances
     */
    makeMany(count: number, callback?: (model: LucidRow, state: FactoryContextContract) => void): Promise<LucidRow[]>;
}
