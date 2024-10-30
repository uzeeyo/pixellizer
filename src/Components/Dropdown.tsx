import { ReactElement, useState } from "react";
import DropdownItem from "./DropdownItem";

interface DropdownProps {
  children?: ReactElement[];
  selectedValue: number;
  setSelectedValues: (res: number) => void;
}

export default function Dropdown(props: DropdownProps) {
  const [showItems, setShowItems] = useState<boolean>(false);

  const onDropdownClicked = () => {
    setShowItems(!showItems);
  };

  const onItemClicked = (value: number) => {
    props.setSelectedValues(value);
    setShowItems(false);
  };

  return (
    <div className="relative bg-slate-400 w-48 py-1 rounded-xl z-0">
      <p className="text-center cursor-pointer" onClick={onDropdownClicked}>
        {`${props.selectedValue}x${props.selectedValue}`}
      </p>

      {showItems && (
        <div className="absolute flex flex-col bg-slate-400 w-48 rounded-b-xl overflow-hidden">
          {[32, 64, 128, 256].map((v) => (
            <DropdownItem value={v} itemClicked={onItemClicked} />
          ))}
        </div>
      )}
    </div>
  );
}
