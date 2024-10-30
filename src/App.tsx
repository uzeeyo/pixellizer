import React, { useEffect, useState } from "react";
import { processImage } from "./pixellize";
import PaletteCreator from "./Components/PaletteCreator";
import Dropdown from "./Components/Dropdown";

function App() {
  const [image, setImage] = React.useState<File | null>(null);
  const [dragBoxText, setDragBoxText] = React.useState(
    "Drop an image to start."
  );
  const [resolution, setResolution] = useState<number>(64);
  const [paletteColors, setPaletteColors] = useState<string[]>([
    "#fff4e0",
    "#8fcccb",
    "#449489",
    "#285763",
    "#2f2b5c",
    "#4b3b9c",
    "#457cd6",
    "#f2b63d",
    "#d46e33",
    "#e34262",
    "#94353d",
    "#57253b",
    "#9c656c",
    "#d1b48c",
    "#b4ba47",
    "#6d8c32",
    "#2c1b2e",
  ]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImage(file);
        e.dataTransfer.clearData();
        if (paletteColors.length == 0) return;
        processImage(
          file,
          document.getElementById("pixelCanvas") as HTMLCanvasElement,
          paletteColors,
          resolution
        );
      } else {
        setDragBoxText("Please drop a valid image file.");
      }
    }
  };

  const onResolutionChanged = () => {};

  useEffect(() => {
    if (image && paletteColors.length > 0) {
      processImage(
        image,
        document.getElementById("pixelCanvas") as HTMLCanvasElement,
        paletteColors,
        resolution
      );
    }
  }, [paletteColors]);

  return (
    <div className="text-white text-xl flex flex-col mt-5 mx-64">
      <h1 className="mx-auto text-[6rem] font-pixel my-20">
        {"Pixellizer".split("").map((char, index) => (
          <span
            key={index}
            style={{
              color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            }}
          >
            {char}
          </span>
        ))}
      </h1>

      <div className="flex flex-row gap-5 justify-center">
        <div
          className="h-[256px] w-[256px] rounded-lg bg-slate-400  relative"
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragBoxText("Drop here!");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragBoxText("Drop an image to start.");
          }}
        >
          <div
            hidden={image != null}
            className="absolute inset-1 border-2 border-dashed border-white rounded-lg pointer-events-none"
          ></div>
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Input Image"
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <p className="text-black text-2xl flex items-center justify-center h-full">
              {dragBoxText}
            </p>
          )}
        </div>
        <div className="h-[256px] w-[256px] rounded-lg bg-slate-400">
          <canvas id="pixelCanvas" className="h-full w-full"></canvas>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <h3 className="text-2xl">Palette</h3>
        <div className="border-b-[1px] border-slate-300 mb-2"></div>

        <PaletteCreator
          paletteColors={paletteColors}
          setPaletteColors={setPaletteColors}
        />

        <div className="mt-8">
          <h3 className="text-2xl">Dimensions</h3>
          <div className="border-b-[1px] border-slate-300 mb-2"></div>
          <Dropdown
            selectedValue={resolution}
            setSelectedValues={setResolution}
          ></Dropdown>
        </div>
      </div>
      <button className="py-1 px-6 mx-auto bg-green-600 hover:bg-green-800 transition-colors duration-300 rounded-full">
        Download
      </button>

      <div className="flex flex-col mx-auto w-[40rem]">
        <h3 className="mt-20 mb-4 text-5xl text-center">About</h3>
        <div className="border-b-[1px] border-slate-300 mb-2"></div>
        <p className="">
          Pixellizer is a free tool to convert existing art into pixel art while
          conforming to a specified palette. If you found it useful you could
          consider supporting me.
          <br />
          <br />
          No pressure though, this tool is free to use and open source!
          <span>
            <img
              className="mt-10 mb-20 rounded-3xl mx-auto w-[15rem]"
              src="data:image/png;base64,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"
            />
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;
