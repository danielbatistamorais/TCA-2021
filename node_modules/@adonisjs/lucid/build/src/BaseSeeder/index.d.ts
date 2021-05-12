import { QueryClientContract } from '@ioc:Adonis/Lucid/Database';
export declare class BaseSeeder {
    client: QueryClientContract;
    static developmentOnly: boolean;
    constructor(client: QueryClientContract);
    run(): Promise<void>;
}
