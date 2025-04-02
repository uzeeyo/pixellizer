let palette: number[][] = [];

export async function processImage(
  image: File,
  pixelCanvas: HTMLCanvasElement,
  palletteColors: string[],
  resolution: number
) {
  palette = convertHexToRgb(palletteColors);
  const tempCanvas = document.createElement("canvas");
  tempCanvas.hidden = true;
  const ctx = tempCanvas.getContext("2d");
  const img = new Image();
  img.src = URL.createObjectURL(image);
  await img.decode();
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const allPixels = getAllPixels(imageData.data); // [r, g, b, a, r, g, b, a, ...]
  const newPixels = pixelize(allPixels, tempCanvas.width, resolution);
  const pallettizedPixels = palettize(newPixels);

  const pixelImageData = createImageData(pallettizedPixels, resolution);

  const pixelCtx = pixelCanvas.getContext("2d");
  pixelCanvas.width = resolution;
  pixelCanvas.height = resolution;
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
  const blockSize = originalRes / targetRes;

  for (let blockY = 0; blockY < targetRes; blockY++) {
    for (let blockX = 0; blockX < targetRes; blockX++) {
      const pixelsInBlock = [];
      const blockStartY = Math.floor(blockY * blockSize);
      const blockEndY = Math.min(
        Math.ceil((blockY + 1) * blockSize),
        originalRes
      );
      const blockStartX = Math.floor(blockX * blockSize);
      const blockEndX = Math.min(
        Math.ceil((blockX + 1) * blockSize),
        originalRes
      );

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

    for (let j = 0; j < palette.length; j++) {
      const r = pixels[i][0] - palette[j][0];
      const g = pixels[i][1] - palette[j][1];
      const b = pixels[i][2] - palette[j][2];
      const delta = Math.sqrt(r * r + g * g + b * b);

      if (delta < smallestDelta) {
        smallestDelta = delta;
        closestPaletteIndex = j;
      }
    }

    palettizedPixels.push(palette[closestPaletteIndex]);
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

const convertHexToRgb = (hexColors: string[]): number[][] => {
  const parsedColors = parseColors(hexColors.join(","));
  return parsedColors.map((hex) => {
    const normalizedHex = hex.startsWith("#") ? hex.slice(1) : hex;
    const bigint = parseInt(normalizedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  });
};

export const parseColors = (input: string): string[] => {
  return input.split(/[\s,]+/).filter(Boolean);
};
