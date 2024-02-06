import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Joke } from './joke.types';
import { GetJokesParamsDto, GetJokesResponse, getJokesParamsDefaults } from './joke.dto';
import { isEqual, merge } from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class JokeService {

    private readonly _jokesSubject: BehaviorSubject<Joke[]> = new BehaviorSubject<Joke[]>(this.jokes);
    private readonly _jokesParamsSubject: BehaviorSubject<GetJokesParamsDto> = new BehaviorSubject<GetJokesParamsDto>(this.settings);

    private readonly _JOKES_CACHE_DB_KEY = 'jokes_cache';

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter and setter for jokes
     */
    private get jokes(): Joke[] {
        return JSON.parse(`${localStorage.getItem(this._JOKES_CACHE_DB_KEY)}`) ?? [];
    }
    private set jokes(value: Joke[]) {
        this._jokesSubject.next(value);
        localStorage.setItem(this._JOKES_CACHE_DB_KEY, JSON.stringify(value));
    }
    /**
     * Getter and setter for jokes settings
     */
    private get settings(): GetJokesParamsDto {
        return JSON.parse(`${localStorage.getItem(`${this._JOKES_CACHE_DB_KEY}_params`)}`) ?? getJokesParamsDefaults;
    }
    private set settings(value: GetJokesParamsDto) {
        this._jokesParamsSubject.next(merge(getJokesParamsDefaults, value));
        localStorage.setItem(`${this._JOKES_CACHE_DB_KEY}_params`, JSON.stringify(value));
    }

    /**
     * Public jokes observable
     */
    get jokes$(): Observable<Joke[]> {
        return this._jokesSubject.asObservable();
    }

    /**
     * Public settings observable
     */
    get settings$(): Observable<GetJokesParamsDto> {
        return this._jokesParamsSubject.asObservable();
    }

    /**
     * Constructor
     */
    constructor(
        private readonly _httpClient: HttpClient
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get jokes either from cache or from the api
     *
     * @param params
     * @param bypassCache
     */
    getJokes(params: Partial<GetJokesParamsDto> = {}, bypassCache: boolean = false): Observable<Joke[]> {

        params = merge(this.settings, params);

        // Get from cache if accepted and possible
        if (!bypassCache && isEqual(params, this.settings) && this.jokes.length === params.amount) {
            return of(this.jokes);
        }

        this.settings = params;

        // Else get jokes from the api
        return this._httpClient.get<GetJokesResponse>(
            `@api/joke/${params.categories instanceof Array ? params.categories.join(',') : params.categories}`,
            { params }
        )
            .pipe(
                map(({jokes}) => {
                    this.jokes = jokes;
                    return jokes;
                })
            );
    }

    /**
     * Get a random joke
     *
     * @param params
     * @param bypassCache
     */
    getRandomJoke(params: Partial<GetJokesParamsDto> = {}): Observable<Joke> {

        // Fetch new jokes if there are no more unused jokes left in cache
        const bypassCache = this.jokes.every(joke => joke.used);

        return this.getJokes(params, bypassCache)
            .pipe(
                map(jokes => jokes.find(joke => !joke.used)!)
            );
    }

    /**
     * Mark a joke as already used
     *
     * @param joke
     */
    public markJokeAsUsed(joke: Joke): Observable<Joke> {

        // Search for joke in cache
        const jokeIndex = this.jokes.findIndex(item => joke.id === item.id);

        if (jokeIndex < 0) {
            return throwError(() => new Error('Joke could not be found in cache'))
        }

        const newJokes = this.jokes.splice(jokeIndex, 1, { ...joke, used: true });
        this.jokes = newJokes;

        return of(this.jokes.at(jokeIndex)!);
    }
}
