import {alpha} from "@wojtekmaj/color-utils";

export const getGradientColor = (colorStops, position) => {

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const gr = ctx.createLinearGradient(0, 0, 101, 0);

  canvas.width = 101;
  canvas.height = 1;

  for (const {position, color, opacity} of colorStops) {
    gr.addColorStop(position, alpha(color, opacity));
  }

  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 101, 1);
  const uint8 = ctx.getImageData(position | 0, 0, 1, 1).data;

  return `rgba(${uint8[0]}, ${uint8[1]}, ${uint8[2]}, ${uint8[3]})`;
}

