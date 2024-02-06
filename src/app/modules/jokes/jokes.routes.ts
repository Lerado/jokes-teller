import { Routes } from "@angular/router";
import { JokesBotPageComponent } from "./pages/jokes-bot-page/jokes-bot-page.component";

export default [
    {
        path: '',
        title: 'Joking Bot',
        component: JokesBotPageComponent
    }
] as Routes;
