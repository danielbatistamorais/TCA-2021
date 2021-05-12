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
/**
 * Database service provider
 */
class DatabaseServiceProvider {
    constructor(app) {
        this.app = app;
    }
    /**
     * Register the database binding
     */
    registerDatabase() {
        this.app.container.singleton('Adonis/Lucid/Database', () => {
            const config = this.app.container.use('Adonis/Core/Config').get('database', {});
            const Logger = this.app.container.use('Adonis/Core/Logger');
            const Profiler = this.app.container.use('Adonis/Core/Profiler');
            const Emitter = this.app.container.use('Adonis/Core/Event');
            const { Database } = require('../src/Database');
            return new Database(config, Logger, Profiler, Emitter);
        });
    }
    /**
     * Registers ORM
     */
    registerOrm() {
        this.app.container.singleton('Adonis/Lucid/Orm', () => {
            const Config = this.app.container.use('Adonis/Core/Config');
            const { Adapter } = require('../src/Orm/Adapter');
            const { scope } = require('../src/Helpers/scope');
            const decorators = require('../src/Orm/Decorators');
            const { BaseModel } = require('../src/Orm/BaseModel');
            const ormConfig = require('../src/Orm/Config').Config;
            /**
             * Attaching adapter to the base model. Each model is allowed to define
             * a different adapter.
             */
            BaseModel.$adapter = new Adapter(this.app.container.use('Adonis/Lucid/Database'));
            BaseModel.$container = this.app.container;
            BaseModel.$configurator = Object.assign({}, ormConfig, Config.get('database.orm', {}));
            return {
                BaseModel,
                scope,
                ...decorators,
            };
        });
    }
    /**
     * Registers schema class
     */
    registerSchema() {
        this.app.container.singleton('Adonis/Lucid/Schema', () => {
            const { Schema } = require('../src/Schema');
            return Schema;
        });
    }
    /**
     * Registers schema class
     */
    registerFactory() {
        this.app.container.singleton('Adonis/Lucid/Factory', () => {
            const { FactoryManager } = require('../src/Factory');
            return new FactoryManager();
        });
    }
    /**
     * Registers schema class
     */
    registerBaseSeeder() {
        this.app.container.singleton('Adonis/Lucid/Seeder', () => {
            const { BaseSeeder } = require('../src/BaseSeeder');
            return BaseSeeder;
        });
    }
    /**
     * Registers the health checker
     */
    registerHealthChecker() {
        /**
         * Do not register health checks in the repl environment
         */
        if (this.app.environment === 'repl') {
            return;
        }
        this.app.container.with(['Adonis/Core/HealthCheck', 'Adonis/Lucid/Database'], (HealthCheck, Db) => {
            if (Db.hasHealthChecksEnabled) {
                HealthCheck.addChecker('lucid', 'Adonis/Lucid/Database');
            }
        });
    }
    /**
     * Extends the validator by defining validation rules
     */
    defineValidationRules() {
        /**
         * Do not register validation rules in the "repl" environment
         */
        if (this.app.environment === 'repl') {
            return;
        }
        this.app.container.with(['Adonis/Core/Validator', 'Adonis/Lucid/Database'], (Validator, Db) => {
            const { extendValidator } = require('../src/Bindings/Validator');
            extendValidator(Validator.validator, Db);
        });
    }
    /**
     * Defines REPL bindings
     */
    defineReplBindings() {
        if (this.app.environment !== 'repl') {
            return;
        }
        this.app.container.with(['Adonis/Addons/Repl'], (Repl) => {
            const { defineReplBindings } = require('../src/Bindings/Repl');
            defineReplBindings(this.app, Repl);
        });
    }
    /**
     * Called when registering providers
     */
    register() {
        this.registerDatabase();
        this.registerOrm();
        this.registerSchema();
        this.registerFactory();
        this.registerBaseSeeder();
    }
    /**
     * Called when all bindings are in place
     */
    boot() {
        this.registerHealthChecker();
        this.defineValidationRules();
        this.defineReplBindings();
    }
    /**
     * Gracefully close connections during shutdown
     */
    async shutdown() {
        await this.app.container.use('Adonis/Lucid/Database').manager.closeAll();
    }
}
exports.default = DatabaseServiceProvider;
DatabaseServiceProvider.needsApplication = true;
