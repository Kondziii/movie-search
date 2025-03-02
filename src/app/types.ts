export type BaseMovie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export type MovieResponse = {
  Response: 'True';
  Search: BaseMovie[];
  totalResults: string;
} |
{
  Response: 'False',
  Error: string;
}

export type SortDirection = 'desc' | 'asc'

export type Movie = {
  Genre: string;
  Director: string;
  Plot: string;
  Runtime: string;
} & BaseMovie

export type MovieColumn = {label: string, property: keyof Movie, sort: SortDirection, activeSort?: boolean};
