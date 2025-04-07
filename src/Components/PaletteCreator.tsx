import { HexColorInput, HexColorPicker } from "react-colorful";
import ColorBlock from "./ColorBlock";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { parseColors } from "../pixellize";
import SavePaletteDialog from "./SavePaletteDialog";
import { Palette, SavedPalettes } from "../App";
import Dropdown from "./Dropdown";

interface PaletteProps {
  activePalette: Palette;
  setActivePallete: (x: Palette) => void;
  setSaveDialogVisible: (visible: boolean) => void;
  selectedResolution: number;
  setSelectedResolution: (resolution: number) => void;
}


export default function PaletteCreator(props: PaletteProps) {
  const [color, setColor] = useState("#000000");
  const inputRef = useRef<HTMLInputElement>(null);

  const onAddColorClicked = () => {
    const newColors = [...props.activePalette.colors, color];
    props.setActivePallete({
      name: props.activePalette.name,
      colors: newColors,
    });
    if (inputRef.current) {
      inputRef.current.value = newColors.join(", ");
    }
  };

  const onClearColorsCLicked = () => {
    props.setActivePallete({
      name: props.activePalette.name,
      colors: [],
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onRemoveColor = (index: number) => {
    const newColors = props.activePalette.colors.filter((_, i) => i !== index);
    props.setActivePallete({
      name: props.activePalette.name,
      colors: newColors,
    });
    if (inputRef.current) {
      inputRef.current.value = newColors.join(", ");
    }
  };

  const onSavePaletteCLicked = () => {
    props.setSaveDialogVisible(true);
  };


  useEffect(() => {
    localStorage.setItem("activePalette", JSON.stringify(props.activePalette));
  }, [props.activePalette]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = props.activePalette.colors.join(", ");
    }
  }, [props.activePalette]);


  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-6">
      <div className="flex flex-col items-center gap-4">
        <div className="pixel-border p-4 rounded-lg">
          <HexColorPicker
            className="color-picker"
            color={color}
            onChange={setColor}
          />
          <HexColorInput
            color={color}
            onChange={setColor}
            className="pixel-input w-40 px-2 mt-4 mx-auto rounded-lg"
            placeholder="Hex value"
          />
        </div>
        <Dropdown
          selectedValue={props.selectedResolution}
          setSelectedValues={props.setSelectedResolution}
        ></Dropdown>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row flex-wrap gap-3 mb-6 mt-auto">
          {props.activePalette.colors.map((color, index) => (
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
          className="pixel-input w-full rounded-lg"
          type="text"
          placeholder="Paste colors"
          defaultValue={props.activePalette.colors.join(", ")}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const colors = parseColors(e.target.value);
            props.setActivePallete({
              name: props.activePalette.name,
              colors: colors,
            });
          }}
        />

        <div className="flex flex-row gap-4 mt-4 mb-2">
          <button className="pixel-button" onClick={onAddColorClicked}>
            Add
          </button>
          <button className="pixel-button" onClick={onClearColorsCLicked}>
            Clear
          </button>
          <button className="pixel-button" onClick={onSavePaletteCLicked}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
