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
        const connection = this.driver.createConnection(this.getRuntimeConnectionSettings());
        connection.on('error', (err) => {
            connection.__knex__disposed = err;
        });
        connection.connect((err) => {
            if (err) {
                // if connection is rejected, remove listener that was registered
                // above...
                connection.removeAllListeners();
                return rejecter(err);
            }
            resolver(connection);
        });
    });
}
exports.acquireRawConnection = acquireRawConnection;
