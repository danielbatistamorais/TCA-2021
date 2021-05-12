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
exports.HasManyThrough = void 0;
const KeysExtractor_1 = require("../KeysExtractor");
const QueryClient_1 = require("./QueryClient");
const utils_1 = require("../../../utils");
/**
 * Manages loading and persisting has many through relationship
 */
class HasManyThrough {
    constructor(relationName, relatedModel, options, model) {
        this.relationName = relationName;
        this.relatedModel = relatedModel;
        this.options = options;
        this.model = model;
        this.type = 'hasManyThrough';
        this.booted = false;
        this.serializeAs = this.options.serializeAs === undefined ? this.relationName : this.options.serializeAs;
        this.throughModel = this.options.throughModel;
        /**
         * Reference to the onQuery hook defined by the user
         */
        this.onQueryHook = this.options.onQuery;
    }
    /**
     * Returns the alias for the through key
     */
    throughAlias(key) {
        return `through_${key}`;
    }
    /**
     * Boot the relationship and ensure that all keys are in
     * place for queries to do their job.
     */
    boot() {
        if (this.booted) {
            return;
        }
        /**
         * Extracting keys from the model and the relation model. The keys
         * extractor ensures all the required columns are defined on
         * the models for the relationship to work
         */
        const { localKey, foreignKey, throughLocalKey, throughForeignKey } = new KeysExtractor_1.KeysExtractor(this.model, this.relationName, {
            localKey: {
                model: this.model,
                key: this.options.localKey ||
                    this.model.$configurator.getLocalKey(this.type, this.model, this.relatedModel()),
            },
            foreignKey: {
                model: this.throughModel(),
                key: this.options.foreignKey ||
                    this.model.$configurator.getForeignKey(this.type, this.model, this.throughModel()),
            },
            throughLocalKey: {
                model: this.throughModel(),
                key: this.options.throughLocalKey ||
                    this.model.$configurator.getLocalKey(this.type, this.throughModel(), this.relatedModel()),
            },
            throughForeignKey: {
                model: this.relatedModel(),
                key: this.options.throughForeignKey ||
                    this.model.$configurator.getForeignKey(this.type, this.throughModel(), this.relatedModel()),
            },
        }).extract();
        /**
         * Keys on the parent model
         */
        this.localKey = localKey.attributeName;
        this.localKeyColumnName = localKey.columnName;
        /**
         * Keys on the through model
         */
        this.foreignKey = foreignKey.attributeName;
        this.foreignKeyColumnName = foreignKey.columnName;
        this.throughLocalKey = throughLocalKey.attributeName;
        this.throughLocalKeyColumnName = throughLocalKey.columnName;
        this.throughForeignKey = throughForeignKey.attributeName;
        this.throughForeignKeyColumnName = throughForeignKey.columnName;
        /**
         * Booted successfully
         */
        this.booted = true;
    }
    /**
     * Set related model instances
     */
    setRelated(parent, related) {
        utils_1.ensureRelationIsBooted(this);
        parent.$setRelated(this.relationName, related);
    }
    /**
     * Push related model instance(s)
     */
    pushRelated(parent, related) {
        utils_1.ensureRelationIsBooted(this);
        parent.$pushRelated(this.relationName, related);
    }
    /**
     * Finds and set the related model instances next to the parent
     * models.
     */
    setRelatedForMany(parent, related) {
        utils_1.ensureRelationIsBooted(this);
        const $foreignCastAsKeyAlias = this.throughAlias(this.foreignKeyColumnName);
        parent.forEach((parentModel) => {
            this.setRelated(parentModel, related.filter((relatedModel) => {
                const value = parentModel[this.localKey];
                return value !== undefined && relatedModel.$extras[$foreignCastAsKeyAlias] === value;
            }));
        });
    }
    /**
     * Returns an instance of query client for invoking queries
     */
    client(parent, client) {
        utils_1.ensureRelationIsBooted(this);
        return new QueryClient_1.HasManyThroughClient(this, parent, client);
    }
    /**
     * Returns instance of the eager query
     */
    eagerQuery(parent, client) {
        utils_1.ensureRelationIsBooted(this);
        return QueryClient_1.HasManyThroughClient.eagerQuery(client, this, parent);
    }
    /**
     * Returns instance of query builder
     */
    subQuery(client) {
        utils_1.ensureRelationIsBooted(this);
        return QueryClient_1.HasManyThroughClient.subQuery(client, this);
    }
}
exports.HasManyThrough = HasManyThrough;
