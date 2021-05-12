import MigrationsBase from './Base';
/**
 * The command is meant to migrate the database by execute migrations
 * in `up` direction.
 */
export default class Status extends MigrationsBase {
    static commandName: string;
    static description: string;
    /**
     * Define custom connection
     */
    connection: string;
    /**
     * This command loads the application, since we need the runtime
     * to find the migration directories for a given connection
     */
    static settings: {
        loadApp: boolean;
    };
    /**
     * Colorizes the status string
     */
    private colorizeStatus;
    /**
     * Handle command
     */
    run(): Promise<void>;
}
