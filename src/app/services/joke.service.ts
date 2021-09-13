import { Injectable } from '@angular/core';
import { JokeConfigsInterface } from '../configs/joke.config';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Joke } from '../models/joke.model';
import { JokeRequest, JokeRequestDefaults } from '../requests/joke.request';

@Injectable({
  providedIn: 'root',
})
export class JokeService {
  readonly configs: JokeConfigsInterface = {
    url: 'https://v2.jokeapi.dev/',
    GET: 'joke',
  };

  readonly defaultRequest: JokeRequest;

  readonly localDbName: string = 'jokes';

  jokes: Joke[] = [];

  constructor(private httpClient: HttpClient) {
    this.defaultRequest = { ...JokeRequestDefaults };
    this.jokes = this.getStorage(this.localDbName);
    // this.getJokes().subscribe((jokes) => this.setStorage(jokes));
  }

  getRandomJoke(request?: JokeRequest): Observable<any> {
    let result: Observable<any>;
    console.log(this.jokes);
    if (!this.jokes?.length) {
      result = this.getJokes(request).pipe(
        map((jokes) => jokes.find((joke) => !joke.used))
      );
    } else {
      result = of(this.jokes.find((joke) => !joke.used));
    }

    // Refresh database to remove the used one
    result.subscribe((joke) => this.removeJoke(joke));

    return result;
  }

  getJokes(request?: JokeRequest): Observable<Joke[]> {
    let observable: Observable<Joke[]>;
    // Checks if local database still has some jokes available
    let localJokes: Joke[] = this.getStorage(this.localDbName);
    localJokes = localJokes.filter((joke) => !joke.used);
    if (localJokes.length) {
      this.jokes = localJokes;
      observable = of(this.jokes);
    }

    // Else get it remotely
    observable = this.httpClient
      .get<{ jokes: Joke[] }>(
        this.genURL({ ...this.defaultRequest, ...request })
      )
      .pipe(map((response) => response.jokes))
      .pipe(catchError(this.handleError<Joke[]>('getJokes')));

    observable.subscribe((jokes) => {
      this.setStorage(jokes);
    });

    return observable;
  }

  private removeJoke(joke: Joke): void {
    if (this.jokes?.length)
      this.jokes = this.jokes.filter(
        (jokeElement) => jokeElement.id !== joke.id
      );

    this.setStorage(this.jokes);
  }

  private getStorage(key: string): Joke[] {
    const jokes =
      JSON.parse(String(localStorage.getItem(key))) ?? new Array<Joke>();

    return Array.from(jokes);
  }

  private setStorage(jokes?: Joke[]): void {
    this.jokes = jokes || new Array<Joke>();
    localStorage.setItem(this.localDbName, JSON.stringify(this.jokes));
  }

  private genURL(request: JokeRequest): string {
    const BASE_URL = `${this.configs.url}${this.configs.GET}`;

    // Append url parameters depending on request
    const {
      format,
      blackListFlags,
      lang,
      categories,
      type,
      contains,
      amount,
      safeMode,
    } = request;

    let params = BASE_URL.endsWith('/') ? '' : '/';

    /**
     * Required parameters
     */

    // Categories management
    params += categories instanceof Array ? categories.join(',') : categories;

    // Language
    params += `?lang=${lang}`;

    // Format
    params += `&format=${format}`;

    // Amount
    params += `&amount=${amount}`;

    /**
     * Optional parameters
     */

    // Blacklist flags
    if (!!blackListFlags)
      params += `&blackListFlags=${
        blackListFlags instanceof Array
          ? blackListFlags.join(',')
          : blackListFlags
      }`;

    // Joke type
    if (!!type) params += `&type=${type}`;

    // Query string
    if (!!contains) params += `&contains=${contains}`;

    // Safe mode
    if (safeMode == true) params += `&safe-mode`;

    return `${BASE_URL}${params}`;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
