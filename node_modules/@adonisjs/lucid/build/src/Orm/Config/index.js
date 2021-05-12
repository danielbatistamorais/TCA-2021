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
exports.Config = void 0;
const utils_1 = require("@poppinss/utils");
const pluralize_1 = require("pluralize");
/**
 * The default config for constructing ORM defaults
 */
exports.Config = {
    /**
     * Returns the table name for a given model
     */
    getTableName(model) {
        return pluralize_1.plural(utils_1.lodash.snakeCase(model.name));
    },
    /**
     * Returns the column name for a given model attribute
     */
    getColumnName(_, key) {
        return utils_1.lodash.snakeCase(key);
    },
    /**
     * Returns the serialized key (toJSON key) name for a given attribute.
     */
    getSerializeAsKey(_, key) {
        return utils_1.lodash.snakeCase(key);
    },
    /**
     * Returns the local key for a given relationship
     */
    getLocalKey(relation, model, related) {
        if (relation === 'belongsTo') {
            return related.primaryKey;
        }
        return model.primaryKey;
    },
    /**
     * Returns the foreign key for a given relationship
     */
    getForeignKey(relation, model, related) {
        if (relation === 'belongsTo') {
            return utils_1.lodash.camelCase(`${related.name}_${related.primaryKey}`);
        }
        return utils_1.lodash.camelCase(`${model.name}_${model.primaryKey}`);
    },
    /**
     * Returns the pivot table name for manyToMany relationship
     */
    getPivotTableName(_, model, relatedModel) {
        return utils_1.lodash.snakeCase([relatedModel.name, model.name].sort().join('_'));
    },
    /**
     * Returns the pivot foreign key for manyToMany relationship
     */
    getPivotForeignKey(_, model) {
        return utils_1.lodash.snakeCase(`${model.name}_${model.primaryKey}`);
    },
};
