import { BaseCommand } from '@adonisjs/core/build/standalone';
export default class DbSeed extends BaseCommand {
    static commandName: string;
    static description: string;
    /**
     * Track if one or more seeders have failed
     */
    private hasError;
    /**
     * Choose a custom pre-defined connection. Otherwise, we use the
     * default connection
     */
    connection: string;
    /**
     * Interactive mode allows selecting seeder files
     */
    interactive: boolean;
    /**
     * Define a custom set of seeder files. Interactive and files together ignores
     * the interactive mode.
     */
    files: string[];
    /**
     * This command loads the application, since we need the runtime
     * to find the migration directories for a given connection
     */
    static settings: {
        loadApp: boolean;
    };
    /**
     * Print log message to the console
     */
    private printLogMessage;
    /**
     * Execute command
     */
    run(): Promise<void>;
}
