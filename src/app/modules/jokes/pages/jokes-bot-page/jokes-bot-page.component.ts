import { Component } from '@angular/core';
import { Joke } from '../../../../core/joke/joke.types';
import { JokeService } from '../../../../core/joke/joke.service';
import { SpeechService } from '../../../../core/speech/speech.service';
import { switchMap, take, tap } from 'rxjs';
import { JokesBotSettingsComponent } from '../../components/jokes-bot-settings/jokes-bot-settings.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-jokes-bot-page',
    templateUrl: './jokes-bot-page.component.html',
    standalone: true,
    imports: [JokesBotSettingsComponent]
})
export class JokesBotPageComponent {

    voices = toSignal(this._speechService.getVoices(), { initialValue: [], rejectErrors: true });

    /**
     * Constructor
     */
    constructor(
        private readonly _jokeService: JokeService,
        private readonly _speechService: SpeechService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Tell a random joke
     */
    tellRandomJoke() {
        // Get a joke, tell it, and mark it as already used
        this._jokeService.getRandomJoke()
            .pipe(
                take(1),
                tap(console.log),
                switchMap(joke => this._speechService.speak(this._jokeToText(joke)))
            )
            .subscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Readable joke text
     *
     * @param joke
     */
    private _jokeToText(joke: Joke): string {
        if (joke.type === 'single') return joke.joke ?? '';

        return `${joke.setup}\n${joke.delivery}`;
    }
}
