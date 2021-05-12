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
exports.Logger = void 0;
/**
 * Custom knex logger that uses adonisjs logger under the
 * hood.
 */
class Logger {
    constructor(name, adonisLogger) {
        this.name = name;
        this.adonisLogger = adonisLogger;
        this.warn = function (message) {
            this.adonisLogger.warn(message);
        }.bind(this);
        this.error = function (message) {
            this.adonisLogger.error(message);
        }.bind(this);
        this.deprecate = function (message) {
            this.adonisLogger.info(message);
        }.bind(this);
        this.debug = function (message) {
            this.warn('"debug" property inside config is depreciated. We recommend using "db:query" event for enrich logging');
            this.adonisLogger.debug(message);
        }.bind(this);
    }
}
exports.Logger = Logger;
