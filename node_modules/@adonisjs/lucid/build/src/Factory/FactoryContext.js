"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryContext = void 0;
const faker_1 = __importDefault(require("faker"));
class FactoryContext {
    constructor(isStubbed, $trx) {
        this.isStubbed = isStubbed;
        this.$trx = $trx;
        this.faker = faker_1.default;
    }
}
exports.FactoryContext = FactoryContext;
