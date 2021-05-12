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
exports.HasOneSubQueryBuilder = void 0;
const SubQueryBuilder_1 = require("../Base/SubQueryBuilder");
class HasOneSubQueryBuilder extends SubQueryBuilder_1.BaseSubQueryBuilder {
    constructor(builder, client, relation) {
        super(builder, client, relation, (userFn) => {
            return ($builder) => {
                const subQuery = new HasOneSubQueryBuilder($builder, this.client, this.relation);
                subQuery.isChildQuery = true;
                userFn(subQuery);
            };
        });
        this.relation = relation;
        this.appliedConstraints = false;
    }
    /**
     * The keys for constructing the join query
     */
    getRelationKeys() {
        return [this.relation.foreignKey];
    }
    /**
     * Clones the current query
     */
    clone() {
        const clonedQuery = new HasOneSubQueryBuilder(this.knexQuery.clone(), this.client, this.relation);
        this.applyQueryFlags(clonedQuery);
        clonedQuery.appliedConstraints = this.appliedConstraints;
        return clonedQuery;
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
        const relatedTable = this.relation.relatedModel().table;
        const localTable = this.relation.model.table;
        let tablePrefix = relatedTable;
        /**
         * In case of self joins, we must alias the table selection
         */
        if (relatedTable === localTable) {
            this.knexQuery.from(`${relatedTable} as ${this.selfJoinAlias}`);
            tablePrefix = this.selfJoinAlias;
        }
        this.where(`${localTable}.${this.relation.localKeyColumName}`, this.client.ref(`${tablePrefix}.${this.relation.foreignKeyColumName}`));
    }
}
exports.HasOneSubQueryBuilder = HasOneSubQueryBuilder;
