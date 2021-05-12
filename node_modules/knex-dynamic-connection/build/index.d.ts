import * as Knex from 'knex';
/**
 * Patches the knex client so that it makes use of a resolver function to
 * resolve the config before making a SQL query.
 */
export declare function patchKnex(knex: Knex, configFn: (config: Knex.Config) => Knex.ConnectionConfig): void;
