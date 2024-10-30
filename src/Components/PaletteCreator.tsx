import { HexColorInput, HexColorPicker } from "react-colorful";
import ColorBlock from "./ColorBlock";
import { useState } from "react";

interface PaletteProps {
  paletteChanged: (colors: string[]) => void;
}

export default function PaletteCreator(props: PaletteProps) {
  const [color, setColor] = useState("#000000");
  const [paletteColors, setPaletteColors] = useState<string[]>(["#000000"]);

  const onAddColorClicked = () => {
    setPaletteColors([...paletteColors, color]);
  };

  const onClearColorsCLicked = () => {
    setPaletteColors([]);
  };

  return (
    <div className="flex flex-row gap-8 mt-6">
      <div className="flex flex-col">
        <HexColorPicker
          className="color-picker"
          color={color}
          onChange={setColor}
        />
        <HexColorInput
          color={color}
          onChange={setColor}
          className="text-black w-40 px-2 mt-4 mx-auto rounded-lg"
          placeholder="Hex value"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row flex-wrap gap-3 mb-6 mt-auto">
          {paletteColors.map((color, index) => (
            <ColorBlock id={`cb${index}`} color={color} />
          ))}
        </div>

        <input
          className="px-2 py-1 w-[40rem] rounded-lg text-black"
          type="text"
          placeholder="Paste colors"
        />

        <div className="flex flex-row gap-5 mt-1 mb-2">
          <button onClick={onAddColorClicked}>Add</button>
          <button onClick={onClearColorsCLicked}>Clear</button>
        </div>
      </div>
    </div>
  );
}
