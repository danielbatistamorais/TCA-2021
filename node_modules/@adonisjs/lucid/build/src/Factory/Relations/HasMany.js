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
exports.HasMany = void 0;
const Base_1 = require("./Base");
/**
 * Has many to factory relation
 */
class HasMany extends Base_1.BaseRelation {
    constructor(relation, factory) {
        super(factory);
        this.relation = relation;
        this.relation.boot();
    }
    /**
     * Make relationship and set it on the parent model instance
     */
    async make(parent, callback, count) {
        const factory = this.compile(callback);
        const customAttributes = {};
        this.relation.hydrateForPersistance(parent, customAttributes);
        const instances = await factory.makeStubbedMany(count || 1, (related) => {
            related.merge(customAttributes);
        });
        parent.$setRelated(this.relation.relationName, instances);
    }
    /**
     * Persist relationship and set it on the parent model instance
     */
    async create(parent, callback, count) {
        const factory = this.compile(callback);
        const customAttributes = {};
        this.relation.hydrateForPersistance(parent, customAttributes);
        const instance = await factory.createMany(count || 1, (related) => {
            related.merge(customAttributes);
        });
        parent.$setRelated(this.relation.relationName, instance);
    }
}
exports.HasMany = HasMany;
