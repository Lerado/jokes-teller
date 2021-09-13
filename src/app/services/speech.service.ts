import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Voice } from '../models/voice.model';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  // Text-to-speech api syntetiser
  synthetiser: SpeechSynthesis;

  constructor() {
    this.synthetiser = window.speechSynthesis;
  }

  speak(text: string): void {
    let utter = new SpeechSynthesisUtterance(text);
    this.synthetiser.speak(utter);
  }

  getVoices(): Observable<Voice[]> {
    const voices = new Promise<Voice[]>((resolve) => {
      this.synthetiser.onvoiceschanged = () => {
        resolve(
          this.synthetiser.getVoices().map((voice) => ({
            name: voice.name,
            lang: voice.lang,
            text: `${voice.name} (${voice.lang}) ${
              voice.default ? ' -- default' : ''
            }`,
          }))
        );
      };
      this.synthetiser.getVoices();
    });

    return from(voices);
  }
}
