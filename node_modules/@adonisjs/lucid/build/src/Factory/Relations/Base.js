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
exports.BaseRelation = void 0;
/**
 * Base relation to be extended by other factory relations
 */
class BaseRelation {
    constructor(factory) {
        this.factory = factory;
    }
    /**
     * Instantiates the relationship factory
     */
    compile(callback) {
        const factory = this.factory().query();
        if (typeof callback === 'function') {
            callback(factory);
        }
        factory.useCtx(this.ctx);
        return factory;
    }
    /**
     * Use custom ctx. This must always be called by the factory, otherwise
     * `make` and `create` calls will fail.
     */
    useCtx(ctx) {
        this.ctx = ctx;
        return this;
    }
}
exports.BaseRelation = BaseRelation;
