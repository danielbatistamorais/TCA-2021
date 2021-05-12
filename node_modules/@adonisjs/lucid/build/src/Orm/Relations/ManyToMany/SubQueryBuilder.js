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
exports.ManyToManySubQueryBuilder = void 0;
const PivotHelpers_1 = require("./PivotHelpers");
const SubQueryBuilder_1 = require("../Base/SubQueryBuilder");
/**
 * Exposes the API to construct sub queries for a many to many relationships
 */
class ManyToManySubQueryBuilder extends SubQueryBuilder_1.BaseSubQueryBuilder {
    constructor(builder, client, relation) {
        super(builder, client, relation, (userFn) => {
            return ($builder) => {
                const subQuery = new ManyToManySubQueryBuilder($builder, this.client, this.relation);
                subQuery.isChildQuery = true;
                userFn(subQuery);
            };
        });
        this.relation = relation;
        /**
         * Pivot helpers provides the implementation for pivot table constraints
         * and clauses
         */
        this.pivotHelpers = new PivotHelpers_1.PivotHelpers(this, false);
        /**
         * Reference to the related table
         */
        this.relatedTable = this.relation.relatedModel().table;
        /**
         * Whether or not the constraints has been applied
         */
        this.appliedConstraints = false;
        this.hasSelfRelation = this.relatedTable === this.relation.model.table;
    }
    /**
     * Prefixes the related table name to a column
     */
    prefixRelatedTable(column) {
        if (this.hasSelfRelation) {
            return `${this.selfJoinAlias}.${column}`;
        }
        return `${this.relatedTable}.${column}`;
    }
    /**
     * Transforms the selected column names by prefixing the
     * table name
     */
    transformRelatedTableColumns(columns) {
        return columns.map((column) => {
            if (typeof column === 'string') {
                return this.prefixRelatedTable(this.resolveKey(column));
            }
            return this.transformValue(column);
        });
    }
    /**
     * The keys for constructing the join query
     */
    getRelationKeys() {
        return [`${this.relation.relatedModel().table}.${this.relation.relatedKeyColumnName}`];
    }
    /**
     * Applies constraint to limit rows to the current relationship
     * only.
     */
    applyConstraints() {
        if (this.appliedConstraints) {
            return;
        }
        this.appliedConstraints = true;
        const localTable = this.relation.model.table;
        let tablePrefix = this.relatedTable;
        /**
         * In case of self joins, we must alias the table selection
         */
        if (this.relation.relatedModel() === this.relation.model) {
            this.knexQuery.from(`${this.relatedTable} as ${this.selfJoinAlias}`);
            tablePrefix = this.selfJoinAlias;
        }
        this.innerJoin(this.relation.pivotTable, `${tablePrefix}.${this.relation.relatedKeyColumnName}`, `${this.relation.pivotTable}.${this.relation.pivotRelatedForeignKey}`);
        this.where(`${localTable}.${this.relation.localKeyColumnName}`, this.client.ref(this.pivotHelpers.prefixPivotTable(this.relation.pivotForeignKey)));
    }
    /**
     * Select keys from the related table
     */
    select(...args) {
        let columns = args;
        if (Array.isArray(args[0])) {
            columns = args[0];
        }
        this.knexQuery.select(this.transformRelatedTableColumns(columns));
        return this;
    }
    /**
     * Add where clause with pivot table prefix
     */
    wherePivot(key, operator, value) {
        this.pivotHelpers.wherePivot('and', key, operator, value);
        return this;
    }
    /**
     * Add or where clause with pivot table prefix
     */
    orWherePivot(key, operator, value) {
        this.pivotHelpers.wherePivot('or', key, operator, value);
        return this;
    }
    /**
     * Alias for wherePivot
     */
    andWherePivot(key, operator, value) {
        return this.wherePivot(key, operator, value);
    }
    /**
     * Add where not pivot
     */
    whereNotPivot(key, operator, value) {
        this.pivotHelpers.wherePivot('not', key, operator, value);
        return this;
    }
    /**
     * Add or where not pivot
     */
    orWhereNotPivot(key, operator, value) {
        this.pivotHelpers.wherePivot('orNot', key, operator, value);
        return this;
    }
    /**
     * Alias for `whereNotPivot`
     */
    andWhereNotPivot(key, operator, value) {
        return this.whereNotPivot(key, operator, value);
    }
    /**
     * Adds where in clause
     */
    whereInPivot(key, value) {
        this.pivotHelpers.whereInPivot('and', key, value);
        return this;
    }
    /**
     * Adds or where in clause
     */
    orWhereInPivot(key, value) {
        this.pivotHelpers.whereInPivot('or', key, value);
        return this;
    }
    /**
     * Alias from `whereInPivot`
     */
    andWhereInPivot(key, value) {
        return this.whereInPivot(key, value);
    }
    /**
     * Adds where not in clause
     */
    whereNotInPivot(key, value) {
        this.pivotHelpers.whereInPivot('not', key, value);
        return this;
    }
    /**
     * Adds or where not in clause
     */
    orWhereNotInPivot(key, value) {
        this.pivotHelpers.whereInPivot('orNot', key, value);
        return this;
    }
    /**
     * Alias from `whereNotInPivot`
     */
    andWhereNotInPivot(key, value) {
        return this.whereNotInPivot(key, value);
    }
    /**
     * Select pivot columns
     */
    pivotColumns(columns) {
        this.pivotHelpers.pivotColumns(columns);
        return this;
    }
    /**
     * Clones the current query
     */
    clone() {
        const clonedQuery = new ManyToManySubQueryBuilder(this.knexQuery.clone(), this.client, this.relation);
        this.applyQueryFlags(clonedQuery);
        clonedQuery.appliedConstraints = this.appliedConstraints;
        return clonedQuery;
    }
}
exports.ManyToManySubQueryBuilder = ManyToManySubQueryBuilder;
