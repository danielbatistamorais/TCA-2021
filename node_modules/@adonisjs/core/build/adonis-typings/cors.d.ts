declare module '@ioc:Adonis/Core/Cors' {
    import { RequestContract } from '@ioc:Adonis/Core/Request';
    type AllowedValuesTypes = boolean | string | string[];
    type CorsConfig = {
        enabled: boolean | ((request: RequestContract) => boolean);
        origin: AllowedValuesTypes | ((origin: string) => AllowedValuesTypes);
        methods: string[];
        headers: AllowedValuesTypes | ((headers: string[]) => AllowedValuesTypes);
        exposeHeaders: string[];
        credentials: boolean;
        maxAge: number;
    };
}
