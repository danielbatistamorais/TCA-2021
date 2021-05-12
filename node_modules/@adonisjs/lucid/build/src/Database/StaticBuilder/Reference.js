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
exports.ReferenceBuilder = void 0;
/**
 * Reference builder to create SQL reference values
 */
class ReferenceBuilder {
    constructor(ref) {
        this.ref = ref;
    }
    /**
     * Define schema
     */
    withSchema(schema) {
        this.schema = schema;
        return this;
    }
    /**
     * Define alias
     */
    as(alias) {
        this.alias = alias;
        return this;
    }
    /**
     * Converts reference to knex
     */
    toKnex(client) {
        const ref = client.ref(this.ref);
        this.schema && ref.withSchema(this.schema);
        this.alias && ref.as(this.alias);
        return ref;
    }
}
exports.ReferenceBuilder = ReferenceBuilder;
