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
exports.HasOne = void 0;
const KeysExtractor_1 = require("../KeysExtractor");
const QueryClient_1 = require("./QueryClient");
const utils_1 = require("../../../utils");
/**
 * Manages loading and persisting has one relationship
 */
class HasOne {
    constructor(relationName, relatedModel, options, model) {
        this.relationName = relationName;
        this.relatedModel = relatedModel;
        this.options = options;
        this.model = model;
        this.type = 'hasOne';
        this.booted = false;
        this.serializeAs = this.options.serializeAs === undefined ? this.relationName : this.options.serializeAs;
        /**
         * Reference to the onQuery hook defined by the user
         */
        this.onQueryHook = this.options.onQuery;
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
        const { localKey, foreignKey } = new KeysExtractor_1.KeysExtractor(this.model, this.relationName, {
            localKey: {
                model: this.model,
                key: this.options.localKey ||
                    this.model.$configurator.getLocalKey(this.type, this.model, relatedModel),
            },
            foreignKey: {
                model: relatedModel,
                key: this.options.foreignKey ||
                    this.model.$configurator.getForeignKey(this.type, this.model, relatedModel),
            },
        }).extract();
        /**
         * Keys on the parent model
         */
        this.localKey = localKey.attributeName;
        this.localKeyColumName = localKey.columnName;
        /**
         * Keys on the related model
         */
        this.foreignKey = foreignKey.attributeName;
        this.foreignKeyColumName = foreignKey.columnName;
        /**
         * Booted successfully
         */
        this.booted = true;
    }
    /**
     * Set related model instance
     */
    setRelated(parent, related) {
        utils_1.ensureRelationIsBooted(this);
        if (!related) {
            return;
        }
        parent.$setRelated(this.relationName, related);
    }
    /**
     * Push related model instance
     */
    pushRelated(parent, related) {
        utils_1.ensureRelationIsBooted(this);
        if (!related) {
            return;
        }
        parent.$pushRelated(this.relationName, related);
    }
    /**
     * Finds and set the related model instance next to the parent
     * models.
     */
    setRelatedForMany(parent, related) {
        utils_1.ensureRelationIsBooted(this);
        /**
         * The related model will always be equal or less than the parent
         * models. So we loop over them to lower down the number of
         * iterations.
         */
        related.forEach((relatedModel) => {
            const match = parent.find((parentModel) => {
                const value = parentModel[this.localKey];
                return value !== undefined && value === relatedModel[this.foreignKey];
            });
            if (match) {
                this.setRelated(match, relatedModel);
            }
        });
    }
    /**
     * Returns an instance of query client for invoking queries
     */
    client(parent, client) {
        utils_1.ensureRelationIsBooted(this);
        return new QueryClient_1.HasOneQueryClient(this, parent, client);
    }
    /**
     * Returns eager query instance
     */
    eagerQuery(parent, client) {
        utils_1.ensureRelationIsBooted(this);
        return QueryClient_1.HasOneQueryClient.eagerQuery(client, this, parent);
    }
    /**
     * Returns instance of query builder
     */
    subQuery(client) {
        utils_1.ensureRelationIsBooted(this);
        return QueryClient_1.HasOneQueryClient.subQuery(client, this);
    }
    /**
     * Hydrates values object for persistance.
     */
    hydrateForPersistance(parent, values) {
        values[this.foreignKey] = utils_1.getValue(parent, this.localKey, this, 'persist');
    }
}
exports.HasOne = HasOne;
