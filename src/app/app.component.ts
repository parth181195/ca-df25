import {AfterViewInit, Component, inject, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {G, SVG, Svg} from '@svgdotjs/svg.js'
import {path1, path2} from "./const/svg-path";
import {getGradientColor} from "./utls/grab-color";
import {ControlsComponent} from "./controls/controls.component";
import {isPlatformBrowser} from "@angular/common";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {Pane} from "tweakpane";
import {GradPickerComponent} from "./components/grad-picker/grad-picker.component";
import {MatDialog} from "@angular/material/dialog";
import {alpha, toHex, toObject, toRgb} from "@wojtekmaj/color-utils";
import {NgxGradientComponent, GradientConfig} from "ngx-gradient";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ControlsComponent, CdkDrag, NgxGradientComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('genWrapper',) genWrapper: any;
  draw: Svg;
  readonly dialog = inject(MatDialog);
  stops = [0.58, 0.85, 0.97];
  opacityStops = [0.12, 0.33, .12];
  palette = ["#b74af7", "#ff318c", "#fcf84a"]
  colorMap = this.stops.map((stop, index) => ({
    position: stop,
    color: this.palette[index],
    opacity: this.opacityStops[index]
  }))
  pickerConfig: GradientConfig = {
    color: this.stops.map((stop, index) => ({
      stop,
      color: this.palette[index],
      opacity: this.opacityStops[index]
    })),
    width: 300,
    height: 50,
    hasAlpha: true
  }
  innerWidth;
  innerHeight;
  private group: G;
  isDown = false;
  dragCenter = {x: 0, y: 0}
  private pane: any;
  params = {
    ...DEFAULT_PARAMS
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {

  }

  ngAfterViewInit() {
    // if (isPlatformBrowser(this._platformId)) {
    //   this.innerWidth = window?.innerWidth;
    //   this.innerHeight = window?.innerHeight;
    //   this.draw = SVG().addTo(this.genWrapper.nativeElement)
    //   this.draw.size(this.innerWidth, this.innerHeight)
    //   this.genWrapper.nativeElement.style.background = 'black'
    //   this.params = JSON.parse(localStorage.getItem('params')) || {...DEFAULT_PARAMS}
    //   this.group = this.draw.group()
    //   this.setUpGUI()
    //   this.setUpDrag()
    //   console.log(this.colorMap)
    //   this.generateArtwork()
    // }
  }


  generateArtwork() {
    const arr = Array.from(Array(this.params.count).keys())
    const artwork = arr.map((_, index) => {
      const i = this.params.reverse ? arr.length - index : index;
      const percent = 100 / arr.length * (this.params.reverseStroke ? arr.length - index : index + 1);
      const colors = this.params.reverseStroke ? [...this.colorMap].reverse() : [...this.colorMap]
      const exponential = this.params.isExponential ? Math.pow(this.params.exponentialFactor, i) : 1
      return {
        path: path1,
        growth: ((this.params.growth * i) * exponential) + this.params.startScale,
        shiftX: (this.params.shiftX * i) * exponential,
        shiftY: (this.params.shiftY * i) * exponential,
        angle: ((this.params.angle * i)) + this.params.startRotation,
        gradient: this.draw.gradient('linear', (add) => {
          this.colorMap.forEach((stop, index) => {
            add.stop(stop.position, stop.color, stop.opacity)
          })
        }),
        attr: {
          stroke: getGradientColor(colors, percent),
          'stroke-width': this.params.stroke,
          'stroke-opacity': toObject(getGradientColor(colors, percent)).a / 255,
        }
      }
    })
    artwork.forEach(art => this.drawArtwork(art))
  }

  drawArtwork(art) {
    const p1 = this.group.path(art.path)
    const bBox = () => p1.bbox()
    const x = innerWidth / 2 - p1.bbox().width / 2
    const y = innerHeight / 2 - p1.bbox().height / 2
    p1.move(x, y)
    p1.fill(art.gradient)
    const attr = {
      'vector-effect': "non-scaling-stroke",
      transform: `scale(${art.growth}) rotate(${art.angle}) translate(${art.shiftX} ${art.shiftY})`,
      'transform-origin': `${bBox().cx} ${bBox().cy}`,
      ...art.attr
    }
    p1.attr(attr)

    if (this.params.drawBbox) {
      this.group.rect(p1.bbox().width, p1.bbox().height).move(bBox().x, bBox().y).fill('none').stroke('red').rotate(5 * art.growth).attr({
        transform: attr.transform,
        'vector-effect': "non-scaling-stroke",
        'transform-origin': attr['transform-origin']
      })
    }
    if (this.params.drawCenter) {
      this.group.circle(3).move(p1.bbox().cx - 3, p1.bbox().cy - 3).fill('red')
    }
  }

  setUpDrag() {
    this.group.mousedown((e) => {
      e.stopPropagation()
      this.isDown = true;
      this.dragCenter = {x: e.clientX, y: e.clientY}
    })

    this.group.mousemove((e) => {
      e.stopPropagation()
      if (!this.isDown) return;
      const x = e.clientX - this.dragCenter.x
      const y = e.clientY - this.dragCenter.y
      this.group.translate(x, y)
      this.dragCenter = {x: e.clientX, y: e.clientY}
    })
    this.group.mouseup((e) => {
      e.stopPropagation()
      this.isDown = false;
    })
    this.group.mouseleave((e) => {
      e.stopPropagation()
      this.isDown = false;
    })
  }

  setUpGUI() {

    this.pane = new Pane();
    Object.entries(FOLDERS).forEach(([folder, params]) => {
      const f = this.pane.addFolder({
        title: folder,
        expanded: true,
      });
      params.forEach(param => {
        if (this.params[param] === undefined) return;
        const config = DEFAULT_CONFIG[param] || {}
        f.addBinding(this.params, param, {
          ...config
        }).on('change', (ev) => {
          this.group.clear()
          this.generateArtwork()
        });
        ;
      })
    })

    const btn = this.pane.addButton({
      title: 'Gradiant',
      label: 'Gradiant',   // optional
    });

    btn.on('click', () => {
      let dialogRef = this.dialog.open(GradPickerComponent, {data: {colorMap: this.colorMap}});
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.colorMap = result.map((e, index) => {
            return {
              position: e.position / 100,
              color: toHex(alpha(e.color, 1)),
              opacity: toObject(e.color).a ?? 1
            }
          })
          console.log(this.colorMap)
          this.group.clear()
          this.generateArtwork()
        }
      });
    });

    const save = this.pane.addButton({
      title: 'save',
      label: 'save',   // optional
    });
    save.on('click', () => {
      localStorage.setItem('params', JSON.stringify(this.params))
    })
  }
}

