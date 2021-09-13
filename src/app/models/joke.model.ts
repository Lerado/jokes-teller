export interface Joke {
  error: boolean;
  category: JokeCategoryType;
  type: JokeType;

  id: number;
  safe: boolean;
  lang: string;

  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };

  joke?: string;
  setup?: string;
  delivery?: string;

  used?: boolean;
}

enum JokeCategoryEnum {
  Any,
  Misc,
  Programming,
  Dark,
  Pun,
  Spooky,
  Christmas,
}
export type JokeCategoryType = keyof typeof JokeCategoryEnum;

enum JokeTypeEnum {
  single,
  twopart,
}

export type JokeType = keyof typeof JokeTypeEnum;
