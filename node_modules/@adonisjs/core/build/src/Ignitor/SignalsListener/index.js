"use strict";
/*
 * @adonisjs/core
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalsListener = void 0;
/**
 * Exposes the API to invoke a callback when `SIGTERM` or
 * `SIGINT (pm2 only)` signals are received.
 */
class SignalsListener {
    constructor(application) {
        this.application = application;
        /**
         * Invoke callback and exit process
         */
        this.kill = async function () {
            try {
                await this.onCloseCallback();
                process.exit(0);
            }
            catch (error) {
                process.exit(1);
            }
        }.bind(this);
    }
    /**
     * Listens for exit signals and invokes the given
     * callback
     */
    listen(callback) {
        this.onCloseCallback = callback;
        if (process.env.pm_id) {
            process.once('SIGINT', this.kill);
        }
        process.once('SIGTERM', this.kill);
        /**
         * Cleanup on uncaught exceptions.
         */
        process.once('uncaughtException', (error) => {
            if (this.application.environment === 'repl') {
                this.application.logger.fatal(error, '"uncaughtException" detected');
                return;
            }
            this.application.logger.fatal(error, '"uncaughtException" detected. Process will shutdown');
            process.exit(1);
        });
    }
    /**
     * Cleanup event listeners
     */
    cleanup() {
        process.removeListener('SIGINT', this.kill);
        process.removeListener('SIGTERM', this.kill);
        this.onCloseCallback = undefined;
    }
}
exports.SignalsListener = SignalsListener;
