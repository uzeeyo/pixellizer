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
    <div className="relative w-48">
      <div className="bg-[#2f2f2f] py-1 pixel-border">
        <p
          className="text-center cursor-pointer select-none"
          onClick={onDropdownClicked}
        >
          {`${props.selectedValue}x${props.selectedValue}`}
        </p>
      </div>

      {showItems && (
        <div className="absolute top-full left-0 flex flex-col bg-[#2f2f2f] w-48 overflow-hidden pixel-border">
          {[32, 64, 128, 256].map((v) => (
            <DropdownItem value={v} itemClicked={onItemClicked} />
          ))}
        </div>
      )}
    </div>
  );
}
