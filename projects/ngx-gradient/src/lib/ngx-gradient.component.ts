import {AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Gradient, GradientConfig} from "./classes/gradient";
import {HandleComponent} from "./handle/handle.component";

@Component({
  selector: 'lib-ngx-gradient',
  standalone: true,
  imports: [
    HandleComponent
  ],
  templateUrl: './ngx-gradient.component.html',
  styleUrl: 'ngx-gradient.component.sass'
})
export class NgxGradientComponent implements AfterViewInit {
  @ViewChild('canvasElement') canvasRef: ElementRef<HTMLCanvasElement>;
  @Input({required: true}) config: GradientConfig;
  context: CanvasRenderingContext2D;
  gradient: Gradient;

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {

  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() => {
        this.gradient = new Gradient(this.config);
      });
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
