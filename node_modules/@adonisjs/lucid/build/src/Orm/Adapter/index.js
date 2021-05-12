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
exports.Adapter = void 0;
/**
 * Adapter exposes the API to make database queries and constructor
 * model instances from it.
 */
class Adapter {
    constructor(db) {
        this.db = db;
    }
    /**
     * Returns the query client based upon the model instance
     */
    modelConstructorClient(modelConstructor, options) {
        if (options && options.client) {
            return options.client;
        }
        const connection = (options && options.connection) || modelConstructor.connection;
        const profiler = options && options.profiler;
        return this.db.connection(connection, { profiler });
    }
    /**
     * Returns the model query builder instance for a given model
     */
    query(modelConstructor, options) {
        const client = this.modelConstructorClient(modelConstructor, options);
        return client.modelQuery(modelConstructor);
    }
    /**
     * Returns query client for a model instance by inspecting it's options
     */
    modelClient(instance) {
        const modelConstructor = instance.constructor;
        return instance.$trx
            ? instance.$trx
            : this.modelConstructorClient(modelConstructor, instance.$options);
    }
    /**
     * Perform insert query on a given model instance
     */
    async insert(instance, attributes) {
        const modelConstructor = instance.constructor;
        const query = instance.$getQueryFor('insert', this.modelClient(instance));
        const primaryKeyColumnName = modelConstructor.$keys.attributesToColumns.get(modelConstructor.primaryKey, modelConstructor.primaryKey);
        const result = await query.insert(attributes).reporterData({ model: modelConstructor.name });
        if (!modelConstructor.selfAssignPrimaryKey) {
            instance.$consumeAdapterResult({ [primaryKeyColumnName]: result[0] });
        }
    }
    /**
     * Perform update query on a given model instance
     */
    async update(instance, dirty) {
        await instance.$getQueryFor('update', this.modelClient(instance)).update(dirty);
    }
    /**
     * Perform delete query on a given model instance
     */
    async delete(instance) {
        await instance.$getQueryFor('delete', this.modelClient(instance)).del();
    }
}
exports.Adapter = Adapter;
