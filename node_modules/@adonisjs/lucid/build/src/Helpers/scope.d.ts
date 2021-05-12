import { LucidModel, QueryScope, QueryScopeCallback } from '@ioc:Adonis/Lucid/Model';
/**
 * Helper to mark a function as query scope
 */
export declare function scope<Model extends LucidModel, Callback extends QueryScopeCallback<Model>>(callback: Callback): QueryScope<Callback>;
