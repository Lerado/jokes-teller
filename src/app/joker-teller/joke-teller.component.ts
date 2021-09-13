import { Component, OnInit } from '@angular/core';
import { Joke } from '../models/joke.model';
import { JokeService } from '../services/joke.service';
import { SpeechService } from '../services/speech.service';

@Component({
  selector: 'app-joke-teller',
  templateUrl: './joke-teller.component.html',
  styleUrls: ['./joke-teller.component.css'],
})
export class JokeTellerComponent implements OnInit {
  // Jokes array
  jokes?: Joke[];

  // Joke object
  joke?: Joke;

  constructor(
    private jokeService: JokeService,
    private speechService: SpeechService
  ) {}

  onTellMeJoke() {
    // Get a joke and mark it as already used
    this.jokeService
      .getRandomJoke()
      .subscribe((joke: Joke) => this.speak(joke));
  }

  private jokeToText(joke: Joke): string {
    if (joke.type === 'single') return joke.joke ?? '';

    return `${joke.setup}\n${joke.delivery}`;
  }

  private speak(joke: Joke) {
    this.speechService.speak(this.jokeToText(joke));
  }

  async ngOnInit() {}
}
