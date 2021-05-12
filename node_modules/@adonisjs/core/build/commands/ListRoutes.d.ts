import { BaseCommand } from '@adonisjs/ace';
/**
 * A command to display a list of routes
 */
export default class ListRoutes extends BaseCommand {
    static commandName: string;
    static description: string;
    json: boolean;
    /**
     * Load application
     */
    static settings: {
        loadApp: boolean;
    };
    /**
     * Returns an array of routes as JSON
     */
    private outputJSON;
    /**
     * Output routes a table string
     */
    private outputTable;
    /**
     * Log message
     */
    private log;
    run(): Promise<void>;
}
