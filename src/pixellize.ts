const pallette = [
  [16, 18, 28],
  [44, 30, 49],
  [107, 38, 67],
  [172, 40, 71],
  [236, 39, 63],
  [148, 73, 58],
  [222, 93, 58],
  [233, 133, 55],
  [243, 168, 51],
  [77, 53, 51],
  [110, 76, 48],
  [162, 109, 63],
  [206, 146, 72],
  [218, 177, 99],
  [232, 210, 130],
  [247, 243, 183],
  [30, 64, 68],
  [0, 101, 84],
  [38, 133, 76],
  [90, 181, 82],
  [157, 230, 78],
  [0, 139, 139],
  [98, 164, 119],
  [166, 203, 150],
  [211, 238, 211],
  [62, 59, 101],
  [56, 89, 179],
  [51, 136, 222],
  [54, 197, 244],
  [109, 234, 214],
  [94, 91, 140],
  [140, 120, 165],
  [176, 167, 184],
  [222, 206, 237],
  [154, 77, 118],
  [200, 120, 175],
  [204, 153, 255],
  [250, 110, 121],
  [255, 162, 172],
  [255, 209, 213],
  [246, 232, 224],
  [255, 255, 255],
];

export async function processImage(
  image: File,
  pixelCanvas: HTMLCanvasElement
) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.hidden = true;
  const ctx = tempCanvas.getContext("2d");
  const targetRes = 64;
  const img = new Image();
  img.src = URL.createObjectURL(image);
  await img.decode();
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const allPixels = getAllPixels(imageData.data); // [r, g, b, a, r, g, b, a, ...]
  const newPixels = pixelize(allPixels, tempCanvas.width, targetRes);
  const pallettizedPixels = palettize(newPixels);

  const pixelImageData = createImageData(pallettizedPixels, targetRes);

  const pixelCtx = pixelCanvas.getContext("2d");
  pixelCanvas.width = targetRes;
  pixelCanvas.height = targetRes;
  if (!pixelCtx) return;

  pixelCtx.imageSmoothingEnabled = false;
  pixelCtx.putImageData(pixelImageData, 0, 0);
}

function getAllPixels(pixels: Uint8ClampedArray) {
  const pixelGroups = [];
  for (let i = 0; i < pixels.length; i += 4) {
    pixelGroups.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
  }
  return pixelGroups;
}

function pixelize(pixels: number[][], originalRes: number, targetRes: number) {
  const newPixels = [];
  const blockSize = Math.floor(originalRes / targetRes);

  for (let blockY = 0; blockY < targetRes; blockY++) {
    for (let blockX = 0; blockX < targetRes; blockX++) {
      const pixelsInBlock = [];
      const blockStartY = Math.floor(blockY * blockSize);
      const blockEndY = Math.floor(blockStartY + blockSize);
      const blockStartX = Math.floor(blockX * blockSize);
      const blockEndX = Math.floor(blockStartX + blockSize);

      for (let y = blockStartY; y < blockEndY; y++) {
        for (let x = blockStartX; x < blockEndX; x++) {
          const index = y * originalRes + x;
          if (index < pixels.length) {
            pixelsInBlock.push(pixels[index]);
          }
        }
      }

      const avgPixel = averageColor(pixelsInBlock);
      newPixels.push([...avgPixel]);
    }
  }
  return newPixels;
}

function palettize(pixels: number[][]) {
  let palettizedPixels = [];

  for (let i = 0; i < pixels.length; i++) {
    let smallestDelta = Number.MAX_VALUE;
    let closestPaletteIndex = 0;

    for (let j = 0; j < pallette.length; j++) {
      const r = pixels[i][0] - pallette[j][0];
      const g = pixels[i][1] - pallette[j][1];
      const b = pixels[i][2] - pallette[j][2];
      const delta = Math.sqrt(r * r + g * g + b * b);

      if (delta < smallestDelta) {
        smallestDelta = delta;
        closestPaletteIndex = j;
      }
    }

    palettizedPixels.push(pallette[closestPaletteIndex]);
  }

  return palettizedPixels;
}

function averageColor(pixels: number[][]) {
  const total = pixels.length;
  const avg = pixels.reduce(
    (acc, pixel) => {
      acc[0] += pixel[0];
      acc[1] += pixel[1];
      acc[2] += pixel[2];
      return acc;
    },
    [0, 0, 0]
  );
  return avg.map((val) => Math.floor(val / total));
}

function createImageData(pixels: number[][], res: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageData = ctx!.createImageData(res, res);

  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    const index = i * 4;
    imageData.data[index] = pixel[0]; // R
    imageData.data[index + 1] = pixel[1]; // G
    imageData.data[index + 2] = pixel[2]; // B
    imageData.data[index + 3] = 255; // A
  }

  return imageData;
}
