/// <reference types="@adonisjs/validator" />
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database';
import { validator as validatorStatic } from '@ioc:Adonis/Core/Validator';
/**
 * Extends the validator by adding `unique` and `exists`
 */
export declare function extendValidator(validator: typeof validatorStatic, database: DatabaseContract): void;
