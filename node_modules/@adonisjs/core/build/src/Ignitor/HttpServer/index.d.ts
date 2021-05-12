/// <reference types="node" />
import { Server as HttpsServer } from 'https';
import { Application } from '@adonisjs/application';
import { IncomingMessage, ServerResponse, Server } from 'http';
declare type ServerHandler = (req: IncomingMessage, res: ServerResponse) => any;
declare type CustomServerCallback = (handler: ServerHandler) => Server | HttpsServer;
/**
 * Exposes the API to setup the application for starting the HTTP
 * server.
 */
export declare class HttpServer {
    private appRoot;
    /**
     * Reference to core http server.
     */
    private server;
    /**
     * Whether or not the application has been wired.
     */
    private wired;
    /**
     * Reference to the application.
     */
    application: Application;
    /**
     * Listens for unix signals to kill long running
     * processes.
     */
    private signalsListener;
    constructor(appRoot: string);
    /**
     * Wires up everything, so that we are ready to kick start
     * the HTTP server.
     */
    private wire;
    /**
     * Sets the server reference
     */
    private setServer;
    /**
     * Closes the underlying HTTP server
     */
    private closeHttpServer;
    /**
     * Monitors the HTTP server for close and error events, so that
     * we can perform a graceful shutdown
     */
    private monitorHttpServer;
    /**
     * Notify server is ready
     */
    private notifyServerReady;
    /**
     * Creates the HTTP server to handle incoming requests. The server is just
     * created but not listening on any port.
     */
    createServer(serverCallback?: CustomServerCallback): void;
    /**
     * Starts the http server a given host and port
     */
    listen(): Promise<void>;
    /**
     * Start the HTTP server by wiring up the application
     */
    start(serverCallback?: CustomServerCallback): Promise<void>;
    /**
     * Prepares the application for shutdown. This method will invoke `shutdown`
     * lifecycle method on the providers and closes the `httpServer`.
     */
    close(): Promise<void>;
    /**
     * Kills the http server process by attempting to perform a graceful
     * shutdown or killing the app forcefully as waiting for configured
     * seconds.
     */
    kill(waitTimeout?: number): Promise<void>;
}
export {};
