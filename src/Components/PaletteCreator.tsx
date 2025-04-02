import { HexColorInput, HexColorPicker } from "react-colorful";
import ColorBlock from "./ColorBlock";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { parseColors } from "../pixellize";

interface PaletteProps {
  paletteColors: string[];
  setPaletteColors: (x: string[]) => void;
}

export default function PaletteCreator(props: PaletteProps) {
  const [color, setColor] = useState("#000000");
  const inputRef = useRef<HTMLInputElement>(null);

  const onAddColorClicked = () => {
    const newColors = [...props.paletteColors, color];
    props.setPaletteColors(newColors);
    if (inputRef.current) {
      inputRef.current.value = newColors.join(", ");
    }
  };

  const onClearColorsCLicked = () => {
    props.setPaletteColors([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onRemoveColor = (index: number) => {
    const newColors = props.paletteColors.filter((_, i) => i !== index);
    props.setPaletteColors(newColors);
    if (inputRef.current) {
      inputRef.current.value = newColors.join(", ");
    }
  };

  useEffect(() => {
    localStorage.setItem("palette", JSON.stringify(props.paletteColors));
  }, [props.paletteColors]);

  useEffect(() => {
    const savedPalette = localStorage.getItem("palette");
    if (savedPalette) {
      props.setPaletteColors(JSON.parse(savedPalette));
    }
  }, []);

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
          {props.paletteColors.map((color, index) => (
            <ColorBlock
              key={`cb${index}`}
              id={`cb${index}`}
              color={color}
              onRemove={() => onRemoveColor(index)}
            />
          ))}
        </div>

        <input
          ref={inputRef}
          className="px-2 py-1 w-[40rem] rounded-lg text-black"
          type="text"
          placeholder="Paste colors"
          defaultValue={props.paletteColors.join(", ")}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const colors = parseColors(e.target.value);
            props.setPaletteColors(colors);
          }}
        />

        <div className="flex flex-row gap-5 mt-1 mb-2">
          <button onClick={onAddColorClicked}>Add</button>
          <button onClick={onClearColorsCLicked}>Clear</button>
        </div>
      </div>
    </div>
  );
}
