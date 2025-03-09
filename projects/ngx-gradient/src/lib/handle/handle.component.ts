import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CdkDrag} from "@angular/cdk/drag-drop";
import {GradientStop} from "../classes/gradient";
import {ColorSketchModule} from "ngx-color/sketch";
import {ColorEvent} from "ngx-color";

@Component({
  selector: 'lib-handle',
  standalone: true,
  imports: [
    CdkDrag,
    ColorSketchModule
  ],
  templateUrl: './handle.component.html',
  styleUrl: './handle.component.sass'
})
export class HandleComponent implements AfterViewInit {
  @Input() bounds: HTMLElement
  @Input() stop: GradientStop;
  @ViewChild(CdkDrag) drag: CdkDrag;
  showPicker= false;
  ngAfterViewInit() {
    console.log(this.bounds)
    const bBox = this.bounds.getBoundingClientRect();
    this.drag.constrainPosition = (point, dragRef) => {
      this.showPicker = false;
      return {x: point.x > bBox.width ? bBox.width : point.x, y: 0}
    }
    const pos = (this.stop.stop) * bBox.width;
    this.drag.setFreeDragPosition({x: pos, y: 0})
  }


  changeComplete($event: ColorEvent) {

  }

  toggleColorPicker() {
    this.showPicker = !this.showPicker;
  }

  protected readonly ondragstart = ondragstart;

  onDragStart() {
    console.log('drag start')
    this.showPicker =false
  }
}
