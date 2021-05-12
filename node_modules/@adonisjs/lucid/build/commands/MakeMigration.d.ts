import { BaseCommand } from '@adonisjs/core/build/standalone';
export default class MakeMigration extends BaseCommand {
    static commandName: string;
    static description: string;
    /**
     * The name of the migration file. We use this to create the migration
     * file and generate the table name
     */
    name: string;
    /**
     * Choose a custom pre-defined connection. Otherwise, we use the
     * default connection
     */
    connection: string;
    /**
     * Pre select migration directory. If this is defined, we will ignore the paths
     * defined inside the config.
     */
    folder: string;
    /**
     * Custom table name for creating a new table
     */
    create: string;
    /**
     * Custom table name for altering an existing table
     */
    table: string;
    /**
     * This command loads the application, since we need the runtime
     * to find the migration directories for a given connection
     */
    static settings: {
        loadApp: boolean;
    };
    /**
     * Returns the directory for creating the migration file
     */
    private getDirectory;
    /**
     * Execute command
     */
    run(): Promise<void>;
}
