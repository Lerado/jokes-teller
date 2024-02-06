import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Provider, EnvironmentProviders, inject, ENVIRONMENT_INITIALIZER } from '@angular/core';
import { apiInterceptor } from './api.interceptor';
import { EnvironmentLoaderService } from '@lib/environment-loader/environment-loader.service';

export const provideApi = (): Array<Provider | EnvironmentProviders> => {
    return [
        provideHttpClient(withInterceptors([apiInterceptor])),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(EnvironmentLoaderService),
            multi: true
        }
    ];
};
