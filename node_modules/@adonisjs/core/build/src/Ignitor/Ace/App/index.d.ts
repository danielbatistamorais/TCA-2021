/**
 * Exposes the API to execute app commands registered under
 * the manifest file.
 */
export declare class App {
    private appRoot;
    private commandName;
    /**
     * Returns a boolean if mentioned command is an assembler
     * command
     */
    private get isAssemblerCommand();
    /**
     * Whether or not the app was wired. App is only wired, when
     * loadApp inside the command setting is true.
     */
    private wired;
    /**
     * Reference to the application
     */
    private application;
    /**
     * Reference to the ace kernel
     */
    private kernel;
    /**
     * Signals listener to listen for exit signals and kill command
     */
    private signalsListener;
    /**
     * Find if TS hook has been registered or not
     */
    private registeredTsHook;
    /**
     * Source root always points to the compiled source
     * code.
     */
    constructor(appRoot: string);
    /**
     * Print commands help
     */
    private printHelp;
    /**
     * Print framework version
     */
    private printVersion;
    /**
     * Invoked before command source will be read from the
     * disk
     */
    private onFind;
    /**
     * Invoked before command is about to run.
     */
    private onRun;
    /**
     * Hooks into kernel lifecycle events to conditionally
     * load the app.
     */
    private addKernelHooks;
    /**
     * Adding flags
     */
    private addKernelFlags;
    /**
     * Boot the application.
     */
    private wire;
    /**
     * Returns manifest details for assembler
     */
    private getAssemblerManifest;
    /**
     * Returns manifest details for app
     */
    private getAppManifest;
    /**
     * Handle application command
     */
    handle(argv: string[]): Promise<void>;
}
