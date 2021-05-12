"use strict";
/*
* knex-dynamic-connection
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
const bluebird_1 = __importDefault(require("bluebird"));
/**
 * Copy of `acquireRawConnection` from knex codebase, but instead relies
 * on `getRuntimeConnectionSettings` vs `connectionSettings`
 */
function acquireRawConnection() {
    return new bluebird_1.default((resolver, rejecter) => {
        const settings = Object.assign({}, this.getRuntimeConnectionSettings());
        settings.pool = this.mssqlPoolSettings;
        const connection = new this.driver.ConnectionPool(settings);
        connection.connect((err) => {
            if (err) {
                return rejecter(err);
            }
            connection.on('error', (error) => {
                connection.__knex__disposed = error;
            });
            resolver(connection);
        });
    });
}
exports.acquireRawConnection = acquireRawConnection;
