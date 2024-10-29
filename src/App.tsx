import React, { useEffect } from "react";
import { processImage } from "./pixellize";

function App() {
  const [image, setImage] = React.useState<File | null>(null);
  const [dragBoxText, setDragBoxText] = React.useState(
    "Drop an image to start."
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setImage(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      processImage(e.dataTransfer.files[0], document.getElementById("pixelCanvas") as HTMLCanvasElement);
    }
  };

  return (
    <div className="text-white text-xl flex flex-col mt-5 mx-20">
      <h1 className="mx-auto">Title</h1>

      <div className="flex flex-row gap-5 justify-center">
        <div
          className="min-h-[512px] w-[512px] rounded-lg bg-slate-400"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="image"
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <p className="text-black text-2xl flex items-center justify-center h-full">
              {dragBoxText}
            </p>
          )}
        </div>
        <div className="min-h-[512px] w-[512px] rounded-lg bg-slate-400">
          <canvas id="pixelCanvas" className="h-full w-full"></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
