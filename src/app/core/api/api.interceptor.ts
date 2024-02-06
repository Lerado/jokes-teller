import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { EnvironmentLoaderService } from '@lib/environment-loader/environment-loader.service';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { ApiErrorResponse } from './api.types';

export const apiInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

    const environmentLoaderService = inject(EnvironmentLoaderService);

    // Clone the request
    let newRequest = req.clone();

    // We rewrite the target of any request targeting a resource url starting with @api
    if (req.url.indexOf('@api/') === 0) {
        const { apiBaseUrl, apiPrefix } = environmentLoaderService.environment as { apiBaseUrl: string; apiPrefix: string };
        newRequest = req.clone({
            url: req.url.replace('@api/', `${apiBaseUrl}${apiPrefix}`)
        });

        // In this case we should properly map the response
        return next(newRequest).pipe(
            switchMap((response: HttpEvent<any>) => {
                if (response instanceof HttpResponse) {
                    if (Object.hasOwn(response.body, 'error') && response.body.error) {
                        const errorResponse = response.body as ApiErrorResponse;
                        return throwError(() => errorResponse);
                    }
                }
                return of(response);
            })
        );
    }

    return next(newRequest);
};
