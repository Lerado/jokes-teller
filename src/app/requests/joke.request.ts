import { JokeCategoryType, JokeType } from '../models/joke.model';

export interface JokeRequest {
  format: 'json';
  blackListFlags?: BlackListFlagsType | BlackListFlagsType[];
  lang: string;
  categories: JokeCategoryType | JokeCategoryType[];
  type?: JokeType;
  contains?: string;
  amount: number;
  safeMode?: boolean;
}

export const JokeRequestDefaults: JokeRequest = {
  format: 'json',
  lang: 'en',
  categories: 'Any',
  amount: 10,
};

enum BlackListFlagsEnum {
  nsfw,
  religious,
  political,
  racist,
  sexist,
  explicit,
}
export type BlackListFlagsType = keyof typeof BlackListFlagsEnum;
