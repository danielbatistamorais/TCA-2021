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
exports.ManyToMany = void 0;
const KeysExtractor_1 = require("../KeysExtractor");
const QueryClient_1 = require("./QueryClient");
const utils_1 = require("../../../utils");
/**
 * Manages loading and persisting many to many relationship
 */
class ManyToMany {
    constructor(relationName, relatedModel, options, model) {
        this.relationName = relationName;
        this.relatedModel = relatedModel;
        this.options = options;
        this.model = model;
        this.type = 'manyToMany';
        this.booted = false;
        this.serializeAs = this.options.serializeAs === undefined ? this.relationName : this.options.serializeAs;
        this.extrasPivotColumns = this.options.pivotColumns || [];
        /**
         * Reference to the onQuery hook defined by the user
         */
        this.onQueryHook = this.options.onQuery;
    }
    /**
     * Returns the alias for the pivot key
     */
    pivotAlias(key) {
        return `pivot_${key}`;
    }
    /**
     * Boot the relationship and ensure that all keys are in
     * place for queries to do their job.
     */
    boot() {
        if (this.booted) {
            return;
        }
        const relatedModel = this.relatedModel();
        /**
         * Extracting keys from the model and the relation model. The keys
         * extractor ensures all the required columns are defined on
         * the models for the relationship to work
         */
        const { localKey, relatedKey } = new KeysExtractor_1.KeysExtractor(this.model, this.relationName, {
            localKey: {
                model: this.model,
                key: this.options.localKey ||
                    this.model.$configurator.getLocalKey(this.type, this.model, relatedModel),
            },
            relatedKey: {
                model: relatedModel,
                key: this.options.relatedKey ||
                    this.model.$configurator.getLocalKey(this.type, this.model, relatedModel),
            },
        }).extract();
        this.pivotTable =
            this.options.pivotTable ||
                this.model.$configurator.getPivotTableName(this.type, this.model, relatedModel, this.relationName);
        /**
         * Keys on the parent model
         */
        this.localKey = localKey.attributeName;
        this.localKeyColumnName = localKey.columnName;
        /**
         * Keys on the related model
         */
        this.relatedKey = relatedKey.attributeName;
        this.relatedKeyColumnName = relatedKey.columnName;
        /**
         * Parent model foreign key in the pivot table
         */
        this.pivotForeignKey =
            this.options.pivotForeignKey ||
                this.model.$configurator.getPivotForeignKey(this.type, this.model, relatedModel, this.relationName);
        /**
         * Related model foreign key in the pivot table
         */
        this.pivotRelatedForeignKey =
            this.options.pivotRelatedForeignKey ||
                this.model.$configurator.getPivotForeignKey(this.type, relatedModel, this.model, this.relationName);
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
        const pivotForeignKeyAlias = this.pivotAlias(this.pivotForeignKey);
        parent.forEach((parentModel) => {
            this.setRelated(parentModel, related.filter((relatedModel) => {
                const value = parentModel[this.localKey];
                return value !== undefined && relatedModel.$extras[pivotForeignKeyAlias] === value;
            }));
        });
    }
    /**
     * Returns an instance of query client for invoking queries
     */
    client(parent, client) {
        utils_1.ensureRelationIsBooted(this);
        return new QueryClient_1.ManyToManyQueryClient(this, parent, client);
    }
    /**
     * Returns an instance of eager query builder
     */
    eagerQuery(parent, client) {
        utils_1.ensureRelationIsBooted(this);
        return QueryClient_1.ManyToManyQueryClient.eagerQuery(client, this, parent);
    }
    /**
     * Returns instance of query builder
     */
    subQuery(client) {
        utils_1.ensureRelationIsBooted(this);
        return QueryClient_1.ManyToManyQueryClient.subQuery(client, this);
    }
    /**
     * Returns key-value pair for the pivot table in relation to the parent model
     */
    getPivotPair(parent) {
        return [this.pivotForeignKey, utils_1.getValue(parent, this.localKey, this, 'persist')];
    }
    /**
     * Returns key-value pair for the pivot table in relation to the related model
     */
    getPivotRelatedPair(related) {
        return [this.pivotRelatedForeignKey, utils_1.getValue(related, this.relatedKey, this, 'persist')];
    }
}
exports.ManyToMany = ManyToMany;
