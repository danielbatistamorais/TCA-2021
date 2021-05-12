import { BaseCommand } from '@adonisjs/core/build/standalone';
import { MigratedFileNode, MigratorContract } from '@ioc:Adonis/Lucid/Migrator';
/**
 * Base class to execute migrations and print logs
 */
export default abstract class MigrationsBase extends BaseCommand {
    /**
     * Not a valid message
     */
    protected printNotAValidConnection(connection: string): void;
    /**
     * Prompts to take consent for running migrations in production
     */
    protected takeProductionConstent(): Promise<boolean>;
    /**
     * Returns beautified log message string
     */
    protected printLogMessage(file: MigratedFileNode, direction: 'down' | 'up'): void;
    /**
     * Pretty print sql queries of a file
     */
    private prettyPrintSql;
    /**
     * Runs the migrations using the migrator
     */
    protected runMigrations(migrator: MigratorContract, connectionName: string): Promise<void>;
}
