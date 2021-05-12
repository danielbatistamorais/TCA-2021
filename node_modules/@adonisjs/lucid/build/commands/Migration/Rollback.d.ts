import MigrationsBase from './Base';
/**
 * The command is meant to migrate the database by execute migrations
 * in `up` direction.
 */
export default class Migrate extends MigrationsBase {
    static commandName: string;
    static description: string;
    /**
     * Custom connection for running migrations.
     */
    connection: string;
    /**
     * Force run migrations in production
     */
    force: boolean;
    /**
     * Perform dry run
     */
    dryRun: boolean;
    /**
     * Define custom batch, instead of rolling back to the latest batch
     */
    batch: number;
    /**
     * This command loads the application, since we need the runtime
     * to find the migration directories for a given connection
     */
    static settings: {
        loadApp: boolean;
    };
    /**
     * Handle command
     */
    run(): Promise<void>;
}
