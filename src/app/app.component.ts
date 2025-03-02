import { Component, computed, signal } from '@angular/core';
import { BaseMovie, MovieColumn } from './types';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { DragToScrollDirective } from './drag-to-scroll.directive';
import { injectMovieResource } from './movie.resource';

@Component({
  selector: 'app-root',
  imports: [ MatProgressSpinnerModule, CdkDrag, CdkDropList, NgClass, DragToScrollDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  search = signal('');
  columns = signal<MovieColumn[]>([
    { label:'Poster', property: 'Poster', sort: 'asc'},
    { label: 'Title', property: 'Title', sort: 'asc'},
    { label: 'Year', property: 'Year', sort: 'asc'},
    { label: 'Runtime', property: 'Runtime', sort: 'asc'},
    { label: 'Genre', property: 'Genre', sort: 'asc'},
    { label: 'Director', property: 'Director', sort: 'asc'},
    { label: 'Plot', property: 'Plot', sort: 'asc'}])

  sort = computed(() => this.columns().find(col => col.activeSort))

  movieResource = injectMovieResource(this.search, this.sort);

  protected handleSearchChange = (searchValue: string) => {
    this.search.set(searchValue);
  }

  protected dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns(), event.previousIndex, event.currentIndex);
  }

  protected getColumnValue(movie: BaseMovie, property: string) {
    return movie[property as keyof BaseMovie];
  }

  protected handleSortColumn(column: MovieColumn) {
    if (!this.movieResource.value()?.length) {
      return;
    }

    const val = column.sort === 'asc' ? -1 : 1;
    this.columns.update(prev => prev.map(col => {
      if (col.property === column.property) {
        return {
          ...col,
          sort: col.sort === 'asc' ? 'desc' : 'asc',
          activeSort: true
        }
      }
      return {...col, activeSort: false};
    }))

    this.movieResource.update(currentMovies => {
      return currentMovies?.sort((a, b) => val * a[column.property].localeCompare(b[column.property]))
    })
  }
}
