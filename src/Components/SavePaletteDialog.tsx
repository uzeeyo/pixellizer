import { useState } from "react";
import { Palette } from "../App";

interface SavePaletteDialogProps {
  activePalette: Palette;
  setActivePalette: (palette: Palette) => void;
  save: () => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

function SavePaletteDialog(props: SavePaletteDialogProps) {

  const handleSave = () => {
    props.save();
    props.setVisible(false);
  };

  return (
    <div
      className={`fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-90 flex items-center justify-center ${
        props.visible ? "block" : "hidden"
      }`}
    >
      <div className="bg-[#161616] p-6 shadow-lg max-w-md w-full">
        <h1 className="text-white text-2xl text-center font-bold mb-4">Save Palette</h1>

        <div className="mb-4">
          <input
            id="paletteName"
            type="text"
            value={props.activePalette.name}
            onChange={(e) => props.setActivePalette({ ...props.activePalette, name: e.target.value })}
            className="pixel-input w-full"
            placeholder="Enter palette name"
          />
        </div>

        <div className="flex justify-center gap-2">
          <button
            className="pixel-button"
            onClick={() => {
              props.setVisible(false);
            }}
          >
            Cancel
          </button>
          <button
            className="pixel-button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SavePaletteDialog;
