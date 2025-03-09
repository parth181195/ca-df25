import {AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {GradientConfig} from "./classes/gradient";

@Component({
  selector: 'lib-ngx-gradient',
  standalone: true,
  imports: [],
  templateUrl: './ngx-gradient.component.html',
  styles: ``
})
export class NgxGradientComponent implements AfterViewInit {
  @ViewChild('canvasElement') canvasRef: ElementRef<HTMLCanvasElement>;
  @Input({required: true}) config: GradientConfig;
  context: CanvasRenderingContext2D;

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this._platformId)) {
      if (!this.config.autoSize && this.config.width && this.config.height) {
        this.canvasRef.nativeElement.width = this.config.width;
        this.canvasRef.nativeElement.height = this.config.height;
      }
      this.context = this.canvasRef.nativeElement.getContext('2d');
      this.context.fillStyle = 'red';
      this.context.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    }
  }
}
