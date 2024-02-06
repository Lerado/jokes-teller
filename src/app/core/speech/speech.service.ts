import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SpeechService {

    // Text-to-speech api syntetiser
    private readonly _synthetiser: SpeechSynthesis = window.speechSynthesis;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Text-to-speech translation
     *
     * @param text
     */
    speak(text: string): Observable<void> {
        let utter = new SpeechSynthesisUtterance(text);
        this._synthetiser.speak(utter)
        return of();
    }

    /**
     * Get available voices
     */
    getVoices(): Observable<SpeechSynthesisVoice[]> {
        return from(
            new Promise<SpeechSynthesisVoice[]>((resolve) => {
                this._synthetiser.onvoiceschanged = (e) => resolve(this._synthetiser.getVoices());
                this._synthetiser.getVoices();
            })
        );
    }
}
