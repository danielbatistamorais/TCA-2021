import { ApplicationContract } from '@ioc:Adonis/Core/Application';
/**
 * Handles ignitor bootstrapping errors by pretty printing them in development
 */
export declare class ErrorHandler {
    private application;
    constructor(application: ApplicationContract);
    /**
     * Pretty prints a given error on the terminal
     */
    private prettyPrintError;
    /**
     * Handles ignitor boot errors
     */
    handleError(error: any): Promise<void>;
}
