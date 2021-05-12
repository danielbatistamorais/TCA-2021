declare module '@ioc:Adonis/Core/Application' {
    import { HealthCheckContract } from '@ioc:Adonis/Core/HealthCheck';
    import { AssetsManagerContract } from '@ioc:Adonis/Core/AssetsManager';
    import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';
    interface ContainerBindings {
        'Adonis/Core/HealthCheck': HealthCheckContract;
        'Adonis/Core/AssetsManager': AssetsManagerContract;
        'Adonis/Core/HttpExceptionHandler': typeof HttpExceptionHandler;
    }
}
