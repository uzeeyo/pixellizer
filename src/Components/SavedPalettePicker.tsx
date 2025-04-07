import { Palette } from "../App";
import { SavedPalettes } from "../App";

interface SavedPalettePickerProps {
  savedPalettes: SavedPalettes;
  onPaletteChange: (palette: Palette) => void;
}

interface SavedPaletteBlockProps {
  palette: Palette;
  onPaletteChange: (palette: Palette) => void;
}

function SavedPaletteBlock(props: SavedPaletteBlockProps) {
  return (
    <div className="pixel-button cursor-pointer" onClick={() => props.onPaletteChange(props.palette)}>
      <div className="text-white text-sm mb-1 text-center">{props.palette.name}</div>
      <div className="flex flex-wrap w-[8rem] max-w-[8rem] mx-auto">
        {props.palette.colors.map((color, index) => (
          <div
            style={{
              backgroundColor: color,
              width: "1rem",
              height: "1rem",
              display: "block",
            }}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

function SavedPalettePicker(props: SavedPalettePickerProps) {
  return (
    <div className="mt-10">
      <h3 className="text-2xl">Saved Palettes</h3>
      <div className="border-b-[1px] border-slate-300 mb-4"></div>
      <div className="flex flex-row gap-4 flex-wrap">
        {props.savedPalettes.palettes.map((palette) => (
          <SavedPaletteBlock
            key={palette.name}
            palette={palette}
            onPaletteChange={props.onPaletteChange}
          />
        ))}
      </div>
    </div>
  );
}

export default SavedPalettePicker;
