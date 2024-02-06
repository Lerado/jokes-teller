import { ApplicationConfig } from "@angular/core";
import { PreloadAllModules, provideRouter, withComponentInputBinding, withInMemoryScrolling, withPreloading, withViewTransitions } from "@angular/router";
import { appRoutes } from "./app.routes";
import { provideCore } from "./core/core.provider";

export const appConfig: ApplicationConfig = {
    providers: [
        // Router
        provideRouter(appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
            withComponentInputBinding(),
            withViewTransitions()
        ),

        // Core modules
        provideCore()
    ]
};