const DEFAULT_PARAMS = {
  count: 13,
  growth: 1.2,
  angle: 1,
  shiftX: 0,
  shiftY: 0,
  isExponential: false,
  exponentialFactor: 1,
  reverse: true,
  drawCenter: false,
  drawBbox: false,
  startRotation: 0,
  startScale: 1,
  expVal: 0,
  stroke: 1,
  strokeOpacity: 0.5,
  reverseStroke: false,
}
const FOLDERS = {
  general: [
    'count',
    'growth',
    'exponentialFactor',
    'isExponential',
    'reverse',
  ],
  debug: [
    'drawCenter',
    'drawBbox',
  ],
  geometry: [
    'angle',
    'shiftX',
    'shiftY',
    'startRotation',
    'startScale',
    'rotation',
  ],
  stroke: [
    'stroke',
    'strokeOpacity',
    'reverseStroke',
    'enableDifferentStrokeGradient',
    'strokeGradiant',
  ],
  fill: [
    'gradient',
    'reverseGradient',
  ]
}


const DEFAULT_CONFIG = {
  count: {
    step: 1,
    min: 0,
    max: 200,
  },
  growth: {
    step: 0.01,
    min: 0,
    max: 5,
  },
  exponentialFactor: {
    step: 0.01,
    min: 0,
    max: 2,
  },
  startRotation: {
    step: 1,
    min: 0,
    max: 360,
  },
  stroke: {
    step: 0.1,
    min: 0,
    max: 10,
  },
  shiftX: {
    step: 0.1,
  }, shiftY: {
    step: 0.1,
  },
  strokeOpacity: {
    step: 0.05,
    min: 0,
    max: 1,
  }
}
