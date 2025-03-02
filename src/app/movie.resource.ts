import { HttpClient } from "@angular/common/http"
import { inject, Injector, runInInjectionContext, Signal } from "@angular/core"
import { rxResource } from "@angular/core/rxjs-interop"
import { catchError, debounceTime, distinctUntilChanged, forkJoin, map, of, switchMap, throwError } from "rxjs"
import { Movie, MovieColumn, MovieResponse } from "./types"

export const injectMovieResource = (search: Signal<string>, sort: Signal<MovieColumn | undefined>) => {
  const httpClient = inject(HttpClient);
  const injector = inject(Injector)

  return runInInjectionContext(injector, () => {
    return rxResource<Movie[] | null, string>({
        request: () => search(),
        loader: ({request}) => {
          return request ?
          httpClient.get<MovieResponse>(`http://www.omdbapi.com/?s=${request}`).pipe(
            distinctUntilChanged(),
            debounceTime(500),
            map(res => {
              if (res.Response === 'False') {
                throw new Error(res.Error);
              }
              return res
            }),
            map(res => res.Search),
            switchMap((movies) => {
              return forkJoin(
                movies.map(movie => httpClient.get<Movie>(`http://www.omdbapi.com/?i=${movie.imdbID}`))
              )
            }),
            map(movies => {
              if (sort()) {
                const val = sort()?.sort === 'asc' ? 1 : -1;

                return movies.sort((a, b) => val * a[sort()!.property].localeCompare(b[sort()!.property]));
              }
              return movies;
            }),
            catchError((err) => {
              return throwError(() => err)
            })
          ) : of(null)
        }
      })
  })
}
