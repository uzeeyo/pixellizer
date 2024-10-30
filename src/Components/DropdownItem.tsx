interface DropdownItemProps {
  value: number;
  itemClicked: (value: number) => void;
}

export default function DropdownItem(props: DropdownItemProps) {
  return (
    <p
      onClick={() => props.itemClicked(props.value)}
      className="text-center border-lg hover:bg-slate-500 cursor-pointer"
    >{`${props.value}x${props.value}`}</p>
  );
}
