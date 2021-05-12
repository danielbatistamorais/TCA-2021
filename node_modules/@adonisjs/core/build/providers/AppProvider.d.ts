import { ApplicationContract } from '@ioc:Adonis/Core/Application';
/**
 * The application provider that sticks all core components
 * to the container.
 */
export default class AppProvider {
    protected app: ApplicationContract;
    constructor(app: ApplicationContract);
    static needsApplication: boolean;
    /**
     * Find if web or test environment
     */
    private isWebOrTestEnvironment;
    /**
     * Additional providers to load
     */
    provides: string[];
    /**
     * Register `HttpExceptionHandler` to the container.
     */
    protected registerHttpExceptionHandler(): void;
    /**
     * Registering the health check provider
     */
    protected registerHealthCheck(): void;
    /**
     * Registering the assets manager
     */
    protected registerAssetsManager(): void;
    /**
     * Lazy initialize the cors hook, if enabled inside the config
     */
    protected registerCorsHook(): void;
    /**
     * Lazy initialize the static assets hook, if enabled inside the config
     */
    protected registerStaticAssetsHook(): void;
    /**
     * Registers base health checkers
     */
    protected registerHealthCheckers(): void;
    /**
     * Define repl bindings
     */
    protected defineReplBindings(): void;
    /**
     * Registering all required bindings to the container
     */
    register(): void;
    /**
     * Register hooks and health checkers on boot
     */
    boot(): void;
}
