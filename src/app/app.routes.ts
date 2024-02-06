import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    // Main and only route
    { path: '', loadChildren: () => import('app/modules/jokes/jokes.routes') }
];
