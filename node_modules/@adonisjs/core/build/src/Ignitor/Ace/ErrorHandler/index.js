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
exports.ErrorHandler = void 0;
/**
 * Handles ignitor bootstrapping errors by pretty printing them in development
 */
class ErrorHandler {
    constructor(application) {
        this.application = application;
    }
    /**
     * Pretty prints a given error on the terminal
     */
    async prettyPrintError(error) {
        try {
            const Youch = require('youch');
            const output = await new Youch(error, {}).toJSON();
            console.log(require('youch-terminal')(output));
        }
        catch (err) {
            console.log(error.stack);
        }
    }
    /**
     * Handles ignitor boot errors
     */
    async handleError(error) {
        if (typeof error.handle === 'function') {
            error.handle(error);
        }
        else if (this.application.inDev) {
            await this.prettyPrintError(error);
        }
        else {
            console.error(error.stack);
        }
    }
}
exports.ErrorHandler = ErrorHandler;
