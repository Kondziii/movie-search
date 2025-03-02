import { AfterViewInit, Directive, ElementRef, OnDestroy } from "@angular/core";

@Directive({
  selector: '[appDragToScroll]',
  standalone: true,
  host: {
    '(mousedown)': 'onMouseDown($event)',
    '(mousemove)': 'onMouseMove($event)',
    '(mouseup)': 'onMouseUp()',
    '(mouseleave)': 'onMouseUp()'
  }
})
export class DragToScrollDirective implements AfterViewInit, OnDestroy {
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor(private el: ElementRef<HTMLDivElement>) {}

  ngAfterViewInit() {
    this.el.nativeElement.classList.add('cursor-grab');
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.el.nativeElement.classList.add('cursor-grabbing');
    this.startX = event.pageX - this.el.nativeElement.offsetLeft;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.el.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.el.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp() {
    this.isDragging = false;
    this.el.nativeElement.classList.remove('cursor-grabbing');
  }

  ngOnDestroy() {
    this.isDragging = false;
  }
}
