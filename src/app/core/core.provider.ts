import { EnvironmentProviders, Provider } from "@angular/core";
import { provideEnvironmentLoader } from "@lib/environment-loader/environment-loader.provider";
import { provideApi } from "./api/api.provider";

export const provideCore = (): Array<EnvironmentProviders | Provider> => [

    // Environment loader
    provideEnvironmentLoader(),

    // Backend server
    provideApi(),
]
