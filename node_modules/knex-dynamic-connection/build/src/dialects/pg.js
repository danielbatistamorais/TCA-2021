"use strict";
/*
* knex-dynamic-connection
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copy of `acquireRawConnection` from knex codebase, but instead relies
 * on `getRuntimeConnectionSettings` vs `connectionSettings`
 */
/* eslint no-shadow: "off" */
function acquireRawConnection() {
    const client = this;
    return new Promise((resolver, rejecter) => {
        const connection = new client.driver.Client(client.getRuntimeConnectionSettings());
        connection.connect((err, connection) => {
            if (err) {
                return rejecter(err);
            }
            connection.on('error', (err) => {
                connection.__knex__disposed = err;
            });
            connection.on('end', (err) => {
                connection.__knex__disposed = err || 'Connection ended unexpectedly';
            });
            if (!client.version) {
                return client.checkVersion(connection).then((version) => {
                    client.version = version;
                    resolver(connection);
                });
            }
            resolver(connection);
        });
    })
        .then(function setSearchPath(connection) {
        client.setSchemaSearchPath(connection);
        return connection;
    });
}
exports.acquireRawConnection = acquireRawConnection;
