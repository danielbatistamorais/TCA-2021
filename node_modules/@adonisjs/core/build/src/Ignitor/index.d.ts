import { Application } from '@adonisjs/application';
import { AppEnvironments } from '@ioc:Adonis/Core/Application';
import { Ace } from './Ace';
import { HttpServer } from './HttpServer';
/**
 * Ignitor is used to wireup different pieces of AdonisJs to bootstrap
 * the application.
 */
export declare class Ignitor {
    private appRoot;
    constructor(appRoot: string);
    /**
     * Returns an instance of the application.
     */
    application(environment: AppEnvironments): Application;
    /**
     * Returns instance of server to start
     * the HTTP server
     */
    httpServer(): HttpServer;
    /**
     * Returns instance of ace to handle console
     * commands
     */
    ace(): Ace;
}
