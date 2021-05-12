/// <reference types="node" />
/**
 * Helper to know if error belongs to a missing module
 * error
 */
export declare function isMissingModuleError(error: NodeJS.ErrnoException): boolean;
/**
 * Registers the ts hook to compile typescript code within the memory
 */
export declare function registerTsHook(appRoot: string): void;
