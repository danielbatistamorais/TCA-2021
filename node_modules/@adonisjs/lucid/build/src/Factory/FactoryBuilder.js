"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryBuilder = void 0;
const FactoryContext_1 = require("./FactoryContext");
/**
 * Factory builder exposes the API to create/persist factory model instances.
 */
class FactoryBuilder {
    /**
     * Instead of relying on the `FactoryModelContract`, we rely on the
     * `FactoryModel`, since it exposes certain API's required for
     * the runtime operations and those API's are not exposed
     * on the interface to keep the API clean
     */
    constructor(model, options) {
        this.model = model;
        this.options = options;
        /**
         * Relationships to setup. Do note: It is possible to load one relationship
         * twice. A practical use case is to apply different states. For example:
         *
         * Make user with "3 active posts" and "2 draft posts"
         */
        this.withRelations = [];
        /**
         * Belongs to relationships are treated different, since they are
         * persisted before the parent model
         */
        this.withBelongsToRelations = [];
        /**
         * The current index. Updated by `makeMany` and `createMany`
         */
        this.currentIndex = 0;
        /**
         * States to apply. One state can be applied only once and hence
         * a set is used.
         */
        this.appliedStates = new Set();
    }
    /**
     * Returns factory state
     */
    async getCtx(isStubbed) {
        if (isStubbed === true) {
            return new FactoryContext_1.FactoryContext(isStubbed, undefined);
        }
        const client = this.model.model.$adapter.modelConstructorClient(this.model.model, this.options);
        const trx = await client.transaction();
        return new FactoryContext_1.FactoryContext(isStubbed, trx);
    }
    /**
     * Returns attributes to merge for a given index
     */
    getMergeAttributes(index) {
        return Array.isArray(this.attributes) ? this.attributes[index] : this.attributes;
    }
    /**
     * Returns a new model instance with filled attributes
     */
    async getModelInstance(ctx) {
        const modelAttributes = await this.model.define(ctx);
        const modelInstance = this.model.newUpModelInstance(modelAttributes, ctx);
        this.model.mergeAttributes(modelInstance, this.getMergeAttributes(this.currentIndex), ctx);
        return modelInstance;
    }
    /**
     * Apply states by invoking state callback
     */
    async applyStates(modelInstance, ctx) {
        for (let state of this.appliedStates) {
            await this.model.getState(state)(modelInstance, ctx);
        }
    }
    /**
     * Compile factory by instantiating model instance, applying merge
     * attributes, apply state
     */
    async compile(isStubbed, callback) {
        /**
         * Use pre-defined ctx or create a new one
         */
        const ctx = this.ctx || (await this.getCtx(isStubbed));
        /**
         * Newup the model instance
         */
        const modelInstance = await this.getModelInstance(ctx);
        /**
         * Apply state
         */
        this.applyStates(modelInstance, ctx);
        /**
         * Invoke custom callback (if defined)
         */
        typeof callback === 'function' && callback(modelInstance, ctx);
        return {
            modelInstance,
            ctx,
        };
    }
    /**
     * Makes relationship instances. Call [[createRelation]] to
     * also persist them.
     */
    async makeRelations(modelInstance, ctx) {
        for (let { name, count, callback } of this.withRelations) {
            const relation = this.model.getRelation(name);
            await relation.useCtx(ctx).make(modelInstance, callback, count);
        }
    }
    /**
     * Makes and persists relationship instances
     */
    async createRelations(modelInstance, ctx, cycle) {
        const relationships = cycle === 'before' ? this.withBelongsToRelations : this.withRelations;
        for (let { name, count, callback } of relationships) {
            const relation = this.model.getRelation(name);
            await relation.useCtx(ctx).create(modelInstance, callback, count);
        }
    }
    /**
     * Define custom database connection
     */
    connection(connection) {
        this.options = this.options || {};
        this.options.connection = connection;
        return this;
    }
    /**
     * Define custom query client
     */
    client(client) {
        this.options = this.options || {};
        this.options.client = client;
        return this;
    }
    /**
     * Define custom context. Usually called by the relationships
     * to share the parent context with relationship factory
     */
    useCtx(ctx) {
        this.ctx = ctx;
        return this;
    }
    /**
     * Load relationship
     */
    with(name, count, callback) {
        const relation = this.model.getRelation(name);
        if (relation.relation.type === 'belongsTo') {
            this.withBelongsToRelations.push({ name, count, callback });
            return this;
        }
        this.withRelations.push({ name, count, callback });
        return this;
    }
    /**
     * Apply one or more states. Multiple calls to apply a single
     * state will be ignored
     */
    apply(...states) {
        states.forEach((state) => this.appliedStates.add(state));
        return this;
    }
    /**
     * Fill custom set of attributes. They are passed down to the newUp
     * method of the factory
     */
    merge(attributes) {
        this.attributes = attributes;
        return this;
    }
    /**
     * Make model instance. Relationships are not processed with the make function.
     */
    async make(callback) {
        const { modelInstance, ctx } = await this.compile(true, callback);
        await this.model.hooks.exec('after', 'make', this, modelInstance, ctx);
        return modelInstance;
    }
    /**
     * Returns a model instance without persisting it to the database.
     * Relationships are still loaded and states are also applied.
     */
    async makeStubbed(callback) {
        const { modelInstance, ctx } = await this.compile(true, callback);
        await this.model.hooks.exec('after', 'make', this, modelInstance, ctx);
        await this.model.hooks.exec('before', 'makeStubbed', this, modelInstance, ctx);
        const id = modelInstance.$primaryKeyValue || this.model.manager.getNextId(modelInstance);
        modelInstance[this.model.model.primaryKey] = id;
        /**
         * Make relationships. The relationships will be not persisted
         */
        await this.makeRelations(modelInstance, ctx);
        /**
         * Fire the after hook
         */
        await this.model.hooks.exec('after', 'makeStubbed', this, modelInstance, ctx);
        return modelInstance;
    }
    /**
     * Similar to make, but also persists the model instance to the
     * database.
     */
    async create(callback) {
        const { modelInstance, ctx } = await this.compile(false, callback);
        await this.model.hooks.exec('after', 'make', this, modelInstance, ctx);
        /**
         * Fire the before hook
         */
        await this.model.hooks.exec('before', 'create', this, modelInstance, ctx);
        try {
            modelInstance.$trx = ctx.$trx;
            /**
             * Create belongs to relationships before calling the save method. Even though
             * we can update the foriegn key after the initial insert call, we avoid it
             * for cases, where FK is a not nullable.
             */
            await this.createRelations(modelInstance, ctx, 'before');
            /**
             * Persist model instance
             */
            await modelInstance.save();
            /**
             * Create relationships.
             */
            await this.createRelations(modelInstance, ctx, 'after');
            /**
             * Fire after hook before the transaction is committed, so that
             * hook can run db operations using the same transaction
             */
            await this.model.hooks.exec('after', 'create', this, modelInstance, ctx);
            if (!this.ctx && ctx.$trx) {
                await ctx.$trx.commit();
            }
            return modelInstance;
        }
        catch (error) {
            if (!this.ctx && ctx.$trx) {
                await ctx.$trx.rollback();
            }
            throw error;
        }
    }
    /**
     * Create many of factory model instances
     */
    async makeStubbedMany(count, callback) {
        let modelInstances = [];
        const counter = new Array(count).fill(0).map((_, i) => i);
        for (let index of counter) {
            this.currentIndex = index;
            modelInstances.push(await this.makeStubbed(callback));
        }
        return modelInstances;
    }
    /**
     * Create and persist many of factory model instances
     */
    async createMany(count, callback) {
        let modelInstances = [];
        const counter = new Array(count).fill(0).map((_, i) => i);
        for (let index of counter) {
            this.currentIndex = index;
            modelInstances.push(await this.create(callback));
        }
        return modelInstances;
    }
    /**
     * Create many of the factory model instances
     */
    async makeMany(count, callback) {
        let modelInstances = [];
        const counter = new Array(count).fill(0).map((_, i) => i);
        for (let index of counter) {
            this.currentIndex = index;
            modelInstances.push(await this.make(callback));
        }
        return modelInstances;
    }
}
exports.FactoryBuilder = FactoryBuilder;
