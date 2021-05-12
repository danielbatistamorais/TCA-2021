/// <reference types="faker" />
import { FactoryContextContract } from '@ioc:Adonis/Lucid/Factory';
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
export declare class FactoryContext implements FactoryContextContract {
    isStubbed: boolean;
    $trx: TransactionClientContract | undefined;
    faker: Faker.FakerStatic;
    constructor(isStubbed: boolean, $trx: TransactionClientContract | undefined);
}
