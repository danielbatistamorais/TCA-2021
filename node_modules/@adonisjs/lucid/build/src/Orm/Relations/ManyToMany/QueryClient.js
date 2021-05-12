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
exports.ManyToManyQueryClient = void 0;
const QueryBuilder_1 = require("./QueryBuilder");
const SubQueryBuilder_1 = require("./SubQueryBuilder");
const utils_1 = require("../../../utils");
/**
 * Query client for executing queries in scope to the defined
 * relationship
 */
class ManyToManyQueryClient {
    constructor(relation, parent, client) {
        this.relation = relation;
        this.parent = parent;
        this.client = client;
    }
    /**
     * Generate a related query builder
     */
    static query(client, relation, rows) {
        const query = new QueryBuilder_1.ManyToManyQueryBuilder(client.knexQuery(), client, rows, relation);
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Generate a related eager query builder
     */
    static eagerQuery(client, relation, rows) {
        const query = new QueryBuilder_1.ManyToManyQueryBuilder(client.knexQuery(), client, rows, relation);
        query.isRelatedPreloadQuery = true;
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Returns an instance of the related sub query builder
     */
    static subQuery(client, relation) {
        const query = new SubQueryBuilder_1.ManyToManySubQueryBuilder(client.knexQuery(), client, relation);
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Generate a related pivot query builder
     */
    static pivotQuery(client, relation, rows) {
        const query = new QueryBuilder_1.ManyToManyQueryBuilder(client.knexQuery(), client, rows, relation);
        query.isRelatedPreloadQuery = false;
        query.isPivotOnlyQuery = true;
        typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
        return query;
    }
    /**
     * Returns query builder instance
     */
    query() {
        return ManyToManyQueryClient.query(this.client, this.relation, this.parent);
    }
    /**
     * Returns a query builder instance for the pivot table only
     */
    pivotQuery() {
        return ManyToManyQueryClient.pivotQuery(this.client, this.relation, this.parent);
    }
    /**
     * Save related model instance.
     */
    async save(related, checkExisting = true) {
        await utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            /**
             * Persist parent
             */
            this.parent.$trx = trx;
            await this.parent.save();
            /**
             * Persist related
             */
            related.$trx = trx;
            await related.save();
            /**
             * Sync when checkExisting = true, to avoid duplicate rows. Otherwise
             * perform insert
             */
            const [, relatedForeignKeyValue] = this.relation.getPivotRelatedPair(related);
            if (checkExisting) {
                await this.sync([relatedForeignKeyValue], false, trx);
            }
            else {
                await this.attach([relatedForeignKeyValue], trx);
            }
        });
    }
    /**
     * Save many of related model instances
     */
    async saveMany(related, checkExisting = true) {
        await utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            /**
             * Persist parent
             */
            this.parent.$trx = trx;
            await this.parent.save();
            /**
             * Persist all related models
             */
            for (let one of related) {
                one.$trx = trx;
                await one.save();
            }
            /**
             * Sync when checkExisting = true, to avoid duplicate rows. Otherwise
             * perform insert
             */
            const relatedForeignKeyValues = related.map((one) => this.relation.getPivotRelatedPair(one)[1]);
            if (checkExisting) {
                await this.sync(relatedForeignKeyValues, false, trx);
            }
            else {
                await this.attach(relatedForeignKeyValues, trx);
            }
        });
    }
    /**
     * Create and persist an instance of related model. Also makes the pivot table
     * entry to create the relationship
     */
    async create(values, checkExisting = true) {
        return utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            /**
             * Create and persist related model instance
             */
            const related = await this.relation.relatedModel().create(values, { client: trx });
            /**
             * Sync or attach a new one row
             */
            const [, relatedForeignKeyValue] = this.relation.getPivotRelatedPair(related);
            if (checkExisting) {
                await this.sync([relatedForeignKeyValue], false, trx);
            }
            else {
                await this.attach([relatedForeignKeyValue], trx);
            }
            return related;
        });
    }
    /**
     * Create and persist multiple of instances of related model. Also makes
     * the pivot table entries to create the relationship.
     */
    async createMany(values, checkExisting = true) {
        return utils_1.managedTransaction(this.parent.$trx || this.client, async (trx) => {
            this.parent.$trx = trx;
            await this.parent.save();
            /**
             * Create and persist related model instance
             */
            const related = await this.relation.relatedModel().createMany(values, { client: trx });
            /**
             * Sync or attach new rows
             */
            const relatedForeignKeyValues = related.map((one) => this.relation.getPivotRelatedPair(one)[1]);
            if (checkExisting) {
                await this.sync(relatedForeignKeyValues, false, trx);
            }
            else {
                await this.attach(relatedForeignKeyValues, trx);
            }
            return related;
        });
    }
    /**
     * Attach one or more related models using it's foreign key value
     * by performing insert inside the pivot table.
     */
    async attach(ids, trx) {
        /**
         * Pivot foreign key value (On the parent model)
         */
        const [, foreignKeyValue] = this.relation.getPivotPair(this.parent);
        /**
         * Finding if `ids` parameter is an object or not
         */
        const hasAttributes = !Array.isArray(ids);
        /**
         * Extracting pivot related foreign keys (On the related model)
         */
        const pivotRows = (!hasAttributes ? ids : Object.keys(ids)).map((id) => {
            return Object.assign({}, hasAttributes ? ids[id] : {}, {
                [this.relation.pivotForeignKey]: foreignKeyValue,
                [this.relation.pivotRelatedForeignKey]: id,
            });
        });
        if (!pivotRows.length) {
            return;
        }
        /**
         * Perform bulk insert
         */
        const query = trx ? trx.insertQuery() : this.client.insertQuery();
        await query.table(this.relation.pivotTable).multiInsert(pivotRows);
    }
    /**
     * Detach related ids from the pivot table
     */
    async detach(ids, trx) {
        const query = this.pivotQuery();
        /**
         * Scope deletion to specific rows when `id` is defined. Otherwise
         * delete all the rows
         */
        if (ids && ids.length) {
            query.whereInPivot(this.relation.pivotRelatedForeignKey, ids);
        }
        /**
         * Use transaction when defined
         */
        if (trx) {
            query.useTransaction(trx);
        }
        await query.del();
    }
    /**
     * Sync pivot rows by
     *
     * - Dropping the non-existing one's.
     * - Creating the new one's.
     * - Updating the existing one's with different attributes.
     */
    async sync(ids, detach = true, trx) {
        await utils_1.managedTransaction(trx || this.client, async (transaction) => {
            const hasAttributes = !Array.isArray(ids);
            /**
             * An object of pivot rows from from the incoming ids or
             * an object of key-value pair.
             */
            const pivotRows = !hasAttributes
                ? ids.reduce((result, id) => {
                    result[id] = {};
                    return result;
                }, {})
                : ids;
            const query = this.pivotQuery().useTransaction(transaction);
            /**
             * We must scope the select query to related foreign key when ids
             * is an array and not an object. This will help in performance
             * when their are indexes defined on this key
             */
            if (!hasAttributes) {
                query.select(this.relation.pivotRelatedForeignKey);
            }
            const pivotRelatedForeignKeys = Object.keys(pivotRows);
            /**
             * Fetch existing pivot rows for the relationship
             */
            const existingPivotRows = await query
                .whereIn(this.relation.pivotRelatedForeignKey, pivotRelatedForeignKeys)
                .exec();
            /**
             * Find a diff of rows being removed, added or updated in comparison
             * to the existing pivot rows.
             */
            const { added, updated } = utils_1.syncDiff(existingPivotRows.reduce((result, row) => {
                result[row[this.relation.pivotRelatedForeignKey]] = row;
                return result;
            }, {}), pivotRows);
            /**
             * Add new rows
             */
            await this.attach(added, transaction);
            /**
             * Update
             */
            for (let id of Object.keys(updated)) {
                const attributes = updated[id];
                if (!attributes) {
                    return Promise.resolve();
                }
                await this.pivotQuery()
                    .useTransaction(transaction)
                    .wherePivot(this.relation.pivotRelatedForeignKey, id)
                    .update(attributes);
            }
            /**
             * Return early when detach is disabled.
             */
            if (!detach) {
                return;
            }
            /**
             * Detach everything except the synced ids
             */
            await this.pivotQuery()
                .useTransaction(transaction)
                .whereNotInPivot(this.relation.pivotRelatedForeignKey, pivotRelatedForeignKeys)
                .del();
        });
    }
}
exports.ManyToManyQueryClient = ManyToManyQueryClient;
