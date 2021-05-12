/// <reference path="../../adonis-typings/index.d.ts" />
import { RelationshipsContract } from '@ioc:Adonis/Lucid/Relations';
import { LucidRow, ModelObject, CherryPickFields } from '@ioc:Adonis/Lucid/Model';
import { QueryClientContract, TransactionClientContract, FileNode } from '@ioc:Adonis/Lucid/Database';
/**
 * Ensure that relation is defined
 */
export declare function ensureRelation<T extends RelationshipsContract>(name: string, relation?: T): relation is T;
/**
 * Ensure a key value is not null or undefined inside an object.
 */
export declare function ensureValue(collection: any, key: string, missingCallback: () => void): any;
/**
 * Collects values for a key inside an array. Similar to `Array.map`, but
 * reports missing values.
 */
export declare function collectValues(payload: any[], key: string, missingCallback: () => void): any[];
/**
 * Raises exception when a relationship `booted` property is false.
 */
export declare function ensureRelationIsBooted(relation: RelationshipsContract): void;
/**
 * Returns the value for a key from the model instance and raises descriptive
 * exception when the value is missing
 */
export declare function getValue(model: LucidRow | ModelObject, key: string, relation: RelationshipsContract, action?: string): any;
/**
 * Helper to find if value is a valid Object or
 * not
 */
export declare function isObject(value: any): boolean;
/**
 * Drops duplicate values from an array
 */
export declare function unique(value: any[]): any[];
/**
 * Returns a diff of rows to be updated or inserted when performing
 * a many to many `attach`
 */
export declare function syncDiff(original: ModelObject, incoming: ModelObject): {
    added: ModelObject;
    updated: ModelObject;
};
/**
 * Invokes a callback by wrapping it inside managed transaction
 * when passed client is not transaction itself.
 */
export declare function managedTransaction<T>(client: QueryClientContract | TransactionClientContract, callback: (trx: TransactionClientContract) => Promise<T>): Promise<T>;
/**
 * Returns the sql method for a DDL statement
 */
export declare function getDDLMethod(sql: string): "create" | "alter" | "drop" | "unknown";
/**
 * Normalizes the cherry picking object to always be an object with
 * `pick` and `omit` properties
 */
export declare function normalizeCherryPickObject(fields: CherryPickFields): {
    pick: string[] | undefined;
    omit: string[] | undefined;
};
/**
 * Sources files from a given directory
 */
export declare function sourceFiles(fromLocation: string, directory: string): Promise<{
    directory: string;
    files: FileNode<unknown>[];
}>;
