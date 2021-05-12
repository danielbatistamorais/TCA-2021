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
const stream_1 = __importDefault(require("stream"));
const bluebird_1 = __importDefault(require("bluebird"));
const utils_1 = require("knex/lib/dialects/oracledb/utils");
/**
 * Copied from the source code of knex
 */
/* eslint no-shadow: "off" */
function readStream(stream, cb) {
    const oracledb = require('oracledb');
    let data = '';
    if (stream.iLob.type === oracledb.CLOB) {
        stream.setEncoding('utf-8');
    }
    else {
        data = Buffer.alloc(0);
    }
    stream.on('error', (err) => {
        cb(err);
    });
    stream.on('data', (chunk) => {
        if (stream.iLob.type === oracledb.CLOB) {
            data += chunk;
        }
        else {
            data = Buffer.concat([data, chunk]);
        }
    });
    stream.on('end', () => {
        cb(null, data);
    });
}
/**
 * Copy of `acquireRawConnection` from knex codebase, but instead relies
 * on `getRuntimeConnectionSettings` vs `connectionSettings`
 */
function acquireRawConnection() {
    const client = this;
    const asyncConnection = new bluebird_1.default((resolver, rejecter) => {
        const setting = this.getRuntimeConnectionSettings();
        // If external authentication dont have to worry about username/password and
        // if not need to set the username and password
        const oracleDbConfig = setting.externalAuth ? {
            externalAuth: setting.externalAuth,
        } : {
            user: setting.user,
            password: setting.password,
        };
        // In the case of external authentication connection string will be given
        oracleDbConfig['connectString'] = setting.connectString || setting.host + '/' + setting.database;
        if (setting.prefetchRowCount) {
            oracleDbConfig['prefetchRows'] = setting.prefetchRowCount;
        }
        if (setting.stmtCacheSize !== undefined) {
            oracleDbConfig['stmtCacheSize'] = setting.stmtCacheSize;
        }
        client.driver.fetchAsString = client.fetchAsString;
        client.driver.getConnection(oracleDbConfig, (err, connection) => {
            if (err) {
                return rejecter(err);
            }
            connection.commitAsync = function commitAsync() {
                return new bluebird_1.default((commitResolve, commitReject) => {
                    if (connection.isTransaction) {
                        return commitResolve();
                    }
                    this.commit((err) => {
                        if (err) {
                            return commitReject(err);
                        }
                        commitResolve();
                    });
                });
            };
            connection.rollbackAsync = function rollbackAsync() {
                return new bluebird_1.default((rollbackResolve, rollbackReject) => {
                    this.rollback((err) => {
                        if (err) {
                            return rollbackReject(err);
                        }
                        rollbackResolve();
                    });
                });
            };
            const fetchAsync = function fetchAsync(sql, bindParams, options, cb) {
                options = options || {};
                options.outFormat = client.driver.OBJECT;
                if (options.resultSet) {
                    connection.execute(sql, bindParams || [], options, (err, result) => {
                        if (err) {
                            if (utils_1.isConnectionError(err)) {
                                connection.close().catch(() => { });
                                connection.__knex__disposed = err;
                            }
                            return cb(err);
                        }
                        const fetchResult = { rows: [], resultSet: result.resultSet };
                        const numRows = 100;
                        const fetchRowsFromRS = function fetchRowsFromRS(connection, resultSet, numRows) {
                            resultSet.getRows(numRows, (err, rows) => {
                                if (err) {
                                    if (utils_1.isConnectionError(err)) {
                                        connection.close().catch((_err) => { });
                                        connection.__knex__disposed = err;
                                    }
                                    resultSet.close(() => {
                                        return cb(err);
                                    });
                                }
                                else if (rows.length === 0) {
                                    return cb(null, fetchResult);
                                }
                                else if (rows.length > 0) {
                                    if (rows.length === numRows) {
                                        fetchResult.rows = fetchResult.rows.concat(rows);
                                        fetchRowsFromRS(connection, resultSet, numRows);
                                    }
                                    else {
                                        fetchResult.rows = fetchResult.rows.concat(rows);
                                        return cb(null, fetchResult);
                                    }
                                }
                            });
                        };
                        fetchRowsFromRS(connection, result.resultSet, numRows);
                    });
                }
                else {
                    connection.execute(sql, bindParams || [], options, cb);
                }
            };
            connection.executeAsync = function executeAsync(sql, bindParams, options) {
                // Read all lob
                return new bluebird_1.default((resultResolve, resultReject) => {
                    fetchAsync(sql, bindParams, options, (err, results) => {
                        if (err) {
                            return resultReject(err);
                        }
                        // Collect LOBs to read
                        const lobs = [];
                        if (results.rows) {
                            if (Array.isArray(results.rows)) {
                                for (let i = 0; i < results.rows.length; i++) {
                                    // Iterate through the rows
                                    const row = results.rows[i];
                                    for (const column in row) {
                                        if (row[column] instanceof stream_1.default.Readable) {
                                            lobs.push({ index: i, key: column, stream: row[column] });
                                        }
                                    }
                                }
                            }
                        }
                        bluebird_1.default.each(lobs, (lob) => {
                            return new bluebird_1.default((lobResolve, lobReject) => {
                                readStream(lob.stream, (err, d) => {
                                    if (err) {
                                        if (results.resultSet) {
                                            results.resultSet.close(() => {
                                                return lobReject(err);
                                            });
                                        }
                                        return lobReject(err);
                                    }
                                    results.rows[lob.index][lob.key] = d;
                                    lobResolve();
                                });
                            });
                        }).then(function resolve() {
                            if (results.resultSet) {
                                results.resultSet.close((err) => {
                                    if (err) {
                                        return resultReject(err);
                                    }
                                    return resultResolve(results);
                                });
                            }
                            resultResolve(results);
                        }, function reject(err) {
                            resultReject(err);
                        });
                    });
                });
            };
            resolver(connection);
        });
    });
    return asyncConnection;
}
exports.acquireRawConnection = acquireRawConnection;
