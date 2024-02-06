import { Joke, JokeCategoryType, JokeType } from './joke.types';

interface GetJokesParamsDto {
    format?: 'json';
    blackListFlags?: BlackListFlags | BlackListFlags[];
    lang?: string;
    categories?: JokeCategoryType | JokeCategoryType[];
    type?: JokeType;
    contains?: string;
    amount?: number;
    safeMode?: boolean;
}

const getJokesParamsDefaults: GetJokesParamsDto = {
    format: 'json',
    lang: 'en',
    categories: 'Any',
    amount: 10,
};

enum BlackListFlags {
    nsfw = 'nsfw',
    religious = 'religious',
    political = 'political',
    racist = 'racist',
    sexist = 'sexist',
    explicit = 'explicit'
}

interface GetJokesResponse {
    amount: number;
    jokes: Joke[]
}

export { GetJokesParamsDto, getJokesParamsDefaults, GetJokesResponse, BlackListFlags };
