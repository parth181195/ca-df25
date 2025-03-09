export class Gradient implements GradientInterFace {
  stops: number[] = [];
  opacity: number[] = [];
  colors: string[] = [];
  hasAlpha: boolean;
  width: number;
  height: number;
  autoSize: boolean;


  constructor(config: GradientConfig) {
    this.stops = config.color.map(stop => stop.stop);
    this.opacity = config.color.map(opacity => opacity.opacity);
    this.colors = config.color.map(color => color.color);
    this.hasAlpha = config.hasAlpha;
    if (config.width) this.width = config.width;
    if (config.width) this.height = config.height;
    this.autoSize = !!config.autoSize;
  }

  value(): GradientMap[] {
    return this.stops.map((stop, index) => {
      return {
        stop,
        opacity: this.hasAlpha ? this.opacity[index] : 1,
        color: this.colors[index]
      }
    })
  }
}

export interface GradientInterFace {
  stops: number[];
  opacity: number[];
  colors: string[];
  hasAlpha: boolean;
}

export type GradientMap = {
  stop: number;
  opacity: number
  color: string
}

export type GradientConfig = {
  color: GradientMap[];
  hasAlpha: boolean;
  width?: number;
  height?: number;
  autoSize?: boolean;
}
